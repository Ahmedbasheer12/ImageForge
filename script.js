/**
 * ========================================
 * ImageForge - Bulk Image Converter & Compressor
 * Enhanced JavaScript Application
 * Course: SWE402 Internet Programming
 * ========================================
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements Cache
    // ========================================
    const DOM = {
        // Upload Section
        uploadZone: document.getElementById('uploadZone'),
        uploadContent: document.getElementById('uploadContent'),
        uploadProcessing: document.getElementById('uploadProcessing'),
        fileInput: document.getElementById('fileInput'),
        fileInfoBar: document.getElementById('fileInfoBar'),
        fileCount: document.getElementById('fileCount'),
        totalSize: document.getElementById('totalSize'),
        clearFiles: document.getElementById('clearFiles'),

        // Settings Section
        formatBtns: document.querySelectorAll('.format-btn'),
        qualitySlider: document.getElementById('qualitySlider'),
        qualityValue: document.getElementById('qualityValue'),
        sliderFill: document.getElementById('sliderFill'),
        maxWidth: document.getElementById('maxWidth'),
        maxHeight: document.getElementById('maxHeight'),
        maintainAspect: document.getElementById('maintainAspect'),

        // Action Section
        processBtn: document.getElementById('processBtn'),
        processBadge: document.getElementById('processBadge'),
        processMoreBtn: document.getElementById('processMoreBtn'),

        // Progress Section
        progressSection: document.getElementById('progressSection'),
        progressBar: document.getElementById('progressBar'),
        progressBarGlow: document.querySelector('.progress-bar-glow'),
        processedCount: document.getElementById('processedCount'),
        totalCount: document.getElementById('totalCount'),
        progressStatus: document.getElementById('progressStatus'),

        // Results Section
        resultsSection: document.getElementById('resultsSection'),
        resultsBadge: document.getElementById('resultsBadge'),
        resultsGrid: document.getElementById('resultsGrid'),
        downloadAllBtn: document.getElementById('downloadAllBtn'),
        resultCount: document.getElementById('resultCount'),
        totalSaved: document.getElementById('totalSaved'),
        avgCompression: document.getElementById('avgCompression'),

        // Empty State
        emptyState: document.getElementById('emptyState')
    };

    // ========================================
    // Application State
    // ========================================
    const state = {
        files: [],              // Array of file data objects
        processedImages: [],    // Array of processed image results
        outputFormat: 'image/jpeg',
        quality: 80,
        maxWidth: null,
        maxHeight: null,
        maintainAspectRatio: true,
        isProcessing: false
    };

    // Supported image MIME types
    const SUPPORTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif'];

    // Extension mapping for output formats
    const FORMAT_EXTENSIONS = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp'
    };

    // ========================================
    // Initialization
    // ========================================
    function init() {
        setupEventListeners();
        updateSliderFill();
        updateUI();
    }

    // ========================================
    // Event Listeners Setup
    // ========================================
    function setupEventListeners() {
        // Upload zone - Click
        DOM.uploadZone.addEventListener('click', () => DOM.fileInput.click());

        // Upload zone - Drag events
        DOM.uploadZone.addEventListener('dragover', handleDragOver);
        DOM.uploadZone.addEventListener('dragleave', handleDragLeave);
        DOM.uploadZone.addEventListener('drop', handleDrop);

        // File input change
        DOM.fileInput.addEventListener('change', handleFileSelect);

        // Clear files button
        DOM.clearFiles.addEventListener('click', (e) => {
            e.stopPropagation();
            clearFiles();
        });

        // Format selection buttons
        DOM.formatBtns.forEach(btn => {
            btn.addEventListener('click', () => selectFormat(btn));
        });

        // Quality slider
        DOM.qualitySlider.addEventListener('input', handleQualityChange);

        // Dimension inputs
        DOM.maxWidth.addEventListener('input', handleDimensionChange);
        DOM.maxHeight.addEventListener('input', handleDimensionChange);
        DOM.maintainAspect.addEventListener('change', handleAspectRatioChange);

        // Process button
        DOM.processBtn.addEventListener('click', processAllImages);

        // Process more button
        DOM.processMoreBtn.addEventListener('click', resetForMore);

        // Download all button
        DOM.downloadAllBtn.addEventListener('click', downloadAllZip);

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    // ========================================
    // Keyboard Shortcuts
    // ========================================
    function handleKeyboardShortcuts(e) {
        // Enter to process (when files are loaded and not processing)
        if (e.key === 'Enter' && state.files.length > 0 && !state.isProcessing) {
            e.preventDefault();
            processAllImages();
        }

        // Escape to clear selection
        if (e.key === 'Escape' && state.files.length > 0 && !state.isProcessing) {
            clearFiles();
        }
    }

    // ========================================
    // Drag & Drop Handlers
    // ========================================
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        DOM.uploadZone.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        DOM.uploadZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        DOM.uploadZone.classList.remove('drag-over');

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }

    function handleFileSelect(e) {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    }

    // ========================================
    // File Management
    // ========================================
    /**
     * Add files to the processing queue
     * @param {File[]} newFiles - Array of File objects
     */
    function addFiles(newFiles) {
        // Filter for supported image types
        const validFiles = newFiles.filter(file => {
            if (!SUPPORTED_TYPES.includes(file.type)) {
                showToast(`Skipped: ${file.name} - Unsupported format`, 'warning');
                return false;
            }
            return true;
        });

        // Create file data objects and add to state
        validFiles.forEach(file => {
            const fileData = {
                file: file,
                id: generateUniqueId(),
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file),
                originalSize: file.size
            };
            state.files.push(fileData);
        });

        updateUI();
    }

    /**
     * Clear all files from the queue
     */
    function clearFiles() {
        // Revoke all object URLs to free memory
        state.files.forEach(fileData => {
            if (fileData.preview) {
                URL.revokeObjectURL(fileData.preview);
            }
        });

        state.files = [];
        state.processedImages = [];

        // Reset file input
        DOM.fileInput.value = '';

        updateUI();
        showToast('All files cleared', 'info');
    }

    // ========================================
    // Format Selection
    // ========================================
    /**
     * Select output format
     * @param {HTMLElement} btn - Format button element
     */
    function selectFormat(btn) {
        state.outputFormat = btn.dataset.format;

        // Update UI - remove active from all, add to selected
        DOM.formatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        showToast(`Output format: ${btn.querySelector('.format-name').textContent}`, 'info');
    }

    // ========================================
    // Quality Slider
    // ========================================
    function handleQualityChange(e) {
        state.quality = parseInt(e.target.value, 10);
        DOM.qualityValue.textContent = `${state.quality}%`;
        updateSliderFill();
    }

    function updateSliderFill() {
        const percent = ((state.quality - 10) / (100 - 10)) * 100;
        DOM.sliderFill.style.width = `${percent}%`;
    }

    // ========================================
    // Dimension Inputs
    // ========================================
    function handleDimensionChange(e) {
        const value = e.target.value;
        state.maxWidth = value ? parseInt(value, 10) : null;
        state.maxHeight = value ? parseInt(value, 10) : null;
    }

    function handleAspectRatioChange(e) {
        state.maintainAspectRatio = e.target.checked;
    }

    // ========================================
    // UI Updates
    // ========================================
    /**
     * Update all UI elements based on current state
     */
    function updateUI() {
        const hasFiles = state.files.length > 0;
        const hasResults = state.processedImages.length > 0;

        // File info bar
        DOM.fileInfoBar.hidden = !hasFiles;
        DOM.fileCount.textContent = state.files.length;
        DOM.totalSize.textContent = formatBytes(calculateTotalSize());

        // Process button
        DOM.processBtn.disabled = !hasFiles || state.isProcessing;
        DOM.processBadge.textContent = state.files.length;

        // Results section visibility
        if (hasResults) {
            DOM.resultsSection.hidden = false;
            DOM.emptyState.hidden = true;
        } else {
            DOM.resultsSection.hidden = true;
            DOM.emptyState.hidden = !hasFiles;
        }

        // Update download buttons
        updateDownloadButtons();
    }

    function updateDownloadButtons() {
        const hasProcessed = state.processedImages.length > 0;
        DOM.downloadAllBtn.disabled = !hasProcessed || state.isProcessing;
    }

    /**
     * Calculate total size of all files
     * @returns {number} Total size in bytes
     */
    function calculateTotalSize() {
        return state.files.reduce((total, file) => total + file.size, 0);
    }

    // ========================================
    // Image Processing
    // ========================================
    /**
     * Process all images sequentially to prevent browser freezing
     */
    async function processAllImages() {
        if (state.files.length === 0 || state.isProcessing) return;

        state.isProcessing = true;
        state.processedImages = [];

        // Show progress section
        DOM.progressSection.hidden = false;
        DOM.totalCount.textContent = state.files.length;
        DOM.processedCount.textContent = '0';
        DOM.progressBar.style.width = '0%';
        DOM.progressBarGlow.style.width = '0%';
        DOM.progressStatus.innerHTML = '<span class="status-spinner"></span> Preparing...';

        // Hide other sections
        DOM.resultsSection.hidden = true;
        DOM.emptyState.hidden = true;

        updateUI();

        // Process each file
        for (let i = 0; i < state.files.length; i++) {
            const fileData = state.files[i];

            DOM.progressStatus.innerHTML = `<span class="status-spinner"></span> Processing: ${truncateFilename(fileData.name, 30)}`;
            DOM.processedCount.textContent = i + 1;

            try {
                const result = await processSingleImage(fileData);
                state.processedImages.push(result);
            } catch (error) {
                console.error(`Error processing ${fileData.name}:`, error);
                showToast(`Failed to process: ${fileData.name}`, 'error');
            }

            // Update progress bar
            const progress = ((i + 1) / state.files.length) * 100;
            DOM.progressBar.style.width = `${progress}%`;
            DOM.progressBarGlow.style.width = `${progress}%`;
        }

        // Processing complete
        DOM.progressStatus.innerHTML = '<span class="status-spinner"></span> Processing complete!';

        state.isProcessing = false;

        // Show results after a brief delay
        setTimeout(() => {
            DOM.progressSection.hidden = true;
            displayResults();
        }, 600);

        updateUI();
    }

    /**
     * Process a single image file
     * @param {Object} fileData - File data object
     * @returns {Promise<Object>} - Processed image result
     */
    async function processSingleImage(fileData) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                const { width, height } = calculateDimensions(
                    img.width,
                    img.height,
                    state.maxWidth,
                    state.maxHeight,
                    state.maintainAspectRatio
                );

                // Create canvas for processing
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                // Enable high-quality image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw image to canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert canvas to blob with specified format and quality
                canvasToBlob(canvas, state.outputFormat, state.quality / 100)
                    .then(blob => {
                        const result = {
                            id: fileData.id,
                            originalName: fileData.name,
                            newName: changeFileExtension(fileData.name, state.outputFormat),
                            originalSize: fileData.originalSize,
                            newSize: blob.size,
                            blob: blob,
                            preview: URL.createObjectURL(blob),
                            format: state.outputFormat,
                            dimensions: { width, height }
                        };

                        resolve(result);
                    })
                    .catch(reject);
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image: ${fileData.name}`));
            };

            // Load image from preview URL
            img.src = fileData.preview;
        });
    }

    // ========================================
    // Canvas & Blob Operations
    // ========================================
    /**
     * Convert canvas to blob with specified format and quality
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {string} format - Output MIME type
     * @param {number} quality - Quality from 0 to 1
     * @returns {Promise<Blob>}
     */
    function canvasToBlob(canvas, format, quality) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                format,
                quality
            );
        });
    }

    /**
     * Calculate new dimensions maintaining aspect ratio
     * @param {number} originalWidth - Original width
     * @param {number} originalHeight - Original height
     * @param {number|null} maxWidth - Maximum width constraint
     * @param {number|null} maxHeight - Maximum height constraint
     * @param {boolean} maintainRatio - Whether to maintain aspect ratio
     * @returns {Object} - New dimensions {width, height}
     */
    function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight, maintainRatio) {
        let width = originalWidth;
        let height = originalHeight;

        // Apply max width constraint
        if (maxWidth && width > maxWidth) {
            width = maxWidth;
            if (maintainRatio) {
                height = Math.round((originalHeight / originalWidth) * width);
            }
        }

        // Apply max height constraint
        if (maxHeight && height > maxHeight) {
            height = maxHeight;
            if (maintainRatio) {
                width = Math.round((originalWidth / originalHeight) * height);
            }
        }

        // Ensure minimum dimensions
        width = Math.max(width, 1);
        height = Math.max(height, 1);

        return { width, height };
    }

    // ========================================
    // Utility Functions
    // ========================================
    /**
     * Format bytes to human readable string
     * @param {number} bytes - Size in bytes
     * @returns {string} - Formatted string (e.g., "1.5 MB")
     */
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Change file extension based on output format
     * @param {string} filename - Original filename
     * @param {string} format - Output MIME type
     * @returns {string} - New filename with correct extension
     */
    function changeFileExtension(filename, format) {
        const ext = FORMAT_EXTENSIONS[format] || '.jpg';
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        return nameWithoutExt + ext;
    }

    /**
     * Generate unique ID for file tracking
     * @returns {string} - Unique identifier
     */
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Truncate filename if too long
     * @param {string} name - Filename
     * @param {number} maxLength - Maximum length
     * @returns {string} - Truncated filename
     */
    function truncateFilename(name, maxLength) {
        if (name.length <= maxLength) return name;
        const ext = name.split('.').pop();
        const nameWithoutExt = name.replace(/\.[^/.]+$/, '');
        const truncated = nameWithoutExt.substring(0, maxLength - ext.length - 4);
        return truncated + '...' + ext;
    }

    // ========================================
    // Download Operations
    // ========================================
    /**
     * Download a single file
     * @param {Blob} blob - File blob
     * @param {string} filename - Download filename
     */
    function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Download all processed images as ZIP archive
     */
    async function downloadAllZip() {
        if (state.processedImages.length === 0) return;

        DOM.progressStatus.innerHTML = '<span class="status-spinner"></span> Creating ZIP file...';
        DOM.progressSection.hidden = false;
        DOM.progressBar.style.width = '0%';
        DOM.progressBarGlow.style.width = '0%';

        try {
            const zip = new JSZip();

            // Add each file to ZIP with progress
            state.processedImages.forEach((image, index) => {
                zip.file(image.newName, image.blob);
                const progress = ((index + 1) / state.processedImages.length) * 50;
                DOM.progressBar.style.width = `${progress}%`;
                DOM.progressBarGlow.style.width = `${progress}%`;
                DOM.progressStatus.innerHTML = `<span class="status-spinner"></span> Adding: ${image.newName}`;
            });

            // Generate ZIP blob with compression
            DOM.progressStatus.innerHTML = '<span class="status-spinner"></span> Generating ZIP archive...';
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            }, (metadata) => {
                const progress = 50 + (metadata.percent * 0.5);
                DOM.progressBar.style.width = `${progress}%`;
                DOM.progressBarGlow.style.width = `${progress}%`;
            });

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 10);
            const zipFilename = `ImageForge_${state.processedImages.length}files_${timestamp}.zip`;

            // Trigger download
            downloadFile(zipBlob, zipFilename);

            DOM.progressStatus.innerHTML = '<span class="status-spinner"></span> ZIP downloaded successfully!';
            showToast(`Downloaded ${state.processedImages.length} files as ZIP`, 'success');

            setTimeout(() => {
                DOM.progressSection.hidden = true;
            }, 1500);

        } catch (error) {
            console.error('ZIP creation failed:', error);
            showToast('Failed to create ZIP file', 'error');
            DOM.progressSection.hidden = true;
        }
    }

    // ========================================
    // Results Display
    // ========================================
    /**
     * Display processed images results
     */
    function displayResults() {
        // Clear previous results
        DOM.resultsGrid.innerHTML = '';

        // Calculate statistics
        let totalOriginal = 0;
        let totalNew = 0;

        state.processedImages.forEach((image, index) => {
            totalOriginal += image.originalSize;
            totalNew += image.newSize;

            // Create result card
            const card = createResultCard(image, index);
            DOM.resultsGrid.appendChild(card);
        });

        // Update summary
        DOM.resultCount.textContent = state.processedImages.length;

        const savedBytes = totalOriginal - totalNew;
        const savedPercent = totalOriginal > 0
            ? Math.round((savedBytes / totalOriginal) * 100)
            : 0;

        DOM.totalSaved.textContent = `${savedPercent}%`;
        DOM.avgCompression.textContent = `${savedPercent}%`;
        DOM.resultsBadge.textContent = `${savedPercent}% saved`;

        // Update badge color based on savings
        if (savedPercent > 30) {
            DOM.resultsBadge.style.background = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
        } else if (savedPercent > 0) {
            DOM.resultsBadge.style.background = 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)';
        } else {
            DOM.resultsBadge.style.background = 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)';
        }

        // Show results section
        DOM.resultsSection.hidden = false;

        // Scroll to results
        DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Create a result card element for an image
     * @param {Object} image - Processed image data
     * @param {number} index - Index for animation delay
     * @returns {HTMLElement}
     */
    function createResultCard(image, index) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.08}s`;

        // Calculate savings
        const savedBytes = image.originalSize - image.newSize;
        const savedPercent = Math.round((savedBytes / image.originalSize) * 100);
        const savedDisplay = savedPercent > 0 ? `-${savedPercent}%` : '+0%';

        // Build card HTML
        card.innerHTML = `
            <div class="result-preview">
                <img src="${image.preview}" alt="${image.newName}" loading="lazy">
                <span class="result-badge">${savedDisplay}</span>
            </div>
            <div class="result-info">
                <div class="result-name" title="${image.newName}">${image.newName}</div>
                <div class="result-stats">
                    <div class="stat-item">
                        <span class="stat-label">Original</span>
                        <span class="stat-value">${formatBytes(image.originalSize)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">New</span>
                        <span class="stat-value">${formatBytes(image.newSize)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Saved</span>
                        <span class="stat-value saved">${savedPercent > 0 ? formatBytes(savedBytes) : '-'}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn-download" data-id="${image.id}">
                        <span>⬇️</span>
                        <span>Download</span>
                    </button>
                </div>
            </div>
        `;

        // Add download handler
        const downloadBtn = card.querySelector('.btn-download');
        downloadBtn.addEventListener('click', () => {
            downloadFile(image.blob, image.newName);
            showToast(`Downloaded: ${image.newName}`, 'success');
        });

        return card;
    }

    /**
     * Reset UI for processing more images
     */
    function resetForMore() {
        // Keep processed images but allow adding more
        state.files = [];
        state.processedImages = [];
        DOM.fileInput.value = '';

        updateUI();

        // Scroll to upload section
        DOM.uploadZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ========================================
    // Toast Notifications
    // ========================================
    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     */
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;

        // Apply styles
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            background: ${getToastBackground(type)};
            color: white;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 9999;
            animation: toastEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        // Add to DOM
        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toastExit 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    function getToastBackground(type) {
        const backgrounds = {
            success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            info: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
        };
        return backgrounds[type] || backgrounds.info;
    }

    // Add toast animation styles
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        @keyframes toastEnter {
            from {
                transform: translateX(100%) scale(0.9);
                opacity: 0;
            }
            to {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
        }
        @keyframes toastExit {
            from {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
            to {
                transform: translateX(100%) scale(0.9);
                opacity: 0;
            }
        }
        .toast-icon {
            font-size: 1rem;
            font-weight: 700;
        }
    `;
    document.head.appendChild(toastStyles);

    // ========================================
    // Initialize Application
    // ========================================
    document.addEventListener('DOMContentLoaded', init);

})();