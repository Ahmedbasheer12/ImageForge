# ImageForge - Bulk Image Converter & Compressor

> A modern, client-side image conversion and compression web application built with vanilla HTML, CSS, and JavaScript.

![ImageForge Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Course](https://img.shields.io/badge/Course-SWE402%20Internet%20Programming-blue)
![License](https://img.shields.io/badge/License-MIT-lightgray)

---

## 📋 Project Overview-Ahmed-Basheer

**ImageForge** is a feature-rich web application designed for bulk image conversion and compression. It enables users to:

- **Convert** images between JPG, PNG, and WEBP formats
- **Compress** images with adjustable quality settings
- **Resize** images with optional dimension constraints
- **Batch process** multiple images simultaneously
- **Download** individual files or as a ZIP archive

### Course Information

| Field | Details |
|-------|---------|
| **Course** | SWE402 Internet Programming |
| **Type** | Course Project |
| **Technologies** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | None (100% Client-Side) |
| **Dependencies** | JSZip (CDN) |

---

## ✨ Features

### Core Functionality

- [x] **Bulk Upload** - Drag & drop or click-to-select multiple images
- [x] **Format Conversion** - Convert between JPG, PNG, and WEBP
- [x] **Quality Control** - Adjustable compression slider (10% - 100%)
- [x] **Smart Resizing** - Optional max width/height with aspect ratio preservation
- [x] **Batch Processing** - Process unlimited images sequentially
- [x] **Progress Tracking** - Real-time progress bar with status messages
- [x] **ZIP Download** - Download all processed images as a single ZIP file
- [x] **Individual Download** - Download each processed image separately

### Supported Formats

| Input Formats | Output Formats |
|---------------|----------------|
| PNG | JPG (quality adjustable) |
| JPEG | PNG (lossless) |
| WEBP | WEBP (best compression) |
| BMP | |
| GIF | |

### UI/UX Features

- [x] Modern, card-based dark theme design
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Smooth animations and hover effects
- [x] Toast notifications for feedback
- [x] Empty state with helpful guidance
- [x] Results summary with compression statistics
- [x] Privacy-first design (all processing in browser)

---

## 🚀 Getting Started

### Quick Start

1. **Open `index.html`** in any modern web browser
2. **No installation or server required** - everything runs client-side

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No backend/server required

---

## 📁 Project Structure

```
imagecomvert/
├── index.html      # Main HTML structure
├── style.css       # CSS styling and animations
├── script.js       # JavaScript application logic
└── README.md       # This documentation file
```

### File Descriptions

| File | Description |
|------|-------------|
| `index.html` | Complete HTML structure with semantic markup, accessible elements, and CDN resources |
| `style.css` | Modern CSS with design tokens, responsive layouts, animations, and dark theme |
| `script.js` | Full JavaScript application with state management, image processing, and ZIP creation |

---

## 🎨 Design Highlights

### Visual Design

- **Color Palette**: Deep dark theme with purple primary (`#6366F1`) and cyan accent (`#22D3EE`)
- **Typography**: Outfit (display) + DM Sans (body) fonts
- **Spacing**: Consistent spacing system with 8px base unit
- **Border Radius**: Rounded corners throughout (8px - 24px)

### Animations

- Logo floating animation
- Staggered section reveals on page load
- Progress bar with glow effect
- Card entrance animations in results grid
- Toast notification slide-in/out
- Hover state transforms on interactive elements

### Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| ≤ 480px | Mobile phones |
| ≤ 768px | Tablets, small laptops |
| ≤ 900px | Small desktop screens |
| > 900px | Standard desktops |

---

## 🔧 Technical Implementation

### Image Processing Pipeline

```javascript
File Input → FileReader → Image Element → Canvas → toBlob() → Download/ZIP
```

### Key JavaScript Functions

| Function | Purpose |
|----------|---------|
| `formatBytes()` | Convert bytes to human-readable sizes |
| `changeFileExtension()` | Update filename extension based on output format |
| `calculateDimensions()` | Compute new dimensions with aspect ratio handling |
| `canvasToBlob()` | Convert canvas to blob with format/quality |
| `processSingleImage()` | Full image processing pipeline |
| `downloadFile()` | Single file download via object URL |
| `downloadAllZip()` | Create and download ZIP archive with JSZip |

### Browser APIs Used

- **FileReader** - Read uploaded files
- **Image** - Load and process images
- **Canvas** - Draw and manipulate image data
- **toBlob()** - Convert canvas to downloadable blob
- **URL.createObjectURL()** - Create download links
- **JSZip** - Create ZIP archives

---

## 📱 Usage Guide

### Step-by-Step Instructions

1. **Upload Images**
   - Drag images onto the upload zone
   - Or click the zone to open file browser
   - Select multiple files using Ctrl/Cmd + click

2. **Configure Settings**
   - Choose output format (JPG/PNG/WEBP)
   - Adjust quality slider (10-100%)
   - Optionally set max dimensions

3. **Process Images**
   - Click "Convert & Compress" button
   - Watch progress bar update
   - Wait for completion notification

4. **Download Results**
   - Download individual files with "Download" button
   - Or use "Download All as ZIP" for batch download

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Start processing (when files loaded) |
| `Escape` | Clear all files |

---

## 🔒 Privacy & Security

> **Important**: All image processing happens locally in your browser.

- ✅ No images are uploaded to any server
- ✅ No data leaves your device
- ✅ Files are processed using Canvas API
- ✅ Memory is cleaned up after processing
- ✅ No cookies or tracking used

---

## 📄 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Fully Supported |
| Firefox | 75+ | ✅ Fully Supported |
| Safari | 13+ | ✅ Fully Supported |
| Edge | 80+ | ✅ Fully Supported |

### Notes

- PNG to JPG conversion works in all modern browsers
- WEBP output may have slight variation in compression ratios
- BMP and GIF support depends on browser Canvas implementation

---

## 🎓 Academic Information

### Course Learning Outcomes

This project demonstrates:

- HTML5 semantic markup and accessibility
- CSS3 modern layout (Flexbox, Grid) and animations
- Vanilla JavaScript ES6+ features
- Client-side image processing
- Blob/ArrayBuffer manipulation
- Drag and drop API implementation
- Responsive design principles

### Project Requirements Met

| Requirement | Implementation |
|-------------|----------------|
| HTML/CSS/JavaScript only | ✅ No frameworks |
| Client-side processing | ✅ 100% browser-based |
| Multiple file upload | ✅ Drag & drop + file picker |
| Format conversion | ✅ JPG, PNG, WEBP |
| Quality adjustment | ✅ 10-100% slider |
| Batch processing | ✅ Sequential processing |
| Progress indication | ✅ Real-time progress bar |
| ZIP download | ✅ JSZip library |
| Responsive design | ✅ Mobile to desktop |

---

## 📝 License

This project was created as part of the **SWE402 Internet Programming** course. Feel free to use, modify, and learn from this code.

---

## 👏 Acknowledgments

- **Google Fonts** - Outfit and DM Sans typefaces
- **JSZip** - ZIP archive creation via CDN
- **Course Instructor** - For the opportunity to build this project

---

**Made with ❤️ for SWE402 Internet Programming Course**