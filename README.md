# 🌸 Bloomly --- Personal Task Workspace

> **A clean, responsive, browser-based task management workspace built
> with HTML5, CSS3 and Vanilla JavaScript.**

Bloomly is a personal task-management application that lets users
create, organize, search, filter, sort, complete, edit and delete tasks
from a single workspace.

The uploaded project contains the **Bloomly** application with its HTML,
CSS and JavaScript implementation.

------------------------------------------------------------------------

## ✨ Project Overview

  Area                 Details
  -------------------- --------------------------------------------------
  🌸 Application       Bloomly --- Personal Task Workspace
  🖥️ Frontend          HTML5, CSS3, Vanilla JavaScript (ES6)
  💾 Storage           Browser LocalStorage
  🎨 Theme             Light / Dark
  📱 Layout            Responsive design
  🔎 Search            Task title, description, category and priority
  🗂️ Categories        Work, Study, Personal, Project, Other
  🚦 Priorities        High, Medium, Low
  📤 Export            JSON task export
  🧹 Data Management   Clear all saved data
  📦 Dependencies      No build system or package installation required

------------------------------------------------------------------------

## 🚀 Main Features

### ✅ Task Management

Bloomly supports the complete basic task workflow:

-   ➕ Create new tasks
-   ✏️ Edit existing tasks
-   🗑️ Delete tasks
-   ☑️ Mark tasks as completed
-   🔄 Return completed tasks to pending status
-   📌 Select individual tasks
-   📅 Set a task due date
-   ⏰ Set an optional task time
-   📝 Add a task description
-   🚦 Assign task priority
-   🗂️ Assign a task category

### 🔎 Search & Filtering

Tasks can be narrowed down using several controls:

-   🔍 Search by:
    -   Task title
    -   Description
    -   Category
    -   Priority
-   📋 View all tasks
-   ⏳ View pending tasks
-   ✅ View completed tasks
-   🔥 View high-priority pending tasks
-   🗂️ Filter by category
-   🚦 Filter by priority

### ↕️ Sorting

The application provides multiple sorting options:

-   📅 Due Date --- Earliest
-   📅 Due Date --- Latest
-   🔥 Priority --- High to Low
-   🕒 Date Created
-   🔤 Title --- A to Z

------------------------------------------------------------------------

## 🗂️ Task Categories

Tasks can be organized into five categories:

-   💼 **Work**
-   📚 **Study**
-   👤 **Personal**
-   🚀 **Project**
-   📌 **Other**

------------------------------------------------------------------------

## 🚦 Task Priority

Each task can have one of three priority levels:

-   🔴 **High**
-   🟡 **Medium**
-   🟢 **Low**

If an invalid or missing priority is encountered in stored data, the
application normalizes it to **Medium**.

------------------------------------------------------------------------

## 📊 Dashboard & Statistics

The main workspace provides task statistics including:

-   📋 All Tasks
-   ⏳ Pending
-   ✅ Completed
-   🔥 High Priority

These counts are updated when tasks are added, edited, completed,
deleted or filtered.

------------------------------------------------------------------------

## 👤 Profile

Bloomly includes a simple profile area where the user can save:

-   👤 Name
-   🆔 Username
-   📧 Email

The profile information is stored locally in the browser and displayed
in the workspace profile preview.

------------------------------------------------------------------------

## ⚙️ Settings

The Settings area includes:

### 🎨 Appearance

Users can switch between:

-   ☀️ Light mode
-   🌙 Dark mode

The selected theme is saved in LocalStorage so it can persist when the
application is reopened.

### 📦 Data Management

The application provides:

-   📤 **Export Tasks**
-   🧹 **Clear All Data**

------------------------------------------------------------------------

## 📤 Export Tasks

The **Export Tasks** feature creates a JSON file containing the saved
tasks.

The exported data includes:

-   Export timestamp
-   Application information
-   Version information
-   Complete task data

The downloaded file follows this naming pattern:

``` text
taskflow-tasks-YYYY-MM-DD.json
```

> 💡 The application's export implementation currently identifies the
> exported application as **TaskFlow**, while the visible application
> title is **Bloomly**.

------------------------------------------------------------------------

## 💾 Data Storage

Bloomly is a frontend-only application and uses **browser LocalStorage**
for persistence.

### LocalStorage is used for:

-   📝 Tasks
-   👤 Profile information
-   🎨 Theme preference

The application also contains compatibility logic for reading task data
from several previous storage keys and normalizing older task structures
into the current format.

Supported legacy task-storage keys include:

``` text
taskflow_tasks
petaldesk_tasks
todoTasks
skilliant_todos
tasks
```

This helps preserve task data from earlier versions/builds when
compatible data is available.

------------------------------------------------------------------------

## 🧩 Task Data Structure

A normalized task contains the following information:

``` text
id
title
description
date
time
priority
category
completed
createdAt
```

### Example

``` json
{
  "id": "task_123456789",
  "title": "Complete project documentation",
  "description": "Prepare the final project documentation.",
  "date": "2026-08-16",
  "time": "18:00",
  "priority": "high",
  "category": "project",
  "completed": false,
  "createdAt": "2026-08-16T10:00:00.000Z"
}
```

------------------------------------------------------------------------

## 🛡️ Form Validation

When creating or editing a task, the application validates the important
required fields.

### Required

-   📝 Task title
-   📅 Due date
-   🗂️ Task category

### Optional

-   📄 Description
-   ⏰ Time

Task priority defaults to **Medium** when no valid priority is
available.

------------------------------------------------------------------------

## 📱 Responsive Design

The CSS contains responsive media-query rules for different screen
sizes.

The interface is designed to adapt across:

-   📱 Mobile devices
-   📲 Tablet-sized layouts
-   💻 Desktop screens

Responsive behavior covers the workspace layout, navigation, task cards,
forms, modals and other interface elements.

------------------------------------------------------------------------

## 🎨 UI / UX

The project uses a modern personal-workspace design with:

-   🧊 Card-based task presentation
-   📐 Structured spacing
-   🔘 Clear action buttons
-   🏷️ Category and priority indicators
-   🪟 Modal forms
-   ✨ Interactive states
-   🌙 Dark-mode support
-   📱 Responsive layouts

The project imports **Inter** and **Outfit** fonts through Google Fonts.

------------------------------------------------------------------------

## 🛠️ Technologies Used

### HTML5

Used for:

-   Semantic page structure
-   Forms
-   Navigation
-   Task workspace
-   Modals
-   Profile and settings interfaces

### CSS3

Used for:

-   Layout
-   Responsive design
-   Theme styling
-   Task cards
-   Forms
-   Modals
-   Interactive states

### JavaScript ES6

Used for:

-   Task CRUD operations
-   Search
-   Filtering
-   Sorting
-   Validation
-   Statistics
-   Profile management
-   Theme management
-   LocalStorage persistence
-   JSON export
-   UI interactions

------------------------------------------------------------------------

## 📂 Project Structure

``` text
to-do-list-main/
└── Bloomly/
    │
    ├── index.html
    │
    ├── css/
    │   └── style.css
    │
    └── js/
        └── script.js
```

### 📄 `index.html`

Contains the application structure, including:

-   Sidebar navigation
-   Task views
-   Categories
-   Quick actions
-   Task list
-   Task creation/edit modal
-   Profile modal
-   Settings modal

### 🎨 `css/style.css`

Contains:

-   Main application styling
-   Responsive layouts
-   Light/dark themes
-   Task-card styling
-   Forms
-   Modals
-   Navigation
-   Interactive UI states

### ⚙️ `js/script.js`

Contains the main application logic, including:

-   Initialization
-   Theme management
-   Task loading/saving
-   Task creation
-   Task editing
-   Task deletion
-   Completion handling
-   Search and filters
-   Sorting
-   Statistics
-   Profile management
-   Settings
-   Data export
-   Data clearing
-   Toast notifications

------------------------------------------------------------------------

## ▶️ How to Run

### 🟢 Option 1 --- Open Directly

1.  Extract the ZIP file.
2.  Open the following file:

``` text
to-do-list-main/Bloomly/index.html
```

3.  Open it in a modern web browser.

No installation is required for the basic application.

### 🔵 Option 2 --- Run a Local Server

From inside the `Bloomly` folder, run:

``` bash
python -m http.server 8000
```

Then open:

``` text
http://localhost:8000/
```

> 💡 A local server is recommended when developing or testing the
> project.

------------------------------------------------------------------------

## 🧪 Functional Areas

The project includes functionality for:

-   ✅ Task creation
-   ✅ Task editing
-   ✅ Task deletion
-   ✅ Task completion
-   ✅ Task search
-   ✅ Category filtering
-   ✅ Priority filtering
-   ✅ Status filtering
-   ✅ Task sorting
-   ✅ Empty-state handling
-   ✅ Task validation
-   ✅ Profile editing
-   ✅ Theme switching
-   ✅ Task export
-   ✅ Clear-all-data workflow
-   ✅ LocalStorage persistence
-   ✅ Responsive UI

------------------------------------------------------------------------

## 🧹 Clear All Data

The **Clear All Data** option removes saved:

-   📝 Tasks
-   👤 Profile data
-   🎨 Theme preference

The action requires browser confirmation before the stored data is
removed.

> ⚠️ Clearing data is destructive for the current browser storage.
> Export your tasks first if you need a backup.

------------------------------------------------------------------------

## 🔐 Privacy & Storage

This implementation stores application data in the user's browser
through LocalStorage.

There is no server-side database or backend API in the uploaded project.

Therefore:

-   🔒 Data is stored locally in the browser.
-   🌐 No application backend is included.
-   💾 Clearing browser storage can remove saved application data.
-   📤 JSON export can be used as a manual task backup.

------------------------------------------------------------------------

## 📌 Current Scope

The uploaded project is focused on a **client-side personal task
workspace**.

The source does not include:

-   ❌ Backend API
-   ❌ Server-side database
-   ❌ User authentication service
-   ❌ Cloud synchronization
-   ❌ Multi-user collaboration
-   ❌ npm/package configuration
-   ❌ Build configuration

These should not be assumed to be part of the current implementation.

------------------------------------------------------------------------

## 🌟 Project Benefits

Bloomly provides a lightweight task-management experience without
requiring a backend or installation process.

### Key benefits

-   ⚡ Simple to run
-   💾 Persistent browser storage
-   🔎 Fast task search
-   🗂️ Organized categories
-   🚦 Priority management
-   📅 Due-date tracking
-   🌙 Light/dark themes
-   📤 JSON backup/export
-   📱 Responsive interface
-   🧩 Easy-to-understand frontend structure

------------------------------------------------------------------------

## 📦 Deliverable

The uploaded ZIP contains the complete Bloomly frontend source:

``` text
Bloomly/
├── index.html
├── css/style.css
└── js/script.js
```

The project can be opened locally and used directly in a modern browser.

------------------------------------------------------------------------

## ⭐ Final Note

**Bloomly** is a responsive personal task workspace built around a
simple client-side architecture.

Its core workflow is:

**Create → Organize → Search → Filter → Sort → Complete → Export** ✨

The project keeps task data in browser storage and provides the
essential tools required to manage personal tasks through a clean,
responsive interface.
