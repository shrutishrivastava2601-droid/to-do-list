/**
 * TaskFlow — Modern To-Do List Application
 * Pure Vanilla JavaScript (ES6+) Implementation
 */

(function () {
  'use strict';

  // Local Storage Keys
  const STORAGE_KEY_TASKS = 'taskflow_tasks_v2';
  const STORAGE_KEY_THEME = 'taskflow_theme_v2';

  // Application State
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'pending' | 'completed'
  let searchQuery = '';
  let editingTaskId = null;

  // DOM Elements - Header & Theme
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // DOM Elements - Statistics
  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');
  const statCompleted = document.getElementById('statCompleted');

  // DOM Elements - Task Input Form
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const dueDateInput = document.getElementById('dueDateInput');
  const inputErrorMessage = document.getElementById('inputErrorMessage');

  // DOM Elements - Controls & Filters
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // DOM Elements - Task List & Empty State
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateTitle = document.getElementById('emptyStateTitle');
  const emptyStateMessage = document.getElementById('emptyStateMessage');
  const toastContainer = document.getElementById('toastContainer');

  // DOM Elements - Edit Modal
  const editModalOverlay = document.getElementById('editModalOverlay');
  const editTaskForm = document.getElementById('editTaskForm');
  const modalTaskTitle = document.getElementById('modalTaskTitle');
  const modalPriority = document.getElementById('modalPriority');
  const modalDueDate = document.getElementById('modalDueDate');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    initTheme();
    renderCurrentDate();
    loadTasks();
    attachEventListeners();
    initRippleEffect();
    render();
  }

  // ==========================================
  // THEME MANAGEMENT
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  }

  // ==========================================
  // DATE DISPLAY
  // ==========================================
  function renderCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    currentDateDisplay.textContent = now.toLocaleDateString('en-US', options);
  }

  // ==========================================
  // LOCAL STORAGE OPERATIONS
  // ==========================================
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TASKS);
      tasks = stored ? JSON.parse(stored) : getSampleTasks();
    } catch (e) {
      console.error('Failed to parse tasks from localStorage:', e);
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage:', e);
      showToast('Error saving to Local Storage', 'danger');
    }
  }

  function getSampleTasks() {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'task-1',
        title: 'Review daily project targets & deliverables',
        completed: false,
        priority: 'high',
        dueDate: today,
        createdAt: Date.now() - 86400000
      },
      {
        id: 'task-2',
        title: 'Design glassmorphism UI components',
        completed: true,
        priority: 'medium',
        dueDate: '',
        createdAt: Date.now() - 172800000
      }
    ];
  }

  // ==========================================
  // TASK CRUD OPERATIONS
  // ==========================================

  // 1. ADD TASK
  function handleAddTask(e) {
    e.preventDefault();
    const title = taskInput.value.trim();

    // Input Validation
    if (!title) {
      showValidationError('Please enter a task description!');
      triggerShakeAnimation();
      taskInput.focus();
      return;
    }

    clearValidationError();

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: title,
      completed: false,
      priority: prioritySelect.value || 'medium',
      dueDate: dueDateInput.value || '',
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    render();

    // Reset Form Inputs
    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'medium';
    taskInput.focus();

    showToast('Task added successfully!', 'success');
  }

  // 2. TOGGLE COMPLETE / UNDO
  function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    render();

    if (task.completed) {
      showToast('Task marked as completed! 🎉', 'success');
    } else {
      showToast('Task moved to pending', 'info');
    }
  }

  // 3. DELETE TASK
  function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add('removing');
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        render();
        showToast('Task deleted', 'danger');
      }, 280);
    } else {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }
  }

  // 4. EDIT TASK VIA MODAL
  function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;
    modalTaskTitle.value = task.title;
    modalPriority.value = task.priority;
    modalDueDate.value = task.dueDate || '';

    editModalOverlay.classList.remove('hidden');
    editModalOverlay.setAttribute('aria-hidden', 'false');
    modalTaskTitle.focus();
  }

  function closeEditModal() {
    editingTaskId = null;
    editModalOverlay.classList.add('hidden');
    editModalOverlay.setAttribute('aria-hidden', 'true');
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    const newTitle = modalTaskTitle.value.trim();

    if (!newTitle) {
      showToast('Task title cannot be empty!', 'warning');
      return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.title = newTitle;
      task.priority = modalPriority.value;
      task.dueDate = modalDueDate.value;

      saveTasks();
      closeEditModal();
      render();
      showToast('Task updated successfully!', 'success');
    }
  }

  // 5. CLEAR ALL COMPLETED
  function handleClearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear!', 'warning');
      return;
    }

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
    showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`, 'info');
  }

  // ==========================================
  // VALIDATION & ANIMATIONS
  // ==========================================
  function showValidationError(msg) {
    inputErrorMessage.textContent = msg;
    inputErrorMessage.classList.add('visible');
  }

  function clearValidationError() {
    inputErrorMessage.textContent = '';
    inputErrorMessage.classList.remove('visible');
  }

  function triggerShakeAnimation() {
    taskForm.classList.remove('shake');
    void taskForm.offsetWidth; // Trigger reflow
    taskForm.classList.add('shake');
  }

  // ==========================================
  // SEARCH & FILTER PIPELINE
  // ==========================================
  function getFilteredTasks() {
    let result = [...tasks];

    // Filter by Tab
    if (currentFilter === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.priority && t.priority.toLowerCase().includes(q))
      );
    }

    return result;
  }

  // ==========================================
  // RENDER PIPELINE
  // ==========================================
  function render() {
    renderStats();
    renderTaskList();
  }

  function renderStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    statTotal.textContent = total;
    statPending.textContent = pending;
    statCompleted.textContent = completed;
  }

  function renderTaskList() {
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      emptyState.classList.remove('hidden');

      if (searchQuery) {
        emptyStateTitle.textContent = 'No matching tasks';
        emptyStateMessage.textContent = `No tasks matched "${searchQuery}".`;
      } else if (currentFilter === 'pending') {
        emptyStateTitle.textContent = 'No pending tasks!';
        emptyStateMessage.textContent = 'Awesome! You have completed all pending tasks.';
      } else if (currentFilter === 'completed') {
        emptyStateTitle.textContent = 'No completed tasks yet';
        emptyStateMessage.textContent = 'Completed tasks will show up here.';
      } else {
        emptyStateTitle.textContent = 'Your task list is empty';
        emptyStateMessage.textContent = 'Add a new task above to get started organizing your day.';
      }
      return;
    }

    emptyState.classList.add('hidden');

    filteredTasks.forEach(task => {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    // Format Due Date Badge
    let dateBadgeHtml = '';
    if (task.dueDate) {
      const formattedDate = formatDueDate(task.dueDate);
      const isOverdue = !task.completed && new Date(task.dueDate) < new Date().setHours(0,0,0,0);
      dateBadgeHtml = `
        <span class="badge badge-date ${isOverdue ? 'overdue' : ''}">
          📅 ${formattedDate} ${isOverdue ? '(Overdue)' : ''}
        </span>
      `;
    }

    const priorityBadge = `
      <span class="badge badge-priority-${task.priority}">
        ${task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
      </span>
    `;

    li.innerHTML = `
      <div class="task-left">
        <label class="custom-checkbox" title="${task.completed ? 'Mark Pending' : 'Mark Complete'}">
          <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle Complete">
          <span class="checkmark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </label>

        <div class="task-content">
          <span class="task-title">${escapeHtml(task.title)}</span>
          <div class="task-badges">
            ${priorityBadge}
            ${dateBadgeHtml}
          </div>
        </div>
      </div>

      <div class="task-actions">
        <button class="icon-action-btn btn-edit ripple" aria-label="Edit Task" title="Edit Task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="icon-action-btn btn-delete ripple" aria-label="Delete Task" title="Delete Task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `;

    // Event Bindings
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

    const editBtn = li.querySelector('.btn-edit');
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const deleteBtn = li.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return li;
  }

  // Helper: Format Due Date
  function formatDueDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ==========================================
  // EVENT LISTENERS SETUP
  // ==========================================
  function attachEventListeners() {
    // Theme Toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Add Task Form
    taskForm.addEventListener('submit', handleAddTask);
    taskInput.addEventListener('input', () => {
      if (taskInput.value.trim()) {
        clearValidationError();
      }
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchQuery) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
      render();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      searchInput.focus();
      render();
    });

    // Filter Buttons Tabs
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentFilter = btn.dataset.filter;
        render();
      });
    });

    // Clear Completed Button
    clearCompletedBtn.addEventListener('click', handleClearCompleted);

    // Modal Events
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditModalBtn.addEventListener('click', closeEditModal);
    editTaskForm.addEventListener('submit', handleSaveEdit);

    // Close Modal when clicking background overlay
    editModalOverlay.addEventListener('click', (e) => {
      if (e.target === editModalOverlay) {
        closeEditModal();
      }
    });

    // Close Modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !editModalOverlay.classList.contains('hidden')) {
        closeEditModal();
      }
    });
  }

  // ==========================================
  // BUTTON RIPPLE EFFECT
  // ==========================================
  function initRippleEffect() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.ripple');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-span');

      const existingRipple = target.querySelector('.ripple-span');
      if (existingRipple) {
        existingRipple.remove();
      }

      target.appendChild(circle);
    });
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '✓',
      danger: '✕',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2600);
  }

  // Security Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // DOM Loaded Trigger
  document.addEventListener('DOMContentLoaded', init);
})();