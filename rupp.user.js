// ==UserScript==
// @name         RUPP eLearning Tools
// @name:en      RUPP eLearning Tools
// @version      1.2.3
// @namespace    https://github.com/huotmoonirott
// @description  Video speed controls for RUPP Moodle eLearning
// @author       MOONJAE
// @license      GNU GPLv3
// @match        https://elearning.rupp.edu.kh/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // ─── LOGGER ──────────────────────────────────────────────────────────────────
  const logger = {
    info: (msg) => console.log(`[RUPP Tools] ${msg}`),
    error: (msg) => console.error(`[RUPP Tools] ${msg}`),
  };

  // ─── CONSTANTS ───────────────────────────────────────────────────────────────
  const REFRESH_DELAY = 800;
  const SPEED_PRESETS = [0.75, 1, 1.25, 1.5, 2, 4, 8, 10, 16];
  const MIN_FRAME_WIDTH = 420;
  const MIN_FRAME_HEIGHT = 280;
  const MAX_IFRAME_DEPTH = 3;

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let controlBarInjected = false;
  let currentSpeed = 1.0;
  let requestedSpeed = 1.0;
  let turboActive = false;
  let turboTargetSpeed = 1.0;
  let turboBaseSpeed = 1.0;
  let turboVideo = null;
  let turboFrame = null;
  let turboLastTime = 0;

  const isElementVisible = (el) => {
    if (!el) return false;
    const view = el.ownerDocument?.defaultView || window;
    const style = view.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const hasLocalVideo = () => {
    const videos = document.querySelectorAll("video");
    for (const video of videos) {
      if (isElementVisible(video)) return true;
    }
    return false;
  };

  const isLargeViewport = () =>
    window.innerWidth >= MIN_FRAME_WIDTH &&
    window.innerHeight >= MIN_FRAME_HEIGHT;

  const isSameOriginIframe = (iframe) => {
    try {
      if (iframe.contentDocument) return true;
    } catch (_) {}

    const src = iframe.getAttribute("src") || "";
    if (!src) return true;

    try {
      return (
        new URL(src, window.location.href).origin === window.location.origin
      );
    } catch (_) {
      return false;
    }
  };

  const hasLargeSameOriginIframe = () => {
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      if (!isSameOriginIframe(iframe)) continue;
      if (!isElementVisible(iframe)) continue;
      const rect = iframe.getBoundingClientRect();
      if (rect.width >= MIN_FRAME_WIDTH && rect.height >= MIN_FRAME_HEIGHT) {
        return true;
      }
    }
    return false;
  };

  const hasSameOriginIframeVideo = () => {
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      if (!isSameOriginIframe(iframe)) continue;
      if (!isElementVisible(iframe)) continue;
      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) continue;
        const videos = iframeDoc.querySelectorAll("video");
        for (const video of videos) {
          if (isElementVisible(video)) return true;
        }
      } catch (_) {}
    }
    return false;
  };

  const collectVideos = (rootDoc, depth, results, onlyVisible) => {
    const videos = rootDoc.querySelectorAll("video");
    for (const video of videos) {
      if (onlyVisible && !isElementVisible(video)) continue;
      results.push(video);
    }

    if (depth <= 0) return;
    const iframes = rootDoc.querySelectorAll("iframe");
    for (const iframe of iframes) {
      if (!isSameOriginIframe(iframe)) continue;
      if (onlyVisible && !isElementVisible(iframe)) continue;
      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) continue;
        collectVideos(iframeDoc, depth - 1, results, onlyVisible);
      } catch (_) {}
    }
  };

  const getVideoScore = (video) => {
    let score = 0;
    if (!video.paused) score += 10000;
    if (!video.ended) score += 1000;
    if (video.readyState >= 2) score += 500;
    if (video.currentTime > 0) score += 200;
    const rect = video.getBoundingClientRect();
    score += rect.width * rect.height;
    return score;
  };

  const pickBestVideo = (videos) => {
    let best = null;
    let bestScore = -Infinity;
    for (const video of videos) {
      const score = getVideoScore(video);
      if (score > bestScore) {
        best = video;
        bestScore = score;
      }
    }
    return best;
  };

  const shouldShowControlBar = () => {
    if (hasLocalVideo()) return true;
    if (hasLargeSameOriginIframe() || hasSameOriginIframeVideo()) return false;
    return isLargeViewport();
  };

  let isUiController = false;

  // ─── INJECT STYLES ───────────────────────────────────────────────────────────
  (function injectStyles() {
    if (document.getElementById("rupp-tools-styles")) return;
    const style = document.createElement("style");
    style.id = "rupp-tools-styles";
    style.textContent = `
      /* ── Floating control bar ─────────────────────────────────── */
      #rupp-control-bar {
        position: fixed;
        bottom: 22px;
        right: 22px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
        font-family: 'Segoe UI', system-ui, sans-serif;
      }

      /* Speed panel */
      #rupp-speed-panel {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        justify-content: flex-end;
        max-width: 260px;
        background: rgba(15, 20, 35, 0.92);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 6px 10px;
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        transition: opacity 0.2s ease;
      }

      #rupp-speed-panel .rupp-label {
        color: rgba(255,255,255,0.45);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-right: 3px;
        white-space: nowrap;
      }

      .rupp-speed-btn {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 7px;
        color: rgba(255,255,255,0.7);
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
        font-family: inherit;
      }

      .rupp-speed-btn:hover {
        background: rgba(99, 179, 237, 0.2);
        border-color: rgba(99, 179, 237, 0.4);
        color: #63b3ed;
        transform: translateY(-1px);
      }

      .rupp-speed-btn.active {
        background: rgba(99, 179, 237, 0.25);
        border-color: #63b3ed;
        color: #90cdf4;
        box-shadow: 0 0 8px rgba(99, 179, 237, 0.3);
      }

      /* Toast notification */
      #rupp-toast {
        position: fixed;
        top: 20px;
        right: 22px;
        z-index: 99999;
        background: rgba(15, 20, 35, 0.92);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 9px 16px;
        color: rgba(255,255,255,0.85);
        font-size: 12.5px;
        font-weight: 500;
        font-family: 'Segoe UI', system-ui, sans-serif;
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
        max-width: 260px;
      }

      #rupp-toast.show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  })();

  // ─── TOAST ───────────────────────────────────────────────────────────────────
  let toastTimeout = null;
  const showToast = (message, duration = 2000) => {
    let toast = document.getElementById("rupp-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "rupp-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  };

  // ─── VIDEO HELPERS ────────────────────────────────────────────────────────────
  const getActiveVideo = () => {
    const visibleVideos = [];
    collectVideos(document, MAX_IFRAME_DEPTH, visibleVideos, true);
    if (visibleVideos.length) return pickBestVideo(visibleVideos);

    const allVideos = [];
    collectVideos(document, MAX_IFRAME_DEPTH, allVideos, false);
    if (allVideos.length) return pickBestVideo(allVideos);

    return null;
  };

  const setVideoSpeed = (speed) => {
    const video = getActiveVideo();
    if (!video) {
      showToast("⚠️ No video found on this page");
      return false;
    }
    requestedSpeed = speed;
    video.playbackRate = speed;
    const appliedSpeed = video.playbackRate;
    currentSpeed = appliedSpeed;
    // Update button states
    document.querySelectorAll(".rupp-speed-btn").forEach((btn) => {
      btn.classList.toggle(
        "active",
        parseFloat(btn.dataset.speed) === requestedSpeed,
      );
    });
    if (Math.abs(appliedSpeed - speed) > 0.01) {
      ensureTurbo(video, speed, appliedSpeed);
      showToast(`⚠️ Speed limited to ${appliedSpeed}x (turbo on)`);
    } else {
      stopTurbo();
      showToast(`▶ Speed: ${appliedSpeed}x`);
    }
    return true;
  };

  const stopTurbo = () => {
    turboActive = false;
    turboTargetSpeed = 1.0;
    turboBaseSpeed = 1.0;
    turboVideo = null;
    if (turboFrame) {
      cancelAnimationFrame(turboFrame);
      turboFrame = null;
    }
  };

  const startTurbo = (video, targetSpeed, baseSpeed) => {
    if (!video) return;
    turboActive = true;
    turboTargetSpeed = targetSpeed;
    turboBaseSpeed = baseSpeed;
    turboVideo = video;
    turboLastTime = performance.now();

    if (turboFrame) cancelAnimationFrame(turboFrame);
    const step = (now) => {
      if (!turboActive || turboVideo !== video) return;
      const dt = Math.max(0, (now - turboLastTime) / 1000);
      turboLastTime = now;

      if (!video.paused && !video.ended) {
        const extra = Math.max(turboTargetSpeed - turboBaseSpeed, 0);
        if (extra > 0) {
          const nextTime = (video.currentTime || 0) + dt * extra;
          video.currentTime = Math.min(nextTime, video.duration || nextTime);
        }
      }
      turboFrame = requestAnimationFrame(step);
    };
    turboFrame = requestAnimationFrame(step);
  };

  const ensureTurbo = (video, targetSpeed, baseSpeed) => {
    if (
      turboActive &&
      turboVideo === video &&
      turboTargetSpeed === targetSpeed &&
      Math.abs(turboBaseSpeed - baseSpeed) < 0.01
    ) {
      return;
    }
    startTurbo(video, targetSpeed, baseSpeed);
  };

  const removeControlBar = () => {
    const bar = document.getElementById("rupp-control-bar");
    if (bar) bar.remove();
    controlBarInjected = false;
    stopTurbo();
  };

  const syncControlBar = () => {
    const shouldShow = shouldShowControlBar();
    if (shouldShow && !controlBarInjected) buildControlBar();
    if (!shouldShow && controlBarInjected) removeControlBar();
    isUiController = shouldShow;
    return shouldShow;
  };

  // ─── BUILD CONTROL BAR ────────────────────────────────────────────────────────
  const buildControlBar = () => {
    if (controlBarInjected || !document.body) return;
    controlBarInjected = true;

    const bar = document.createElement("div");
    bar.id = "rupp-control-bar";

    // Speed panel
    const speedPanel = document.createElement("div");
    speedPanel.id = "rupp-speed-panel";
    const speedLabel = document.createElement("span");
    speedLabel.className = "rupp-label";
    speedLabel.textContent = "Speed";
    speedPanel.appendChild(speedLabel);

    SPEED_PRESETS.forEach((s) => {
      const btn = document.createElement("button");
      btn.className = "rupp-speed-btn" + (s === 1 ? " active" : "");
      btn.dataset.speed = s;
      btn.textContent = s === 1 ? "1x" : `${s}x`;
      btn.title = `Set speed to ${s}x`;
      btn.onclick = () => setVideoSpeed(s);
      speedPanel.appendChild(btn);
    });
    bar.appendChild(speedPanel);

    document.body.appendChild(bar);

    logger.info("Control bar injected");
  };

  // ─── PERIODIC REFRESH ────────────────────────────────────────────────────────
  setInterval(() => {
    const canControl = syncControlBar();
    if (!canControl) {
      stopTurbo();
      return;
    }

    const video = getActiveVideo();

    if (video) {
      // BUG FIX #2: Instead of only re-applying speed on the 800ms interval
      // tick (which causes a brief 1x flash when a new video loads), also
      // attach a `canplay` listener to the video element so speed is restored
      // the moment the new video is ready to play — not just on the next tick.
      if (video.dataset.ruppSpeedListenerAttached !== "true") {
        video.dataset.ruppSpeedListenerAttached = "true";
        video.addEventListener("canplay", () => {
          if (requestedSpeed !== 1.0) {
            video.playbackRate = requestedSpeed;
          }
        });
      }

      // Interval fallback: still re-apply if somehow playbackRate drifted
      if (video.playbackRate !== requestedSpeed && requestedSpeed !== 1.0) {
        video.playbackRate = requestedSpeed;
      }

      if (requestedSpeed - video.playbackRate > 0.01) {
        ensureTurbo(video, requestedSpeed, video.playbackRate);
      } else if (turboActive) {
        stopTurbo();
      }
    } else if (turboActive) {
      stopTurbo();
    }
  }, REFRESH_DELAY);

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  const init = () => {
    syncControlBar();
    logger.info("RUPP eLearning Tools v1.2.3 initialized ✓");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
