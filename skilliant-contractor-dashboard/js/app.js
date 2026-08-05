/**
 * ==========================================================================
 * SKILLIANT CONTRACTOR PORTAL - JAVASCRIPT APP CONTROLLER
 * Features:
 *  - Responsive Sidebar Collapse & Mobile Drawer Toggle
 *  - Active Navigation Tab Switching with Smooth Animations
 *  - Interactive Search Bar with Keyboard Shortcut (Ctrl+K)
 *  - Notification Dropdown System & Real-Time Badge Counter
 *  - Dynamic Date Formatting
 *  - Labour Allocation Table Filter Pills
 *  - Instant Labour Request Form with Toast Feedback System
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State Management
  const state = {
    activeTab: 'dashboard',
    isSidebarCollapsed: localStorage.getItem('skilliant_sidebar_collapsed') === 'true',
    unreadNotifications: 3,
    searchItems: [
      { title: 'Ramesh Maurya (Senior Mason Crew)', type: 'Labour Lead', tab: 'labour' },
      { title: 'Metro Line 4 - Station 12', type: 'Active Site', tab: 'projects' },
      { title: 'Verdana Luxury Towers', type: 'Active Site', tab: 'projects' },
      { title: 'Weekly Payout Invoice #INV-2026-08', type: 'Financial Record', tab: 'wallet' },
      { title: 'Suresh Kumar (Electrician Crew)', type: 'Labour Lead', tab: 'labour' },
      { title: 'Highway Flyover Extension', type: 'Active Site', tab: 'projects' },
      { title: 'Escrow Guarantee Certificate', type: 'Compliance', tab: 'company' }
    ]
  };

  // DOM Element References
  const DOM = {
    body: document.body,
    sidebar: document.getElementById('sidebar'),
    sidebarCollapseBtn: document.getElementById('sidebarCollapseBtn'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    navLinks: document.querySelectorAll('.nav-link'),
    tabContents: document.querySelectorAll('.tab-content'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    searchResultsDropdown: document.getElementById('searchResultsDropdown'),
    searchResultsBody: document.getElementById('searchResultsBody'),
    notificationBtn: document.getElementById('notificationBtn'),
    notificationDropdown: document.getElementById('notificationDropdown'),
    notifBadge: document.getElementById('notifBadge'),
    markAllReadBtn: document.getElementById('markAllReadBtn'),
    currentDateText: document.getElementById('dateText'),
    filterPills: document.querySelectorAll('.pill-btn'),
    tableRows: document.querySelectorAll('#labourAllocationTable tbody tr'),
    quickHireForm: document.getElementById('quickHireForm'),
    quickHireBtn: document.getElementById('quickHireBtn'),
    hireLabourBtn: document.getElementById('hireLabourBtn'),
    depositFundsBtn: document.getElementById('depositFundsBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  /* --------------------------------------------------------------------------
     1. INITIALIZATION & LIVE DATE
     -------------------------------------------------------------------------- */
  function init() {
    setupDateWidget();
    applyInitialSidebarState();
    registerEventListeners();
    setupKeyboardShortcuts();
  }

  function setupDateWidget() {
    if (!DOM.currentDateText) return;
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    DOM.currentDateText.textContent = now.toLocaleDateString('en-US', options);
  }

  /* --------------------------------------------------------------------------
     2. SIDEBAR COLLAPSE & MOBILE DRAWER TOGGLE
     -------------------------------------------------------------------------- */
  function applyInitialSidebarState() {
    if (state.isSidebarCollapsed && window.innerWidth > 768) {
      DOM.body.classList.add('sidebar-collapsed');
    }
  }

  function toggleSidebarCollapse() {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    DOM.body.classList.toggle('sidebar-collapsed', state.isSidebarCollapsed);
    localStorage.setItem('skilliant_sidebar_collapsed', state.isSidebarCollapsed);
  }

  function openMobileSidebar() {
    DOM.body.classList.add('sidebar-open');
    DOM.sidebarOverlay.classList.add('active');
  }

  function closeMobileSidebar() {
    DOM.body.classList.remove('sidebar-open');
    DOM.sidebarOverlay.classList.remove('active');
  }

  /* --------------------------------------------------------------------------
     3. NAVIGATION & TAB SWITCHING
     -------------------------------------------------------------------------- */
  function switchTab(targetTab) {
    if (!targetTab) return;
    state.activeTab = targetTab;

    // Update active state on Nav Links
    DOM.navLinks.forEach(link => {
      const isMatch = link.dataset.tab === targetTab;
      link.classList.toggle('active', isMatch);
    });

    // Update active Tab View with smooth transition
    DOM.tabContents.forEach(content => {
      if (content.id === `tab-${targetTab}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Auto close mobile drawer if open
    closeMobileSidebar();
  }

  /* --------------------------------------------------------------------------
     4. SEARCH INTERACTION & QUICK RESULTS MODAL
     -------------------------------------------------------------------------- */
  function handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      DOM.searchResultsDropdown.classList.remove('active');
      return;
    }

    const filtered = state.searchItems.filter(item =>
      item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query)
    );

    renderSearchResults(filtered);
  }

  function renderSearchResults(results) {
    DOM.searchResultsBody.innerHTML = '';
    if (results.length === 0) {
      DOM.searchResultsBody.innerHTML = `
        <div style="padding: 12px 16px; font-size: 0.82rem; color: var(--text-dim);">
          No matching records found.
        </div>`;
    } else {
      results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
          <span class="search-item-title">${escapeHTML(item.title)}</span>
          <span class="search-item-type">${escapeHTML(item.type)}</span>
        `;
        div.addEventListener('click', () => {
          switchTab(item.tab);
          DOM.searchResultsDropdown.classList.remove('active');
          DOM.globalSearchInput.value = '';
          showToast(`Navigated to ${item.title}`);
        });
        DOM.searchResultsBody.appendChild(div);
      });
    }
    DOM.searchResultsDropdown.classList.add('active');
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K shortcut for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        DOM.globalSearchInput.focus();
      }
      // Escape to close dropdowns
      if (e.key === 'Escape') {
        DOM.searchResultsDropdown.classList.remove('active');
        DOM.notificationDropdown.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. NOTIFICATION DROPDOWN & READ STATUS
     -------------------------------------------------------------------------- */
  function toggleNotifications(e) {
    e.stopPropagation();
    DOM.notificationDropdown.classList.toggle('active');
    DOM.searchResultsDropdown.classList.remove('active');
  }

  function markAllNotificationsRead() {
    state.unreadNotifications = 0;
    DOM.notifBadge.style.display = 'none';
    const unreadItems = DOM.notificationDropdown.querySelectorAll('.notif-item.unread');
    unreadItems.forEach(item => item.classList.remove('unread'));
    showToast('All notifications marked as read');
  }

  /* --------------------------------------------------------------------------
     6. LABOUR ALLOCATION TABLE FILTER PILLS
     -------------------------------------------------------------------------- */
  function handleFilterPillClick(e) {
    const pill = e.target.closest('.pill-btn');
    if (!pill) return;

    DOM.filterPills.forEach(btn => btn.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;
    filterTableRows(filter);
  }

  function filterTableRows(filter) {
    DOM.tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (filter === 'all') {
        row.style.display = '';
      } else if (filter === 'masons' && text.includes('mason')) {
        row.style.display = '';
      } else if (filter === 'electricians' && text.includes('electrician')) {
        row.style.display = '';
      } else if (filter === 'carpenters' && text.includes('carpentr') || text.includes('shuttering')) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. INSTANT LABOUR FORM SUBMISSION & TOAST NOTIFICATIONS
     -------------------------------------------------------------------------- */
  function handleQuickHireSubmit(e) {
    e.preventDefault();
    const skill = document.getElementById('labourSkillSelect').value;
    const count = document.getElementById('labourCountInput').value;
    const site = document.getElementById('siteSelect').selectedOptions[0].text;

    showToast(`Request sent for ${count} ${skill}(s) at ${site}!`, 'success');
    DOM.quickHireForm.reset();
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconColor = type === 'success' ? 'var(--status-green)' : 'var(--primary-blue)';
    
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${escapeHTML(message)}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* Helper function to sanitize text */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  /* --------------------------------------------------------------------------
     8. EVENT LISTENERS BINDING
     -------------------------------------------------------------------------- */
  function registerEventListeners() {
    // Sidebar collapse button
    if (DOM.sidebarCollapseBtn) {
      DOM.sidebarCollapseBtn.addEventListener('click', toggleSidebarCollapse);
    }

    // Mobile menu toggle
    if (DOM.mobileMenuBtn) {
      DOM.mobileMenuBtn.addEventListener('click', openMobileSidebar);
    }

    // Sidebar overlay click
    if (DOM.sidebarOverlay) {
      DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    // Navigation Links Tab Switch
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        switchTab(tab);
      });
    });

    // Links with data-tab attributes anywhere in document
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-tab]');
      if (link && !link.classList.contains('nav-link')) {
        e.preventDefault();
        switchTab(link.dataset.tab);
      }
    });

    // Search bar input & focus events
    if (DOM.globalSearchInput) {
      DOM.globalSearchInput.addEventListener('input', handleSearchInput);
      DOM.globalSearchInput.addEventListener('focus', handleSearchInput);
    }

    // Notification dropdown toggle
    if (DOM.notificationBtn) {
      DOM.notificationBtn.addEventListener('click', toggleNotifications);
    }

    if (DOM.markAllReadBtn) {
      DOM.markAllReadBtn.addEventListener('click', markAllNotificationsRead);
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (DOM.searchResultsDropdown && !e.target.closest('.header-search')) {
        DOM.searchResultsDropdown.classList.remove('active');
      }
      if (DOM.notificationDropdown && !e.target.closest('.notification-container')) {
        DOM.notificationDropdown.classList.remove('active');
      }
    });

    // Filter pills
    DOM.filterPills.forEach(pill => pill.addEventListener('click', handleFilterPillClick));

    // Quick hire form
    if (DOM.quickHireForm) {
      DOM.quickHireForm.addEventListener('submit', handleQuickHireSubmit);
    }

    // Quick hire buttons
    if (DOM.quickHireBtn) {
      DOM.quickHireBtn.addEventListener('click', () => switchTab('dashboard'));
    }
    if (DOM.hireLabourBtn) {
      DOM.hireLabourBtn.addEventListener('click', () => {
        switchTab('dashboard');
        document.getElementById('labourCountInput').focus();
        showToast('Instant Labour Booking form highlighted');
      });
    }

    if (DOM.depositFundsBtn) {
      DOM.depositFundsBtn.addEventListener('click', () => {
        showToast('Redirecting to Escrow Top-Up Payment Gateway...');
      });
    }
  }

  // Run Initialization
  init();

});
