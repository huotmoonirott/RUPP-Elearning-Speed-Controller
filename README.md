# 🎓 RUPP eLearning Tools

> A userscript that adds video speed controls to the [RUPP Moodle eLearning platform](https://elearning.rupp.edu.kh), so you can watch lectures at your own pace.

![Version](https://img.shields.io/badge/version-1.2.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)
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
- [ការណែនាំអំពីការតម្លើង (Khmer Installation Guide)](#-ការណែនាំអំពីការតម្លើង-khmer-installation-guide)
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

**Fastest way — click your browser's direct link below.** It takes you straight to Tampermonkey's details page — no menus needed:

| Browser | Direct Link |
|---------|-------------|
| Chrome  | [chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Edge    | [edge://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](edge://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Brave   | [brave://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](brave://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) |

> 📌 These are internal browser links (`chrome://`, `edge://`, `brave://`), so clicking them from a PDF or some chat apps may not work — if so, just copy and paste the link into your address bar.

Once you're there, scroll down and toggle **"Allow User Scripts"** to **ON**.

*(Manual route if the link doesn't work: click the **Tampermonkey icon → ⋮ → "Manage Extension"**, then scroll down to find the same toggle.)*

> ⚠️ Without this toggle, Tampermonkey is installed but completely silent — no scripts will run, no errors shown. This is the most common reason the speed panel doesn't appear.

---

### Step 3: Install the Script

**Option A — One-click install (easiest):**

Click the raw script link below. Tampermonkey will detect it and show an install dialog automatically:

```
https://raw.githubusercontent.com/huotmoonirott/RUPP-Elearning-Speed-Controller/main/rupp.user.js
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

## 🇰🇭 ការណែនាំអំពីការតម្លើង (Khmer Installation Guide)

ដើម្បីឱ្យ Script នេះដំណើរការ អ្នកត្រូវការពីរយ៉ាង៖ Userscript Manager (កម្មវិធីគ្រប់គ្រង Script) និង Script ខ្លួនវាផ្ទាល់។ សូមអនុវត្តតាមជំហានខាងក្រោម៖

### ជំហានទី ១៖ តម្លើង Userscript Manager

អ្នកត្រូវតម្លើង **Tampermonkey** ដែលជា Extension ដ៏ពេញនិយម និងមានសុវត្ថិភាពបំផុតសម្រាប់ Browser របស់អ្នក៖

| Browser | តំណភ្ជាប់សម្រាប់តម្លើង (Install Link) |
|---------|-------------|
| Chrome  | [Tampermonkey on Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Tampermonkey on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) |
| Edge    | [Tampermonkey on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Brave   | [Tampermonkey on Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |

### ជំហានទី ២៖ បើកមុខងារ Developer Mode និង Allow User Scripts

*(សម្រាប់អ្នកប្រើប្រាស់ Chrome, Edge និង Brave ប៉ុណ្ណោះ។ បើអ្នកប្រើ Firefox សូមរំលងជំហាននេះ)*

ដើម្បីឱ្យ Tampermonkey ដំណើរការបាន អ្នកត្រូវបើកសិទ្ធិពីរយ៉ាង៖

**2a — បើក Developer Mode**

- **Chrome:** ចូលទៅកាន់ `chrome://extensions` រួចចុចបើក **"Developer mode"** (នៅជ្រុងខាងស្តាំលើ)
- **Edge:** ចូលទៅកាន់ `edge://extensions` រួចចុចបើក **"Developer mode"** (នៅជ្រុងខាងឆ្វេងក្រោម)
- **Brave:** ចូលទៅកាន់ `brave://extensions` រួចចុចបើក **"Developer mode"** (នៅជ្រុងខាងស្តាំលើ)

**2b — បើក Allow User Scripts (ជំហានដ៏សំខាន់បំផុត)** ⚠️

ទោះបើក Developer Mode រួចហើយ ក៏វានៅមិនទាន់ដំណើរការដែរ ប្រសិនបើអ្នកមិនទាន់បើកមុខងារនេះ៖

**វិធីលឿនបំផុត — ចុចលើ Link ខាងក្រោម ដោយផ្អែកលើ Browser របស់អ្នក។** វានឹងនាំអ្នកទៅផ្ទាល់ទំព័ររបស់ Tampermonkey ដោយមិនចាំបាច់ចុចចូល Menu ច្រើនជំហានទេ៖

| Browser | Link ផ្ទាល់ |
|---------|-------------|
| Chrome  | [chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Edge    | [edge://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](edge://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Brave   | [brave://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](brave://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo) |

> 📌 បើ Link មិនដំណើរការ (ឧទាហរណ៍ បើកពី PDF ឬកម្មវិធី Chat ខ្លះ) សូម Copy Link ហើយយកទៅ Paste ក្នុង Address Bar របស់ Browser ដោយផ្ទាល់។

នៅពេលចូលដល់ទំព័រនោះ សូមរមូរចុះក្រោម រួចចុច Toggle **"Allow User Scripts"** ឱ្យទៅជា **ON**។

*(បើ Link មិនដំណើរការ អ្នកអាចចូលដោយដៃវិញ៖ ចុចលើរូបតំណាង Tampermonkey → ⋮ → "Manage Extension" រួចរមូរចុះក្រោមរកប៊ូតុងដូចគ្នា)*

### ជំហានទី ៣៖ តម្លើង Script

អ្នកមានពីរជម្រើសក្នុងការតម្លើង៖

**ជម្រើសទី A — តម្លើងដោយស្វ័យប្រវត្តិ (ងាយស្រួលបំផុត):**

គ្រាន់តែចុចលើ Link ខាងក្រោមនេះ៖

```
https://raw.githubusercontent.com/huotmoonirott/RUPP-Elearning-Speed-Controller/main/rupp.user.js
```

ផ្ទាំង Install នឹងលោតឡើងដោយស្វ័យប្រវត្តិ។ សូមចុចប៊ូតុង **"Install"** ជាការស្រេច។

**ជម្រើសទី B — តម្លើងដោយដៃ (Manual install):**

1. ចុចលើរូបតំណាង **Tampermonkey** នៅលើ Browser toolbar
2. ជ្រើសរើស **"Create a new script"**
3. លុប Code ចាស់ៗដែលមាននៅក្នុងនោះចេញឱ្យអស់
4. កូពី (Copy) កូដទាំងអស់ពី `rupp.user.js` យកមកដាក់ (Paste) ក្នុងនោះ
5. ចុច **Ctrl+S** (Windows/Linux) ឬ **Cmd+S** (Mac) ដើម្បីរក្សាទុក (Save)
6. ចប់ហើយ — Script ដំណើរការហើយ!

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
- **Also check:** use the direct link for your browser in [Step 2b](#step-2-enable-developer-mode--allow-user-scripts-chrome--edge--brave-only) and make sure **"Allow User Scripts"** is toggled ON — this is the most commonly missed step
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

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for full terms.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/huotmoonirott">MOONJAE</a> for RUPP students
</div>
