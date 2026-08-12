# TaskFlow UI and Function Repair

- Removed the unreliable keyboard shortcut system and its UI references.
- Removed the previous baby-pink enhancement layer.
- Repaired light/dark mode by keeping one authoritative theme implementation.
- Added `color-scheme` support and persistent theme selection.
- Fixed the double-toggle issue caused by multiple theme click handlers.
- Added a real Export Tasks action that downloads the current LocalStorage task data as JSON.
- Kept Create/Edit/Delete/Complete/Pending/Search/Filter/Sort/Grid/List/Profile/Settings/Clear All Data behavior intact.
- Improved responsive layout for desktop, tablet and narrow mobile screens.
- Added a neutral indigo/violet visual system with a deep-navy dark theme; it is an original styling layer, not a copied reference UI.


### Latest repair — task rendering and saving
- Restored the missing `filterTasks()` function. Its absence caused `renderTasks()` to throw a JavaScript error, so tasks were not displayed and newly saved tasks appeared not to save.
- Restored the intended first-launch seed-task behavior.
- Added a proper Ctrl/Cmd+N handler with `preventDefault()` so the browser does not open a new window.
- Kept existing task CRUD, filters, sorting, LocalStorage, theme, profile, and settings behavior intact.
