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
    const STORAGE_KEY_PROFILE = "todo_profile";

    // Application state
    let tasks = [];
    let currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || "light";
    let currentFilter = "all";       // 'all' | 'pending' | 'completed' | 'high-priority'
    let currentCategory = "all";     // 'all' | 'work' | 'study' | 'personal' | 'project' | 'other'
    let currentPriority = "all";     // 'all' | 'high' | 'medium' | 'low'
    let searchQuery = "";
    let currentSort = "dueDateAsc";  // 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'created' | 'title'
    let currentViewMode = "grid";    // 'grid' | 'list'
    let selectedTaskId = null;

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

    // Profile & Settings
    const openProfileBtn = document.getElementById("openProfileBtn");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const profileModal = document.getElementById("profileModal");
    const closeProfileBtn = document.getElementById("closeProfileBtn");
    const cancelProfileBtn = document.getElementById("cancelProfileBtn");
    const profileForm = document.getElementById("profileForm");
    const profileNameInput = document.getElementById("profileNameInput");
    const profileUsernameInput = document.getElementById("profileUsernameInput");
    const profileEmailInput = document.getElementById("profileEmailInput");
    const profileAvatar = document.getElementById("profileAvatar");
    const profilePreviewName = document.getElementById("profilePreviewName");
    const profilePreviewRole = document.getElementById("profilePreviewRole");
    const profilePreviewEmail = document.getElementById("profilePreviewEmail");

    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const settingsLightBtn = document.getElementById("settingsLightBtn");
    const settingsDarkBtn = document.getElementById("settingsDarkBtn");
    const clearAllDataBtn = document.getElementById("clearAllDataBtn");
    const quickCreateTaskBtn = document.getElementById("quickCreateTaskBtn");
    const exportTasksBtn = document.getElementById("exportTasksBtn");


    // =========================================================================
    // 3. Initialization
    // =========================================================================
    function init() {
        initTheme();
        renderCurrentDate();
        loadTasks();
        loadProfile();
        setupEventListeners();
        setDefaultModalDate();
        renderTasks();
    }

    // =========================================================================
    // 4. Theme System (Light / Dark Mode)
    // =========================================================================
    function initTheme() {
        if (currentTheme !== "light" && currentTheme !== "dark") currentTheme = "light";
        applyTheme(currentTheme);
    }

    function applyTheme(theme) {
        currentTheme = theme === "dark" ? "dark" : "light";
        const root = document.documentElement;

        root.setAttribute("data-theme", currentTheme);
        root.style.colorScheme = currentTheme;
        localStorage.setItem(STORAGE_KEY_THEME, currentTheme);

        if (themeMoonIcon && themeSunIcon) {
            themeMoonIcon.classList.toggle("hidden", currentTheme === "dark");
            themeSunIcon.classList.toggle("hidden", currentTheme !== "dark");
        }

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute("aria-pressed", currentTheme === "dark" ? "true" : "false");
            themeToggleBtn.setAttribute(
                "title",
                currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            );
        }

        updateThemeChoiceState();
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
    function normalizeTask(task, index = 0) {
        if (!task || typeof task !== "object") return null;
        const categoryMap = {
            work: "work", study: "study", personal: "personal",
            project: "project", projects: "project", other: "other",
            task: "other"
        };
        const rawCategory = String(task.category || "other").trim().toLowerCase();
        return {
            id: String(task.id || `task_${Date.now()}_${index}`),
            title: String(task.title || "Untitled Task"),
            description: String(task.description || ""),
            date: task.date || getFutureDateStr(1),
            time: task.time || "23:59",
            priority: ["high", "medium", "low"].includes(String(task.priority)) ? String(task.priority) : "medium",
            category: categoryMap[rawCategory] || "other",
            completed: Boolean(task.completed),
            createdAt: task.createdAt || new Date().toISOString()
        };
    }

    function loadTasks() {
        try {
            // Read the current key first, then migrate tasks from older Bloomly/TaskFlow builds.
            const possibleKeys = [STORAGE_KEY, "taskflow_tasks", "petaldesk_tasks", "todoTasks", "skilliant_todos", "tasks"];
            let found = null;
            let foundKey = null;

            for (const key of possibleKeys) {
                const raw = localStorage.getItem(key);
                if (!raw) continue;
                try {
                    const parsed = JSON.parse(raw);
                    const candidate = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.tasks) ? parsed.tasks : null);
                    if (candidate) {
                        found = candidate;
                        foundKey = key;
                        break;
                    }
                } catch (parseError) {
                    console.warn(`Ignoring invalid task data in ${key}`);
                }
            }

            if (found) {
                tasks = found.map(normalizeTask).filter(Boolean);
                // Always keep the repaired app's storage key in sync so refresh/reopen works.
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            } else {
                tasks = SEED_TASKS.map(task => ({ ...task }));
                saveTasks();
            }

            // Do not apply a category filter on page restore. All saved categories are shown.
            currentCategory = "all";
            currentFilter = "all";
            currentPriority = "all";
            searchQuery = "";
        } catch (e) {
            console.error("Failed to load tasks from localStorage", e);
            tasks = [];
        }
    }

    function saveTasks() {
        try {
            const serialized = JSON.stringify(tasks);
            localStorage.setItem(STORAGE_KEY, serialized);
            // Verify the browser actually stored the data.
            if (localStorage.getItem(STORAGE_KEY) !== serialized) {
                throw new Error("LocalStorage write verification failed");
            }
            updateStatistics();
        } catch (e) {
            console.error("Failed to save tasks to localStorage", e);
            showToast("Task could not be saved in this browser.", "danger");
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
        const normalized = normalizeTask(newTaskObj);
        if (normalized) tasks.unshift(normalized);
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
            if (selectedTaskId === id) selectedTaskId = null;
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
    // 7. Profile, Settings & Quick Actions
    // =========================================================================
    function loadProfile() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
            const profile = saved ? JSON.parse(saved) : {};
            profileNameInput.value = profile.name || "";
            profileUsernameInput.value = profile.username || "";
            profileEmailInput.value = profile.email || "";
            updateProfilePreview(profile);
        } catch (e) {
            console.error("Failed to load profile:", e);
            updateProfilePreview({});
        }
    }

    function updateProfilePreview(profile) {
        const name = profile.name || "Your Name";
        const username = profile.username || "@username";
        const email = profile.email || "email@example.com";
        profilePreviewName.textContent = name;
        profilePreviewRole.textContent = username.startsWith("@") ? username : `@${username}`;
        profilePreviewEmail.textContent = email;
        profileAvatar.textContent = name.trim().charAt(0).toUpperCase() || "T";
    }

    function openProfileModal() {
        loadProfile();
        profileModal.classList.remove("hidden");
        profileModal.setAttribute("aria-hidden", "false");
        profileNameInput.focus();
    }

    function closeProfileModal() {
        profileModal.classList.add("hidden");
        profileModal.setAttribute("aria-hidden", "true");
    }

    function saveProfile(e) {
        e.preventDefault();
        const profile = {
            name: profileNameInput.value.trim() || "Your Name",
            username: profileUsernameInput.value.trim() || "username",
            email: profileEmailInput.value.trim() || "email@example.com"
        };
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
        updateProfilePreview(profile);
        closeProfileModal();
        showToast("Profile saved successfully!", "success");
    }

    function openSettingsModal() {
        updateThemeChoiceState();
        settingsModal.classList.remove("hidden");
        settingsModal.setAttribute("aria-hidden", "false");
    }

    function closeSettingsModal() {
        settingsModal.classList.add("hidden");
        settingsModal.setAttribute("aria-hidden", "true");
    }

    function updateThemeChoiceState() {
        settingsLightBtn.classList.toggle("active", currentTheme === "light");
        settingsDarkBtn.classList.toggle("active", currentTheme === "dark");
    }

    function clearAllData() {
        const confirmed = confirm(
            "Clear all TaskFlow data? This will remove every saved task, profile, and theme preference from this browser."
        );
        if (!confirmed) return;

        tasks = [];
        selectedTaskId = null;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY_PROFILE);
        localStorage.removeItem(STORAGE_KEY_THEME);

        applyTheme("light");
        loadProfile();
        renderTasks();
        closeSettingsModal();
        showToast("All saved data has been cleared.", "danger");
    }

    function exportTasks() {
        const payload = {
            exportedAt: new Date().toISOString(),
            application: "TaskFlow",
            version: "1.0",
            tasks: tasks
        };

        try {
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `taskflow-tasks-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 500);
            showToast(`Exported ${tasks.length} task${tasks.length === 1 ? "" : "s"}.`, "success");
        } catch (error) {
            console.error("Task export failed:", error);
            showToast("Unable to export tasks in this browser.", "danger");
        }
    }

    function selectTask(id) {
        selectedTaskId = id;
        document.querySelectorAll(".task-card").forEach(card => {
            card.classList.toggle("selected", card.dataset.id === id);
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
    function filterTasks() {
        return tasks.filter(task => {
            // Sidebar status filter
            if (currentFilter === "pending" && task.completed) return false;
            if (currentFilter === "completed" && !task.completed) return false;
            if (currentFilter === "high-priority" && (task.priority !== "high" || task.completed)) return false;

            // Category filter
            if (currentCategory !== "all" && task.category !== currentCategory) return false;

            // Priority filter
            if (currentPriority !== "all" && task.priority !== currentPriority) return false;

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const searchable = [
                    task.title,
                    task.description,
                    task.category,
                    task.priority
                ].filter(Boolean).join(" ").toLowerCase();

                if (!searchable.includes(query)) return false;
            }

            return true;
        });
    }

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
        card.tabIndex = 0;
        card.setAttribute("aria-label", `Task: ${task.title}`);

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

        card.addEventListener("click", (e) => {
            if (e.target.closest("button, input, label")) return;
            selectTask(task.id);
        });

        card.addEventListener("focus", () => selectTask(task.id));

        const checkbox = card.querySelector(".task-toggle-checkbox");
        checkbox.addEventListener("change", () => toggleTaskStatus(task.id));

        const editBtn = card.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => {
            selectTask(task.id);
            openEditModal(task);
        });

        const deleteBtn = card.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            selectTask(task.id);
            deleteTask(task.id);
        });

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
        themeToggleBtn.addEventListener("click", () => {
            toggleTheme();
            updateThemeChoiceState();
        });

        openAddTaskModalBtn.addEventListener("click", openAddModal);
        if (quickCreateTaskBtn) quickCreateTaskBtn.addEventListener("click", openAddModal);

        if (openProfileBtn) openProfileBtn.addEventListener("click", openProfileModal);
        if (openSettingsBtn) openSettingsBtn.addEventListener("click", openSettingsModal);
        if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeProfileModal);
        if (cancelProfileBtn) cancelProfileBtn.addEventListener("click", closeProfileModal);
        if (profileForm) profileForm.addEventListener("submit", saveProfile);
        if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", closeSettingsModal);
        if (settingsLightBtn) settingsLightBtn.addEventListener("click", () => {
            applyTheme("light");
            updateThemeChoiceState();
            showToast("Light mode enabled.", "success");
        });
        if (settingsDarkBtn) settingsDarkBtn.addEventListener("click", () => {
            applyTheme("dark");
            updateThemeChoiceState();
            showToast("Dark mode enabled.", "success");
        });
        if (clearAllDataBtn) clearAllDataBtn.addEventListener("click", clearAllData);
        if (exportTasksBtn) exportTasksBtn.addEventListener("click", exportTasks);

        emptyStateAddBtn.addEventListener("click", openAddModal);
        closeModalBtn.addEventListener("click", closeModal);
        cancelModalBtn.addEventListener("click", closeModal);

        taskModal.addEventListener("click", (e) => {
            if (e.target === taskModal) closeModal();
        });

        if (profileModal) {
            profileModal.addEventListener("click", (e) => {
                if (e.target === profileModal) closeProfileModal();
            });
        }
        if (settingsModal) {
            settingsModal.addEventListener("click", (e) => {
                if (e.target === settingsModal) closeSettingsModal();
            });
        }

        

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

        // Create New Task shortcut. Prevent the browser's Ctrl/Cmd+N new-window action.
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
                e.preventDefault();
                e.stopPropagation();
                openAddModal();
            }
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


/* ============================================================
   PetalDesk interaction repair layer
   No shortcut keys. Existing task functions are preserved.
   ============================================================ */
(function () {
  'use strict';

  function byId(id) { return document.getElementById(id); }

  function callFirst(names, args) {
    for (const name of names) {
      if (typeof window[name] === 'function') {
        try { return window[name].apply(window, args || []); }
        catch (err) { console.error('PetalDesk action error:', name, err); }
      }
    }
    return undefined;
  }

  function taskStoreKeys() {
    return ['tasks', 'taskflow_tasks', 'petaldesk_tasks', 'todoTasks', 'skilliant_todos'];
  }

  function readTasks() {
    for (const key of taskStoreKeys()) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const value = JSON.parse(raw);
        if (Array.isArray(value)) return { key, tasks: value };
        if (value && Array.isArray(value.tasks)) return { key, tasks: value.tasks };
      } catch (_) {}
    }
    return { key: 'tasks', tasks: [] };
  }

  function writeTasks(tasks, preferredKey) {
    const key = preferredKey || readTasks().key || 'tasks';
    localStorage.setItem(key, JSON.stringify(tasks));
    return key;
  }

  function notify(message) {
    const existing = document.querySelector('.toast, .notification, [role="status"]');
    if (existing) {
      existing.textContent = message;
      existing.classList.add('show', 'visible', 'active');
      setTimeout(() => existing.classList.remove('show', 'visible', 'active'), 2200);
      return;
    }
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText =
      'position:fixed;right:20px;bottom:20px;z-index:99999;padding:12px 16px;' +
      'border-radius:12px;background:#d95f8d;color:#fff;font:600 13px system-ui;' +
      'box-shadow:0 12px 30px rgba(0,0,0,.18)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function closeOverlays() {
    document.querySelectorAll(
      '.modal-overlay,.modal,.dialog,.settings-panel,.profile-panel,' +
      '[data-modal], [aria-modal="true"]'
    ).forEach(el => {
      if (el.classList.contains('modal-overlay')) el.classList.remove('show','active','visible');
      if (el.hasAttribute('hidden') === false && (el.matches('.modal,.dialog,.settings-panel,.profile-panel,[data-modal]'))) {
        el.setAttribute('hidden','');
      }
    });
  }

  function openModalByTarget(target) {
    const targetId = target.getAttribute('data-target') ||
                     target.getAttribute('data-modal-target') ||
                     target.getAttribute('data-open') ||
                     target.getAttribute('aria-controls');
    if (!targetId) return false;
    const id = targetId.replace(/^#/, '');
    const el = byId(id) || document.querySelector(targetId);
    if (!el) return false;
    el.removeAttribute('hidden');
    el.classList.add('show','active','visible');
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.add('show','active','visible');
      overlay.removeAttribute('hidden');
    }
    return true;
  }

  function setTheme(theme) {
    const value = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', value);
    document.body.classList.toggle('dark-mode', value === 'dark');
    document.documentElement.style.colorScheme = value;
    localStorage.setItem('petaldesk_theme', value);
    localStorage.setItem('taskflow_theme', value);

    const buttons = document.querySelectorAll(
      '#themeToggleBtn,#darkModeToggle,[data-theme-toggle],#lightModeBtn,#darkModeBtn,' +
      '[data-theme="light"],[data-theme="dark"]'
    );
    buttons.forEach(btn => {
      const requested = btn.getAttribute('data-theme');
      if (requested) btn.classList.toggle('active', requested === value);
      btn.setAttribute('aria-pressed', requested ? String(requested === value) : String(value === 'dark'));
    });

    return value;
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') ||
      localStorage.getItem('petaldesk_theme') ||
      localStorage.getItem('taskflow_theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
    notify(current === 'dark' ? 'Light mode enabled' : 'Dark mode enabled');
  }

  function exportTasks() {
    const store = readTasks();
    const payload = {
      app: 'PetalDesk',
      exportedAt: new Date().toISOString(),
      tasks: store.tasks
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'petaldesk-tasks-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Task data exported');
  }

  function clearAll() {
    const count = readTasks().tasks.length;
    if (!count) {
      notify('There are no tasks to clear');
      return;
    }
    if (!window.confirm('Clear all tasks? This action cannot be undone.')) return;
    for (const key of taskStoreKeys()) {
      localStorage.removeItem(key);
    }
    callFirst(['renderTasks','render','renderAll','refreshTasks','loadTasks']);
    notify('All tasks cleared');
  }

  function deleteSelected(target) {
    const id = target.getAttribute('data-task-id') ||
              target.getAttribute('data-id') ||
              target.closest('[data-task-id]')?.getAttribute('data-task-id');
    if (!id) return false;
    if (!window.confirm('Delete this task?')) return true;
    const store = readTasks();
    const next = store.tasks.filter(t => String(t.id ?? t._id) !== String(id));
    writeTasks(next, store.key);
    callFirst(['renderTasks','render','renderAll','refreshTasks','loadTasks']);
    notify('Task deleted');
    return true;
  }

  function bind() {
    // Initial theme.
    const saved = localStorage.getItem('petaldesk_theme') ||
                  localStorage.getItem('taskflow_theme') ||
                  document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(saved);

    document.addEventListener('click', function (event) {
      const target = event.target.closest('button,a,[role="button"],[data-action]');
      if (!target) return;

      // Theme controls.
      if (target.matches('#themeToggleBtn,#darkModeToggle,[data-theme-toggle]')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleTheme();
        return;
      }
      if (target.matches('#lightModeBtn,#settingsLightBtn,[data-theme="light"]')) {
        event.preventDefault();
        setTheme('light');
        notify('Light mode enabled');
        return;
      }
      if (target.matches('#darkModeBtn,#settingsDarkBtn,[data-theme="dark"]')) {
        event.preventDefault();
        setTheme('dark');
        notify('Dark mode enabled');
        return;
      }

      // Open/add/create.
      if (target.matches('#addTaskBtn,#newTaskBtn,#createTaskBtn,#quickCreateTaskBtn,#openAddTaskModalBtn,.add-task-btn,[data-action="add-task"],[data-action="create-task"],[data-action="new-task"]')) {
        event.preventDefault();
        if (!openModalByTarget(target)) {
          callFirst(['openTaskModal','showTaskModal','openAddTaskModal','createTask','addTask']);
        }
        return;
      }

      // Explicit modal target buttons.
      if (target.hasAttribute('data-target') || target.hasAttribute('data-modal-target') || target.hasAttribute('data-open')) {
        if (openModalByTarget(target)) {
          event.preventDefault();
          return;
        }
      }

      // Close controls.
      if (target.matches('.close-btn,#closeModal,#cancelTask,.modal-close,[data-action="close-modal"]')) {
        event.preventDefault();
        closeOverlays();
        return;
      }

      // Export.
      if (target.matches('#exportBtn,#exportTasksBtn,.export-btn,[data-action="export"],[data-export="tasks"]')) {
        event.preventDefault();
        exportTasks();
        return;
      }

      // Clear all.
      if (target.matches('#clearAllBtn,#clearDataBtn,#clearAllDataBtn,.clear-data-btn,[data-action="clear-all"],[data-action="clear-data"]')) {
        event.preventDefault();
        clearAll();
        return;
      }

      // Delete task.
      if (target.matches('[data-action="delete"],.delete-task-btn,.task-delete,#deleteTaskBtn')) {
        if (deleteSelected(target)) event.preventDefault();
        return;
      }

      // Complete / pending.
      if (target.matches('[data-action="complete"],[data-action="toggle-status"],.complete-task-btn,.task-complete')) {
        const id = target.getAttribute('data-task-id') || target.getAttribute('data-id');
        if (id) {
          const store = readTasks();
          const next = store.tasks.map(t => {
            if (String(t.id ?? t._id) !== String(id)) return t;
            return {...t, completed: !Boolean(t.completed), status: t.completed ? 'pending' : 'completed'};
          });
          writeTasks(next, store.key);
          callFirst(['renderTasks','render','renderAll','refreshTasks','loadTasks']);
        }
        return;
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, {once:true});
  } else {
    bind();
  }

  window.PetalDeskRepair = {
    setTheme, toggleTheme, exportTasks, clearAll
  };
})();
