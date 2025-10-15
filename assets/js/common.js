/* Common JavaScript for CardinalNStar Portal */

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen if present
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }

    // Initialize theme from localStorage (TuiCSS is now default)
    const savedTheme = localStorage.getItem('selectedTheme') || 'tuicss';
    applyTheme(savedTheme);

    // Initialize status checking if needed
    if (typeof initializeStatusChecking === 'function') {
        initializeStatusChecking();
    }
}

// Theme Management
function applyTheme(theme) {
    // TuiCSS is now the primary theme
    // Always apply TuiCSS background class
    document.body.className = 'tui-bg-black-white';

    // Remove all theme stylesheets
    const themeSheets = document.querySelectorAll('[data-theme-stylesheet]');
    themeSheets.forEach(sheet => sheet.disabled = true);

    // Apply selected theme (TuiCSS is always enabled)
    switch(theme) {
        case 'tuicss':
        case 'terminal':
            const tuiSheet = document.getElementById('tuicss-stylesheet');
            if (tuiSheet) tuiSheet.disabled = false;
            document.body.classList.add('terminal-mode');
            break;
        case 'retro':
        case 'western':
            document.body.classList.add('western-mode');
            break;
        case 'carnival':
            document.body.classList.add('carnival-mode');
            if (typeof startCarnivalMode === 'function') {
                startCarnivalMode();
            }
            break;
        case 'neon':
        case 'glassmorphism':
        case 'modern':
        default:
            // TuiCSS is the default now
            document.body.classList.add('tui-mode');
            break;
    }

    // Save theme preference
    localStorage.setItem('selectedTheme', theme);
}

// Theme Selector
function createThemeSelector() {
    const selector = document.createElement('div');
    selector.className = 'theme-selector';
    selector.innerHTML = `
        <button class="theme-toggle" onclick="toggleThemeMenu()">🎨 Theme</button>
        <div class="theme-menu hidden" id="themeMenu">
            <button onclick="selectTheme('modern')">Modern</button>
            <button onclick="selectTheme('western')">Western</button>
            <button onclick="selectTheme('terminal')">Terminal</button>
            <button onclick="selectTheme('carnival')">Carnival</button>
        </div>
    `;
    document.body.appendChild(selector);
}

function toggleThemeMenu() {
    const menu = document.getElementById('themeMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function selectTheme(theme) {
    applyTheme(theme);
    // Close menu after selection
    const menu = document.getElementById('themeMenu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

// Status Checking
function checkServiceStatus(url, badgeElement) {
    const statusDot = badgeElement.querySelector('.status-dot');
    const statusLabel = badgeElement.querySelector('.status-label');

    // Set checking state
    badgeElement.className = 'status-badge checking';
    statusLabel.textContent = 'Checking';

    // Perform status check
    fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
    })
    .then(() => {
        // Service is reachable
        badgeElement.className = 'status-badge online';
        statusLabel.textContent = 'Online';
    })
    .catch(() => {
        // Service is not reachable
        badgeElement.className = 'status-badge offline';
        statusLabel.textContent = 'Offline';
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Animation helpers
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';

    const start = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;

        if (progress < 1) {
            element.style.opacity = progress;
            requestAnimationFrame(animate);
        } else {
            element.style.opacity = 1;
        }
    }

    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    const start = performance.now();
    const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);

    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;

        if (progress < 1) {
            element.style.opacity = initialOpacity * (1 - progress);
            requestAnimationFrame(animate);
        } else {
            element.style.opacity = 0;
            element.style.display = 'none';
        }
    }

    requestAnimationFrame(animate);
}

// Dialog System
function showDialog(title, content, buttons = []) {
    const existingDialog = document.querySelector('.dialog-overlay');
    if (existingDialog) {
        existingDialog.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'dialog';

    dialog.innerHTML = `
        <div class="dialog-header">
            <h3>${title}</h3>
            <button class="dialog-close" onclick="closeDialog()">×</button>
        </div>
        <div class="dialog-content">${content}</div>
        <div class="dialog-footer">
            ${buttons.map(btn =>
                `<button onclick="${btn.action}">${btn.text}</button>`
            ).join('')}
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    fadeIn(overlay);
}

function closeDialog() {
    const overlay = document.querySelector('.dialog-overlay');
    if (overlay) {
        fadeOut(overlay, 200);
        setTimeout(() => overlay.remove(), 200);
    }
}

// Event Bus for component communication
class EventBus {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// Create global event bus
window.eventBus = new EventBus();

// Export functions for use in other scripts
window.CardinalUtils = {
    applyTheme,
    checkServiceStatus,
    debounce,
    throttle,
    fadeIn,
    fadeOut,
    showDialog,
    closeDialog,
    eventBus: window.eventBus
};