/* Main Application Logic for CardinalNStar Portal */

let portalData = null;

// Initialize the application
async function initApp() {
    // Check authentication
    const isAuthenticated = await window.authManager.verifyToken();

    if (!isAuthenticated) {
        showLoginScreen();
        return;
    }

    // Load portal data
    try {
        portalData = await window.authManager.fetchPortalData();
        renderPortal();
        initializeStatusChecking();
    } catch (error) {
        console.error('Failed to load portal:', error);
        showError('Failed to load portal data. Please try again.');
    }
}

// Show login screen
function showLoginScreen() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="tui-window blue-255" style="max-width: 500px; margin: 50px auto;">
            <fieldset class="tui-fieldset">
                <legend>╔════════════════════════════════════════╗</legend>
                <legend align="center">║  CARDINALNSTAR PORTAL - LOGIN  ║</legend>
                <legend>╚════════════════════════════════════════╝</legend>
                <div style="padding: 30px;">
                    <h2 class="center-text" style="margin-bottom: 20px;">🔐 AUTHENTICATION REQUIRED</h2>
                    <p class="center-text" style="margin-bottom: 30px;">Please enter your credentials to continue</p>
                    <form id="loginForm" onsubmit="handleLogin(event)">
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Username:</label>
                            <input type="text" id="username" name="username" class="tui-input" required autocomplete="username" autofocus style="width: 100%; display: block; box-sizing: border-box;">
                        </div>
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Password:</label>
                            <input type="password" id="password" name="password" class="tui-input" required autocomplete="current-password" style="width: 100%; display: block; box-sizing: border-box;">
                        </div>
                        <div id="loginError" class="danger-text center-text hidden" style="margin: 15px 0; padding: 10px; border: 1px solid #a80000;"></div>
                        <div class="center-text" style="margin-top: 30px;">
                            <button type="submit" class="tui-button primary">Log In</button>
                        </div>
                    </form>
                    <div class="tui-divider"></div>
                    <p class="center-text" style="font-size: 0.85em; margin-top: 20px;">Default Credentials: admin / changeme123</p>
                </div>
            </fieldset>
        </div>
    `;
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Disable form during login
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    errorDiv.classList.add('hidden');

    const result = await window.authManager.login(username, password);

    if (result.success) {
        // Login successful, reload app
        initApp();
    } else {
        // Show error
        errorDiv.textContent = result.message || 'Login failed';
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
    }
}

// Handle logout
async function handleLogout() {
    await window.authManager.logout();
    showLoginScreen();
}

// Render the portal with data from API
function renderPortal() {
    const app = document.getElementById('app');
    if (!app || !portalData) return;

    const user = window.authManager.getUser();

    app.innerHTML = `
        <!-- Main Container -->
        <div class="portal-container">
            <!-- Header -->
            <div class="tui-window blue-255">
                <fieldset class="tui-fieldset">
                    <legend align="center">${portalData.portal.title.toUpperCase()} - ${portalData.portal.subtitle}</legend>
                    <div style="padding: 10px;">
                        <span>Welcome, ${user.username}</span>
                        <button onclick="handleLogout()" class="tui-button" style="float: right;">Logout</button>
                    </div>
                </fieldset>
            </div>

            <!-- Services -->
            <div class="services-container">
                ${portalData.links.filter(link => link.enabled).map(link => `
                    <div class="tui-window blue-255 service-card">
                        <fieldset class="tui-fieldset">
                            <legend>${link.title}</legend>
                            <div style="padding: 15px;">
                                <div style="text-align: center; font-size: 3em; margin-bottom: 15px;">${link.icon}</div>
                                <p>${link.description}</p>
                                <p><strong>URL:</strong> ${link.displayUrl}</p>
                                <div style="margin: 15px 0;">
                                    <span class="status-badge-tui status-checking" data-url="${link.url}">
                                        ● <span class="status-label">Checking</span>
                                    </span>
                                </div>
                                <a href="${link.url}" target="_blank" class="tui-button" style="width: 100%;">Open Service</a>
                            </div>
                        </fieldset>
                    </div>
                `).join('')}
            </div>

            <!-- Footer -->
            <div class="tui-window blue-255">
                <fieldset class="tui-fieldset">
                    <div style="padding: 10px; text-align: center;">
                        Version ${portalData.portal.version} | ${portalData.links.filter(link => link.enabled).length} Services Available
                    </div>
                </fieldset>
            </div>
        </div>
    `;
}

// Initialize status checking for all services
function initializeStatusChecking() {
    document.querySelectorAll('.status-badge-tui').forEach(badge => {
        const url = badge.getAttribute('data-url');
        if (url) {
            checkServiceStatusTui(url, badge);
        }
    });
}

// Check service status for TuiCSS styled badges
async function checkServiceStatusTui(url, badgeElement) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        });

        // With no-cors, we can't read the response, but if fetch succeeds, service is likely up
        badgeElement.classList.remove('status-checking');
        badgeElement.classList.add('status-online');
        badgeElement.querySelector('.status-label').textContent = 'ONLINE';
    } catch (error) {
        badgeElement.classList.remove('status-checking');
        badgeElement.classList.add('status-offline');
        badgeElement.querySelector('.status-label').textContent = 'OFFLINE';
    }
}

// Show error message
function showError(message) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="tui-window red-255" style="max-width: 600px; margin: 100px auto;">
            <fieldset class="tui-fieldset">
                <legend>╔═════════════════════════════╗</legend>
                <legend align="center">║  ⚠️  ERROR  ⚠️  ║</legend>
                <legend>╚═════════════════════════════╝</legend>
                <div style="padding: 30px; text-align: center;">
                    <p style="font-size: 1.2em; margin-bottom: 30px;">${message}</p>
                    <button onclick="initApp()" class="tui-button primary">Retry</button>
                </div>
            </fieldset>
        </div>
    `;
}


// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            initApp();
        }, 500);
    } else {
        initApp();
    }
});
