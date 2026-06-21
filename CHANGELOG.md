# Changelog

All notable changes to RUPP eLearning Tools are documented here.

---

## [1.2.3] — Current

### Fixed
- Speed no longer flashes back to `1x` briefly when a new video loads.  
  A `canplay` event listener now restores the requested speed the instant the video is ready, instead of waiting for the next 800ms polling tick.

---

## [1.2.0]

### Added
- **Turbo Mode**: for speeds the browser cannot reach natively (e.g. above `4x`), the script now uses `requestAnimationFrame` to manually advance `video.currentTime`, simulating higher playback rates.
- Toast notification now distinguishes between native speed and turbo-assisted speed.

---

## [1.1.0]

### Added
- Support for videos inside same-origin iframes (up to 3 levels deep).
- Smart video picker: scores videos by play state, size, and readiness to select the most relevant one.

### Changed
- Control bar now hides itself when the page has a large same-origin iframe (to avoid duplicate UI).

---

## [1.0.0]

### Added
- Initial release.
- Floating speed control bar with presets: `0.75x`, `1x`, `1.25x`, `1.5x`, `2x`, `4x`, `8x`, `10x`, `16x`.
- Toast notifications for speed changes.
- Periodic 800ms polling to re-apply speed if it drifts.
