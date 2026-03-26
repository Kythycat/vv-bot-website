/**
 * Velvet Vendetta - Theme Toggle System
 * Handles switching between light and dark mode
 */

const THEME_KEY = 'velvet-theme';

function initTheme() {
    // Always set light mode as default on first visit
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateToggleIcon('dark');
    } else {
        // Default to light mode
        document.body.setAttribute('data-theme', 'light');
        updateToggleIcon('light');
        if (!savedTheme) {
            localStorage.setItem(THEME_KEY, 'light');
        }
    }
}

function updateToggleIcon(theme) {
    const toggleIcon = document.querySelector('.toggle-icon');
    if (toggleIcon) {
        toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateToggleIcon(newTheme);
    
    console.log(`Theme switched to: ${newTheme} mode`);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});