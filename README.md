# 🏛️ Museum Video Terminal

An interactive video gallery designed for museums, exhibitions, and public installations. Visitors can browse and play curated video content using a keyboard or gamepad. The interface is clean, responsive, and optimized for fullscreen kiosk environments.

---

## 🎯 Features

- Thumbnail-based video selection
- ESC key or gamepad button to exit playback
- Multi-page navigation with seamless transitions
- Responsive layout for large screens and kiosks
- Works with keyboard and gamepad
- Tested on major operating systems and browsers

---

## 🖥️ Compatibility

This project is designed to run on common desktop platforms and has been successfully tested in kiosk environments:

- **Windows 11 Version 25H2** using **Firefox in kiosk mode**
- **Linux Mint 22.2 "Zara"** (based on Ubuntu 24.04 LTS) using **Chromium in kiosk mode**

> ⚠️ Kiosk mode must be manually activated on each system, but can also be automated:
> - **Windows**: via a `.bat` script that launches Firefox or Chromium in fullscreen
> - **Linux**: via a `.desktop` file or a systemd service that starts Chromium with kiosk flags  
> Setup should be configured by a system administrator for each deployment.

## 🗂️ Linux Kiosk File

This repository already includes a prepared Linux desktop file:  
`Start Kiosk_Linux.desktop`

- Purpose: launches Chromium in kiosk mode with the local HTML start page.  
- Location: included in the project root directory.  
- Usage: copy the file to your Linux system and place it in  
  `~/.local/share/applications/` (manual start) or  
  `~/.config/autostart/` (automatic start on login).  
- Make it executable:
  ```bash
  chmod +x Start\ Kiosk_Linux.desktop
  ```

## ⚠️ Important Note for the Linux Desktop File

The included file `Start Kiosk_Linux.desktop` contains the placeholder **USER** in the path:

```ini
Exec=chromium --kiosk file:///home/USER/Videoterminal/index.html
```
---

## 📄 Pages

- `index.html` → Page 1 (videos 1–8)
- `page2.html` → Page 2 (videos 9–15)
- `page3.html` → Page 3 (videos 16–22)

Each page includes thumbnails for video playback and navigation links to adjacent pages.

---

## 🎮 Controls

### Keyboard
- `Arrow keys` → Navigate thumbnails
- `Enter` → Play selected video
- `Escape` → Stop video and return to gallery

### Gamepad
- `Left/Right/Up/Down` → Navigate thumbnails
- `A` → Play selected video
- `B` → Stop video and return to gallery
- `Select` → Pause/play video
- `Start`+`A`+`B` → Exit Kiosk-Mode

## 🎮 Hardware – Gamepad

This project has been tested with a **USB NES-style gamepad** (retro design).  
It features the classic layout: D‑Pad, Select, Start, A, and B buttons.  
Other USB controllers may also work, but button mappings can differ.

> Note: If you use a different controller, you may need to adjust the button mapping in `script.js`.

---

## 📁 Folder Structure

```text
museum-video-terminal/ 
├── index.html 
├── page2.html 
├── page3.html 
├── style.css 
├── script.js
├── Start Kiosk_Linux.desktop 
├── thumbs/ # Thumbnail images (PNG format) 
│ ├── video1.png 
│ ├── video2.png 
│ └── ... 
├── videos/ # Video files (MP4 format) 
│ ├── video1.mp4 
│ ├── video2.mp4 
│ └── ... 
└── LICENSE # MIT License 
```

---

## 🎞️ Adding Videos and Thumbnails

To add your own content:

1. **Prepare your video files**  
   - Format: `.mp4`  
   - Resolution: optimized for fullscreen playback  
   - Place them in the `videos/` folder  
   - Name them sequentially (e.g. `video1.mp4`, `video2.mp4`, etc.)

2. **Create thumbnail images**  
   - Format: `.png`  
   - Size: 437px wide (recommended for layout consistency)  
   - Place them in the `thumbs/` folder  
   - Name them to match the video (e.g. `video1.png` for `video1.mp4`)

3. **Update the HTML pages**  
   - Each thumbnail is linked to its video using the `data-video` attribute  
   - Example:
     ```html
     <img src="thumbs/video1.png" class="thumb" data-video="videos/video1.mp4">
     ```

4. **Add navigation thumbnails if needed**  
   - Use `data-href="pageX.html"` to link between pages  
   - Example:
     ```html
     <img src="thumbs/page1_1.png" class="thumb nav-link" data-href="page2.html">
     ```

> ⚠️ Make sure filenames are consistent and match exactly — otherwise the video won't load.

---

## 🚀 Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Bjoern82/exhibit-video-selector.git
   ```
2. Place your video files in the videos/ folder and thumbnails in thumbs/.
3. Open index.html in a browser or kiosk environment.

---

## 📜 License

This project is open-source under the MIT License. You are free to use, modify, and distribute it with attribution.

---

## 🙌 Credits

Created by Björn Bruckmann for use in public installations and educational environments. Feel free to fork, adapt, and contribute!
