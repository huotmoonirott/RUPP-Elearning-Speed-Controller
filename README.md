# 🎓 RUPP eLearning Tools

> A userscript that adds video speed controls to the [RUPP Moodle eLearning platform](https://elearning.rupp.edu.kh), so you can watch lectures at your own pace.

![Version](https://img.shields.io/badge/version-1.2.3-blue)
![License](https://img.shields.io/badge/license-GNU%20GPLv3-green)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox%20%7C%20Edge-lightgrey)
![Site](https://img.shields.io/badge/site-elearning.rupp.edu.kh-orange)

---

## 📋 Table of Contents

- [What It Does](#-what-it-does)
- [Speed Presets](#-speed-presets)
- [How It Works](#-how-it-works)
- [Installation Guide](#-installation-guide)
  - [Step 1: Install a Userscript Manager](#step-1-install-a-userscript-manager)
  - [Step 2: Enable Developer Mode & Allow User Scripts](#step-2-enable-developer-mode--allow-user-scripts-chrome--edge--brave-only)
  - [Step 3: Install the Script](#step-3-install-the-script)
- [Browser-by-Browser Setup](#-browser-by-browser-setup)
  - [Chrome](#chrome)
  - [Firefox](#firefox)
  - [Microsoft Edge](#microsoft-edge)
  - [Brave](#brave)
- [How to Use](#-how-to-use)
- [Turbo Mode Explained](#-turbo-mode-explained)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ What It Does

When you open any lecture video on [elearning.rupp.edu.kh](https://elearning.rupp.edu.kh), a **floating speed control bar** appears in the bottom-right corner of your screen. Click any speed button to instantly change how fast the video plays.

**Features:**
- 🎚️ One-click speed presets from `0.75x` up to `16x`
- ⚡ **Turbo Mode** — pushes past browser speed limits using frame-skipping
- 🔔 Toast notifications confirm every speed change
- 🔁 Auto-restores your selected speed if the video reloads or changes
- 🪟 Works with both direct videos and videos inside iframes (up to 3 levels deep)
- 🧠 Automatically picks the best/active video on the page

---

## 🎚️ Speed Presets

| Button | Speed | Use Case |
|--------|-------|----------|
| `0.75x` | Slow | Hard content, new concepts |
| `1x`    | Normal | Default playback |
| `1.25x` | Slightly fast | Comfortable fast-listening |
| `1.5x`  | Fast | Familiar topics |
| `2x`    | Double | Review / revision |
| `4x`    | Very fast | Quick scan |
| `8x`    | Turbo | Skimming |
| `10x`   | Turbo | Skimming |
| `16x`   | Max Turbo | Jump through content |

> **Note:** Speeds above `2x`–`4x` may hit browser limits. When that happens, **Turbo Mode** activates automatically.

---

## ⚙️ How It Works

1. The script runs **only** on `https://elearning.rupp.edu.kh/*`
2. It scans the page for visible `<video>` elements, including those inside same-origin iframes (up to 3 levels deep)
3. It injects a floating control bar in the bottom-right corner of the page
4. Every **800ms** it checks if the video's playback rate has drifted and re-applies your chosen speed
5. It also listens for `canplay` events so speed is restored **instantly** when a new video loads — not just on the next polling tick
6. If the browser caps the playback rate (common above `4x`), **Turbo Mode** uses `requestAnimationFrame` to manually advance `video.currentTime`, effectively simulating higher speeds

---

## 📦 Installation Guide

You need **two things**: a userscript manager extension, and this script installed in it.

---

### Step 1: Install a Userscript Manager

Install **Tampermonkey** for your browser — it is the most widely supported and recommended:

| Browser | Install Link |
|---------|-------------|
| Chrome  | [Tampermonkey on Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Tampermonkey on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) |
| Edge    | [Tampermonkey on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Brave   | [Tampermonkey on Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |

---

### Step 2: Enable Developer Mode & Allow User Scripts *(Chrome / Edge / Brave only)*

> Firefox users can skip this step entirely.

Chromium-based browsers need **two things** enabled: Developer Mode on the extensions page, and **Allow User Scripts** inside Tampermonkey's own settings.

---

**2a — Enable Developer Mode**

**Chrome:**
1. Go to `chrome://extensions`
2. Toggle **"Developer mode"** ON (top-right corner)

**Edge:**
1. Go to `edge://extensions`
2. Toggle **"Developer mode"** ON (bottom-left sidebar)

**Brave:**
1. Go to `brave://extensions`
2. Toggle **"Developer mode"** ON (top-right corner)

---

**2b — Allow User Scripts inside Tampermonkey** ⚠️ *Do not skip this!*

This is the step most people miss. Even with Developer Mode ON, Tampermonkey won't run scripts unless **Allow User Scripts** is explicitly enabled.

1. Click the **Tampermonkey icon** in your browser toolbar
2. Click the **three-dot menu (⋮)** on the Tampermonkey icon
3. Select **"Manage Extension"**
4. Scroll down to find **"Allow User Scripts"**
5. Toggle it **ON**

> ⚠️ Without this toggle, Tampermonkey is installed but completely silent — no scripts will run, no errors shown. This is the most common reason the speed panel doesn't appear.

---

### Step 3: Install the Script

**Option A — One-click install (easiest):**

Click the raw script link below. Tampermonkey will detect it and show an install dialog automatically:

```
https://raw.githubusercontent.com/huotmoonirott/rupp-elearning-tools/main/rupp.user.js
```

Click **"Install"** in the dialog that appears. Done!

---

**Option B — Manual install:**

1. Click the **Tampermonkey icon** in your browser toolbar
2. Select **"Create a new script"**
3. Delete all the placeholder code in the editor
4. Copy the full contents of [`rupp.user.js`](./rupp.user.js) and paste it in
5. Press **Ctrl+S** (Windows/Linux) or **Cmd+S** (Mac) to save
6. Done — the script is now active!

---

## 🌐 Browser-by-Browser Setup

### Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Install Tampermonkey from the [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
4. Click the **Tampermonkey icon** → **three-dot menu (⋮)** → **"Manage Extension"** → scroll down → enable **"Allow User Scripts"**
5. Install the script via Option A or B above

### Firefox

1. Install Tampermonkey from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) — no Developer Mode needed
2. Confirm the permission prompt
3. Install the script via Option A or B above

### Microsoft Edge

1. Go to `edge://extensions`
2. Enable **Developer mode** (bottom-left sidebar toggle)
3. Install Tampermonkey from the [Edge Add-ons store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
4. Click the **Tampermonkey icon** → **three-dot menu (⋮)** → **"Manage Extension"** → scroll down → enable **"Allow User Scripts"**
5. Install the script via Option A or B above

### Brave

1. Go to `brave://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Install Tampermonkey from the [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
4. Click the **Tampermonkey icon** → **three-dot menu (⋮)** → **"Manage Extension"** → scroll down → enable **"Allow User Scripts"**
5. Install the script via Option A or B above

---

## 🖱️ How to Use

1. Go to [elearning.rupp.edu.kh](https://elearning.rupp.edu.kh) and open any course with a video lecture
2. Start playing the video
3. A **floating speed panel** appears in the **bottom-right corner**
4. Click any speed button — `0.75x`, `1x`, `1.25x`, `1.5x`, `2x`, `4x`, `8x`, `10x`, or `16x`
5. A **toast notification** at the top-right confirms the change
6. Your speed is **remembered and re-applied** automatically if the video reloads

**Tips:**
- If you navigate to another video, the panel refreshes within ~1 second
- For embedded/iframe videos, the script detects them automatically — no extra setup needed
- The highlighted (blue-glowing) button shows your currently active speed

---

## ⚡ Turbo Mode Explained

Browsers enforce a maximum `playbackRate` on `<video>` elements — typically capped somewhere between `4x` and `16x` depending on the browser and video codec. When you select a speed the browser can't reach natively:

- The script detects that `video.playbackRate` was not fully applied
- **Turbo Mode** activates, using `requestAnimationFrame` to manually increment `video.currentTime` each frame
- This simulates the remaining speed beyond the browser's native cap
- A toast will say **"⚠️ Speed limited to Xx (turbo on)"** so you know it's active

Turbo Mode stops automatically when you select a lower speed, the video ends, or the video is paused.

---

## 🐛 Troubleshooting

**The speed panel doesn't appear**
- Check that Tampermonkey is installed and the script is enabled (Tampermonkey icon → Dashboard → script should be toggled ON)
- Confirm you are on `https://elearning.rupp.edu.kh/` — the script only runs on this domain
- Try a hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

**Chrome/Edge/Brave: script doesn't run at all**
- Make sure Developer Mode is ON in your extensions page (`chrome://extensions`, `edge://extensions`, or `brave://extensions`)
- **Also check:** click the **Tampermonkey icon** → **three-dot menu (⋮)** → **"Manage Extension"** → scroll down → make sure **"Allow User Scripts"** is toggled ON — this is the most commonly missed step
- Reload the page after enabling both settings

**Speed resets to 1x when a new video loads**
- The `canplay` listener should restore your speed within milliseconds. If it doesn't, click your preferred speed again manually.

**Speed above 4x doesn't seem to work / video doesn't skip forward**
- Turbo Mode handles this — you'll see the "turbo on" toast. If the video isn't playing, press play first and then set your speed.

**The panel appears but buttons do nothing**
- The video may not have loaded yet. Wait for it to start playing, then click a speed.

**"⚠️ No video found on this page" toast appears**
- The page may not have a video, or the video is in a cross-origin iframe (which cannot be accessed for security reasons). This is a browser-enforced limitation.

---

## 🤝 Contributing

Pull requests are welcome! To contribute:

1. Fork this repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test on [elearning.rupp.edu.kh](https://elearning.rupp.edu.kh)
4. Commit: `git commit -m "feat: describe your change"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request against `main`

Please test in both Chrome and Firefox before submitting.

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](./LICENSE) file for full terms.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/huotmoonirott">MOONJAE</a> for RUPP students
</div>
