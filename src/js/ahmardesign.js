/**
 * AHMAR Design - JavaScript Helper utilities
 */

(function (global) {
  'use strict';

  const AHMAR = {
    // Theme Switcher & Storage
    themes: ['light', 'dark', 'cupcake', 'retro', 'cyberpunk', 'synthwave', 'aqua', 'valentine', 'brutalist', 'brutalist-dark'],
    
    init() {
      // Safe to call again (e.g. after a SPA mount): bindings are delegated and guarded.
      // 1. Initialize Theme
      this.initTheme();
      
      // 2. Initialize Interactive Elements
      this.initModals();
      this.initCollapse();
    },

    initTheme() {
      const savedTheme = localStorage.getItem('ahmar-theme') || 'light';
      this.setTheme(savedTheme);

      // Sync theme selects already on the page
      const syncSelects = () => {
        document.querySelectorAll('[data-theme-select]').forEach(select => {
          select.value = savedTheme;
        });
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncSelects, { once: true });
      } else {
        syncSelects();
      }

      // Delegated change handler covers selects added after init (SPA mounts)
      if (!this._themeSelectBound) {
        this._themeSelectBound = true;
        document.addEventListener('change', (e) => {
          if (e.target.matches('[data-theme-select]')) {
            this.setTheme(e.target.value);
          }
        });
      }
    },

    setTheme(theme) {
      if (this.themes.includes(theme)) {
        // Set data-theme on body
        document.body.setAttribute('data-theme', theme);
        // Set color-scheme for system integrations
        const isDark = ['dark', 'synthwave', 'aqua', 'brutalist-dark'].includes(theme);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        
        localStorage.setItem('ahmar-theme', theme);
        
        // Dispatch custom event for page listeners
        const event = new CustomEvent('ahmar-theme-change', { detail: { theme } });
        window.dispatchEvent(event);
      }
    },

    // Modal helpers (for JS control, though pure HTML checkbox works too!)
    initModals() {
      if (this._modalBound) return;
      this._modalBound = true;
      document.addEventListener('click', (e) => {
        // Close modal when clicking on close buttons
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
          const modal = closeBtn.closest('.modal');
          if (modal) {
            modal.classList.remove('modal-open');
          }
        }
      });
    },

    openModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        // If checkbox-based
        const checkbox = document.querySelector(`input[type="checkbox"]#${id}`);
        if (checkbox) {
          checkbox.checked = true;
        } else {
          // CSS class based
          modal.classList.add('modal-open');
        }
      }
    },

    closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        // If checkbox-based
        const checkbox = document.querySelector(`input[type="checkbox"]#${id}`);
        if (checkbox) {
          checkbox.checked = false;
        } else {
          // CSS class based
          modal.classList.remove('modal-open');
        }
      }
    },

    // Dynamic Collapse trigger (delegated, covers collapses rendered after init)
    initCollapse() {
      if (this._collapseBound) return;
      this._collapseBound = true;
      document.addEventListener('click', (e) => {
        const title = e.target.closest('.collapse-title');
        if (!title) return;
        const collapse = title.closest('.collapse');
        if (!collapse || collapse.matches(':has(input[type="checkbox"])')) return;
        collapse.classList.toggle('collapse-open');
      });
    },

    // Dynamic Toast alerts generator
    toast(message, type = 'info', duration = 3000) {
      // Find or create toast container
      let toastContainer = document.querySelector('.toast.toast-bottom.toast-end');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast toast-bottom toast-end';
        document.body.appendChild(toastContainer);
      }

      // Create alert element (entrance/exit animation is pure CSS via @keyframes)
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} shadow-md`;
      
      // Determine icon
      let icon = '';
      if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      } else if (type === 'warning') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
      } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      }

      alert.innerHTML = `
        ${icon}
        <span>${message}</span>
      `;

      toastContainer.appendChild(alert);

      // Auto-destroy toast after the exit animation (pure CSS `ahmar-toast-out`)
      setTimeout(() => {
        alert.classList.add('toast-closing');
        alert.addEventListener('animationend', () => {
          alert.remove();
          // Remove container if empty
          if (toastContainer.children.length === 0) {
            toastContainer.remove();
          }
        });
      }, duration);
    }
  };

  // Run automatically
  AHMAR.init();

  // Export
  global.AHMAR = AHMAR;

})(typeof window !== 'undefined' ? window : this);
