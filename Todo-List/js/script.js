/**
 * TaskFlow — Modern SaaS Todo List Web Application Engine
 * Vanilla JavaScript (ES6)
 * Includes Light & Dark Mode System
 */

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. Constants & Application State
    // =========================================================================
    const STORAGE_KEY = "todo_tasks";
    const STORAGE_KEY_THEME = "todo_theme";

    // Application state
    let tasks = [];
    let currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || "light";
    let currentFilter = "all";       // 'all' | 'pending' | 'completed' | 'high-priority'
    let currentCategory = "all";     // 'all' | 'work' | 'study' | 'personal' | 'project' | 'other'
    let currentPriority = "all";     // 'all' | 'high' | 'medium' | 'low'
    let searchQuery = "";
    let currentSort = "dueDateAsc";  // 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'created' | 'title'
    let currentViewMode = "grid";    // 'grid' | 'list'

    // Seed tasks if localStorage is completely empty on first launch
    const SEED_TASKS = [
        {
            id: "task_1723380000001",
            title: "Finalize TaskFlow SaaS Dashboard Wireframes",
            description: "Review component hierarchy, responsive navigation breaks, and custom color accents.",
            date: getFutureDateStr(1),
            time: "17:00",
            priority: "high",
            category: "work",
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "task_1723380000002",
            title: "Study ES6 Data Structures & LocalStorage APIs",
            description: "Deep dive into array methods like filter, sort, map and persistent browser state management.",
            date: getFutureDateStr(3),
            time: "10:30",
            priority: "medium",
            category: "study",
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "task_1723380000003",
            title: "Setup Weekend Fitness Sprint & Goals",
            description: "Plan 5k morning run and hydration schedule.",
            date: getFutureDateStr(5),
            time: "07:00",
            priority: "low",
            category: "personal",
            completed: true,
            createdAt: new Date().toISOString()
        }
    ];

    function getFutureDateStr(daysAhead) {
        const d = new Date();
        d.setDate(d.getDate() + daysAhead);
        return d.toISOString().split('T')[0];
    }

    // =========================================================================
    // 2. DOM Elements Selection
    // =========================================================================
    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const emptyStateText = document.getElementById("emptyStateText");

    // Header & Search
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const currentDateText = document.getElementById("currentDateText");
    const openAddTaskModalBtn = document.getElementById("openAddTaskModalBtn");
    const emptyStateAddBtn = document.getElementById("emptyStateAddBtn");

    // Theme Toggle
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeSunIcon = document.getElementById("themeSunIcon");
    const themeMoonIcon = document.getElementById("themeMoonIcon");

    // Navigation & Filters
    const sidebarNavButtons = document.querySelectorAll(".sidebar-nav .nav-item");
    const categoryNavButtons = document.querySelectorAll(".category-nav .category-item");
    const priorityFilterSelect = document.getElementById("priorityFilterSelect");
    const sortBySelect = document.getElementById("sortBySelect");
    const currentViewTitle = document.getElementById("currentViewTitle");
    const activeFilterBadge = document.getElementById("activeFilterBadge");

    // View Switcher
    const gridViewBtn = document.getElementById("gridViewBtn");
    const listViewBtn = document.getElementById("listViewBtn");

    // Statistics Elements
    const statTotal = document.getElementById("statTotal");
    const statPending = document.getElementById("statPending");
    const statCompleted = document.getElementById("statCompleted");
    const statHighPriority = document.getElementById("statHighPriority");
    const statProgressFill = document.getElementById("statProgressFill");

    // Sidebar Counts
    const countAll = document.getElementById("countAll");
    const countPending = document.getElementById("countPending");
    const countCompleted = document.getElementById("countCompleted");
    const countHighPriority = document.getElementById("countHighPriority");

    // Modal Elements
    const taskModal = document.getElementById("taskModal");
    const modalTitle = document.getElementById("modalTitle");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const taskForm = document.getElementById("taskForm");
    const taskIdInput = document.getElementById("taskIdInput");
    const taskTitleInput = document.getElementById("taskTitleInput");
    const taskDescInput = document.getElementById("taskDescInput");
    const taskDateInput = document.getElementById("taskDateInput");
    const taskTimeInput = document.getElementById("taskTimeInput");
    const taskCategorySelect = document.getElementById("taskCategorySelect");
    const titleError = document.getElementById("titleError");
    const dateError = document.getElementById("dateError");
    const saveTaskBtnText = document.getElementById("saveTaskBtnText");

    const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
    const appSidebar = document.getElementById("appSidebar");
    const toastContainer = document.getElementById("toastContainer");

    // =========================================================================
    // 3. Initialization
    // =========================================================================
    function init() {
        initTheme();
        renderCurrentDate();
        loadTasks();
        setupEventListeners();
        setDefaultModalDate();
        renderTasks();
    }

    // =========================================================================
    // 4. Theme System (Light / Dark Mode)
    // =========================================================================
    function initTheme() {
        applyTheme(currentTheme);
    }

    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY_THEME, theme);

        if (theme === "dark") {
            themeMoonIcon.classList.add("hidden");
            themeSunIcon.classList.remove("hidden");
        } else {
            themeSunIcon.classList.add("hidden");
            themeMoonIcon.classList.remove("hidden");
        }
    }

    function toggleTheme() {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(newTheme);
        showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} mode ☀️`, "success");
    }

    function renderCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        currentDateText.textContent = new Date().toLocaleDateString('en-US', options);
    }

    function setDefaultModalDate() {
        const today = new Date().toISOString().split('T')[0];
        taskDateInput.value = today;
    }

    // =========================================================================
    // 5. Persistence (LocalStorage)
    // =========================================================================
    function loadTasks() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                tasks = JSON.parse(stored);
            } else {
                tasks = [...SEED_TASKS];
                saveTasks();
            }
        } catch (e) {
            console.error("Failed to parse tasks from localStorage", e);
            tasks = [...SEED_TASKS];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            updateStatistics();
        } catch (e) {
            console.error("Failed to save tasks to localStorage", e);
            showToast("Failed to save task to storage!", "danger");
        }
    }

    // =========================================================================
    // 6. Core Task CRUD
    // =========================================================================
    function saveTaskFromForm(e) {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const date = taskDateInput.value;
        const time = taskTimeInput.value;
        const category = taskCategorySelect.value;
        const priorityRadio = document.querySelector('input[name="taskPriority"]:checked');
        const priority = priorityRadio ? priorityRadio.value : "medium";

        let isValid = true;

        if (!title) {
            taskTitleInput.classList.add("is-invalid");
            titleError.style.display = "block";
            isValid = false;
        } else {
            taskTitleInput.classList.remove("is-invalid");
            titleError.style.display = "none";
        }

        if (!date) {
            taskDateInput.classList.add("is-invalid");
            dateError.style.display = "block";
            isValid = false;
        } else {
            taskDateInput.classList.remove("is-invalid");
            dateError.style.display = "none";
        }

        if (!isValid) return;

        const editId = taskIdInput.value;

        if (editId) {
            editTask(editId, { title, description, date, time, category, priority });
            showToast("Task updated successfully!", "success");
        } else {
            const newTask = {
                id: "task_" + Date.now(),
                title,
                description,
                date,
                time: time || "23:59",
                priority,
                category,
                completed: false,
                createdAt: new Date().toISOString()
            };
            addTask(newTask);
            showToast("New task created!", "success");
        }

        closeModal();
        renderTasks();
    }

    function addTask(newTaskObj) {
        tasks.unshift(newTaskObj);
        saveTasks();
    }

    function editTask(id, updatedFields) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedFields };
            saveTasks();
        }
    }

    function deleteTask(id) {
        const taskToDelete = tasks.find(t => t.id === id);
        if (!taskToDelete) return;

        if (confirm(`Are you sure you want to delete "${taskToDelete.title}"?`)) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            showToast("Task deleted", "danger");
        }
    }

    function toggleTaskStatus(id) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
            const statusMsg = tasks[index].completed ? "Task completed! 🎉" : "Task marked as pending";
            showToast(statusMsg, "success");
        }
    }

    // =========================================================================
    // 7. Filtering & Sorting
    // =========================================================================
    function filterTasks() {
        return tasks.filter(task => {
            if (currentFilter === "pending" && task.completed) return false;
            if (currentFilter === "completed" && !task.completed) return false;
            if (currentFilter === "high-priority" && task.priority !== "high") return false;

            if (currentCategory !== "all" && task.category !== currentCategory) return false;

            if (currentPriority !== "all" && task.priority !== currentPriority) return false;

            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const titleMatch = task.title.toLowerCase().includes(q);
                const descMatch = task.description.toLowerCase().includes(q);
                const categoryMatch = task.category.toLowerCase().includes(q);
                if (!titleMatch && !descMatch && !categoryMatch) return false;
            }

            return true;
        });
    }

    function sortTasks(taskListArray) {
        return taskListArray.sort((a, b) => {
            if (currentSort === "dueDateAsc") {
                const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
                return dateA - dateB;
            } else if (currentSort === "dueDateDesc") {
                const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
                return dateB - dateA;
            } else if (currentSort === "priority") {
                const priorityWeight = { high: 3, medium: 2, low: 1 };
                return priorityWeight[b.priority] - priorityWeight[a.priority];
            } else if (currentSort === "created") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (currentSort === "title") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    }

    function isOverdue(task) {
        if (task.completed || !task.date) return false;
        const dueDateTime = new Date(`${task.date}T${task.time || '23:59'}`);
        return dueDateTime < new Date();
    }

    // =========================================================================
    // 8. Rendering UI
    // =========================================================================
    function renderTasks() {
        const filtered = filterTasks();
        const sorted = sortTasks(filtered);

        taskList.innerHTML = "";

        if (sorted.length === 0) {
            taskList.classList.add("hidden");
            emptyState.classList.remove("hidden");
            if (searchQuery) {
                emptyStateText.textContent = `No tasks matching "${searchQuery}"`;
            } else {
                emptyStateText.textContent = "Create a new task to get started.";
            }
        } else {
            emptyState.classList.add("hidden");
            taskList.classList.remove("hidden");

            sorted.forEach(task => {
                const card = createTaskCardElement(task);
                taskList.appendChild(card);
            });
        }

        updateStatistics();
        updateActiveBadgesText();
    }

    function createTaskCardElement(task) {
        const card = document.createElement("div");
        card.className = `task-card ${task.completed ? 'completed' : ''}`;
        card.dataset.id = task.id;

        const overdue = isOverdue(task);
        const formattedDate = formatDateDisplay(task.date);

        card.innerHTML = `
            <div class="task-card-header">
                <div class="task-title-wrapper">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-toggle-checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <h3 class="task-title">${escapeHTML(task.title)}</h3>
                </div>
            </div>

            ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}

            <div class="task-meta-badges">
                <span class="badge badge-priority-${task.priority}">
                    ${task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '🌱'} ${task.priority} Priority
                </span>
                <span class="badge badge-category badge-category-${task.category}">
                    🏷️ ${task.category}
                </span>
                ${overdue ? `<span class="badge badge-overdue">⚠️ Overdue</span>` : ''}
            </div>

            <div class="task-card-footer">
                <div class="task-date-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span>${formattedDate} ${task.time ? 'at ' + task.time : ''}</span>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit-btn" title="Edit Task" aria-label="Edit Task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="action-btn delete-btn" title="Delete Task" aria-label="Delete Task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `;

        const checkbox = card.querySelector(".task-toggle-checkbox");
        checkbox.addEventListener("change", () => toggleTaskStatus(task.id));

        const editBtn = card.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => openEditModal(task));

        const deleteBtn = card.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        return card;
    }

    function updateStatistics() {
        const total = tasks.length;
        const pending = tasks.filter(t => !t.completed).length;
        const completed = tasks.filter(t => t.completed).length;
        const highPriority = tasks.filter(t => t.priority === "high" && !t.completed).length;

        statTotal.textContent = total;
        statPending.textContent = pending;
        statCompleted.textContent = completed;
        statHighPriority.textContent = highPriority;

        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
        statProgressFill.style.width = `${progressPercent}%`;

        countAll.textContent = total;
        countPending.textContent = pending;
        countCompleted.textContent = completed;
        countHighPriority.textContent = highPriority;
    }

    function updateActiveBadgesText() {
        const filterNames = {
            "all": "All Tasks",
            "pending": "Pending Tasks",
            "completed": "Completed Tasks",
            "high-priority": "High Priority Tasks"
        };

        currentViewTitle.textContent = filterNames[currentFilter] || "Tasks";
        
        let badgeStr = `Filter: ${filterNames[currentFilter]}`;
        if (currentCategory !== "all") {
            badgeStr += ` • Category: ${currentCategory}`;
        }
        if (currentPriority !== "all") {
            badgeStr += ` • Priority: ${currentPriority}`;
        }
        activeFilterBadge.textContent = badgeStr;
    }

    function openAddModal() {
        modalTitle.textContent = "Create New Task";
        saveTaskBtnText.textContent = "Save Task";
        taskIdInput.value = "";
        taskForm.reset();
        setDefaultModalDate();
        
        taskTitleInput.classList.remove("is-invalid");
        taskDateInput.classList.remove("is-invalid");
        titleError.style.display = "none";
        dateError.style.display = "none";

        taskModal.classList.remove("hidden");
        taskModal.setAttribute("aria-hidden", "false");
        taskTitleInput.focus();
    }

    function openEditModal(task) {
        modalTitle.textContent = "Edit Task";
        saveTaskBtnText.textContent = "Update Task";
        taskIdInput.value = task.id;
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description || "";
        taskDateInput.value = task.date;
        taskTimeInput.value = task.time || "";
        taskCategorySelect.value = task.category;

        const priorityRadio = document.querySelector(`input[name="taskPriority"][value="${task.priority}"]`);
        if (priorityRadio) priorityRadio.checked = true;

        taskTitleInput.classList.remove("is-invalid");
        taskDateInput.classList.remove("is-invalid");
        titleError.style.display = "none";
        dateError.style.display = "none";

        taskModal.classList.remove("hidden");
        taskModal.setAttribute("aria-hidden", "false");
        taskTitleInput.focus();
    }

    function closeModal() {
        taskModal.classList.add("hidden");
        taskModal.setAttribute("aria-hidden", "true");
    }

    // =========================================================================
    // 9. Event Listeners
    // =========================================================================
    function setupEventListeners() {
        // Theme toggle button
        themeToggleBtn.addEventListener("click", toggleTheme);

        openAddTaskModalBtn.addEventListener("click", openAddModal);
        emptyStateAddBtn.addEventListener("click", openAddModal);
        closeModalBtn.addEventListener("click", closeModal);
        cancelModalBtn.addEventListener("click", closeModal);

        taskModal.addEventListener("click", (e) => {
            if (e.target === taskModal) closeModal();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !taskModal.classList.contains("hidden")) {
                closeModal();
            }
        });

        taskForm.addEventListener("submit", saveTaskFromForm);

        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim();
            if (searchQuery) {
                clearSearchBtn.classList.remove("hidden");
            } else {
                clearSearchBtn.classList.add("hidden");
            }
            renderTasks();
        });

        clearSearchBtn.addEventListener("click", () => {
            searchInput.value = "";
            searchQuery = "";
            clearSearchBtn.classList.add("hidden");
            renderTasks();
            searchInput.focus();
        });

        sidebarNavButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                sidebarNavButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.dataset.filter;
                renderTasks();

                if (window.innerWidth <= 768) {
                    appSidebar.classList.remove("open");
                }
            });
        });

        categoryNavButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                categoryNavButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentCategory = btn.dataset.category;
                renderTasks();

                if (window.innerWidth <= 768) {
                    appSidebar.classList.remove("open");
                }
            });
        });

        priorityFilterSelect.addEventListener("change", (e) => {
            currentPriority = e.target.value;
            renderTasks();
        });

        sortBySelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderTasks();
        });

        gridViewBtn.addEventListener("click", () => {
            currentViewMode = "grid";
            gridViewBtn.classList.add("active");
            listViewBtn.classList.remove("active");
            taskList.classList.remove("list-view");
        });

        listViewBtn.addEventListener("click", () => {
            currentViewMode = "list";
            listViewBtn.classList.add("active");
            gridViewBtn.classList.remove("active");
            taskList.classList.add("list-view");
        });

        mobileSidebarToggle.addEventListener("click", () => {
            appSidebar.classList.toggle("open");
        });
    }

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span>${escapeHTML(message)}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function formatDateDisplay(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function escapeHTML(str) {
        if (!str) return "";
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    init();
});
