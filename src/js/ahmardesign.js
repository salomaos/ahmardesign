/**
 * AHMAR Design - JavaScript Helper utilities
 */

(function (global) {
  'use strict';

  const AHMAR = {
    // Theme Switcher & Storage
    themes: ['light', 'dark', 'cupcake', 'retro', 'cyberpunk', 'synthwave', 'aqua', 'valentine'],
    
    init() {
      // 1. Initialize Theme
      this.initTheme();
      
      // 2. Initialize Interactive Elements
      this.initModals();
      this.initCollapse();
    },

    initTheme() {
      const savedTheme = localStorage.getItem('ahmar-theme') || 'light';
      this.setTheme(savedTheme);
      
      // Sync theme selects if any exist on the page
      document.addEventListener('DOMContentLoaded', () => {
        const themeSelectors = document.querySelectorAll('[data-theme-select]');
        themeSelectors.forEach(select => {
          select.value = savedTheme;
          select.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
          });
        });
      });
    },

    setTheme(theme) {
      if (this.themes.includes(theme)) {
        // Set data-theme on body
        document.body.setAttribute('data-theme', theme);
        // Set color-scheme for system integrations
        const isDark = ['dark', 'synthwave', 'aqua'].includes(theme);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        
        localStorage.setItem('ahmar-theme', theme);
        
        // Dispatch custom event for page listeners
        const event = new CustomEvent('ahmar-theme-change', { detail: { theme } });
        window.dispatchEvent(event);
      }
    },

    // Modal helpers (for JS control, though pure HTML checkbox works too!)
    initModals() {
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

    // Dynamic Collapse trigger
    initCollapse() {
      // Handles toggling collapse state via JS if checkboxes aren't used
      document.querySelectorAll('.collapse:not(:has(input[type="checkbox"]))').forEach(collapse => {
        const title = collapse.querySelector('.collapse-title');
        if (title) {
          title.addEventListener('click', () => {
            collapse.classList.toggle('collapse-open');
          });
        }
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

      // Create alert element
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} shadow-md transition-all duration-300 transform translate-y-10 opacity-0`;
      
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

      // Trigger animations
      setTimeout(() => {
        alert.classList.remove('translate-y-10', 'opacity-0');
      }, 50);

      // Auto-destroy toast
      setTimeout(() => {
        alert.classList.add('opacity-0', 'scale-95');
        alert.addEventListener('transitionend', () => {
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
