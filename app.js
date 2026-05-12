// ============================================================================
// TO-DO LIST APPLICATION - COMPLETE IMPLEMENTATION
// HTML5 + CSS3 + Vanilla JavaScript with Local Storage
// ============================================================================

// ============================================================================
// SECTION 1: STATE & CONFIGURATION
// ============================================================================

const STORAGE_KEY = 'todoAppData';

const CATEGORIES = {
    work: { name: 'Work', color: '#667eea', icon: '💼' },
    personal: { name: 'Personal', color: '#764ba2', icon: '👤' },
    shopping: { name: 'Shopping', color: '#f093fb', icon: '🛒' },
    health: { name: 'Health', color: '#4facfe', icon: '🏥' },
    other: { name: 'Other', color: '#48bb78', icon: '📌' }
};

const PRIORITY_COLORS = {
    high: '#f56565',
    medium: '#667eea',
    low: '#48bb78'
};

let tasks = [];
let currentView = 'all';
let currentCategory = null;
let currentSearch = '';
let currentSort = 'date-desc';
let currentPriorityFilter = '';

// ============================================================================
// SECTION 2: LOCAL STORAGE FUNCTIONS
// ============================================================================

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('Storage quota exceeded. Tasks may not be saved.');
            alert('Storage limit exceeded. Please export and clear old tasks.');
        }
    }
}

/**
 * Load tasks from localStorage
 */
function loadTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        tasks = data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error loading tasks:', e);
        tasks = [];
    }
}

/**
 * Clear all tasks from storage
 */
function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
    tasks = [];
}

// ============================================================================
// SECTION 3: TASK MANAGEMENT
// ============================================================================

/**
 * Add a new task
 */
function addTask() {
    const inputElement = document.getElementById('taskInput');
    const text = inputElement.value.trim();

    if (!text) {
        alert('Please enter a task');
        return;
    }

    const category = document.getElementById('categorySelect').value;
    const priority = document.getElementById('prioritySelect').value;
    const dueDate = document.getElementById('dueDateInput').value;

    const task = {
        id: Date.now() + Math.random(),
        text: text,
        category: category,
        priority: priority,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
    updateCategoryCounts();

    // Clear input
    inputElement.value = '';
    inputElement.focus();
}

/**
 * Toggle task completion status
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        updateStats();
        updateCategoryCounts();
    }
}

/**
 * Delete a task
 */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    updateCategoryCounts();
}

/**
 * Edit task text
 */
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit task:', task.text);
    if (newText !== null && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

/**
 * Delete all completed tasks
 */
function clearCompletedTasks() {
    if (!confirm('Delete all completed tasks?')) return;

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
    updateCategoryCounts();
}

// ============================================================================
// SECTION 4: FILTERING & SORTING
// ============================================================================

/**
 * Get filtered and sorted tasks
 */
function getFilteredTasks() {
    let filtered = tasks;

    // Filter by view
    switch (currentView) {
        case 'active':
            filtered = filtered.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = filtered.filter(t => t.completed);
            break;
        case 'today':
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.dueDate === today || (!t.completed && !t.dueDate));
            break;
    }

    // Filter by category
    if (currentCategory) {
        filtered = filtered.filter(t => t.category === currentCategory);
    }

    // Filter by search
    if (currentSearch) {
        filtered = filtered.filter(t =>
            t.text.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    // Filter by priority
    if (currentPriorityFilter) {
        filtered = filtered.filter(t => t.priority === currentPriorityFilter);
    }

    // Sort
    switch (currentSort) {
        case 'date-asc':
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'alphabetical':
            filtered.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case 'due-date':
            filtered.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;
        case 'date-desc':
        default:
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    return filtered;
}

/**
 * Check if task is overdue
 */
function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
}

// ============================================================================
// SECTION 5: RENDERING FUNCTIONS
// ============================================================================

/**
 * Render all tasks
 */
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="task-badge priority-${task.priority}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span class="task-badge" style="background: rgba(102, 126, 234, 0.1); color: #667eea;">
                        ${CATEGORIES[task.category].icon} ${CATEGORIES[task.category].name}
                    </span>
                    ${task.dueDate ? `
                        <span class="task-badge ${isOverdue(task) ? 'priority-high' : ''}" 
                              style="${isOverdue(task) ? 'background: rgba(245, 101, 101, 0.1); color: #f56565;' : ''}">
                            📅 ${new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    ` : ''}
                </div>
            </div>

            <div class="task-actions">
                <button class="task-btn" onclick="editTask(${task.id})" title="Edit">✏️</button>
                <button class="task-btn delete" onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

/**
 * Update statistics
 */
function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statCompleted').textContent = completed;
    document.getElementById('statProgress').textContent = progress + '%';

    // Update counters in sidebar
    document.getElementById('countAll').textContent = total;
    document.getElementById('countActive').textContent = active;
    document.getElementById('countCompleted').textContent = completed;

    const today = new Date().toISOString().split('T')[0];
    const todayCount = tasks.filter(t => t.dueDate === today && !t.completed).length;
    document.getElementById('countToday').textContent = todayCount;
}

/**
 * Update category counts
 */
function updateCategoryCounts() {
    for (const [key, category] of Object.entries(CATEGORIES)) {
        const count = tasks.filter(t => t.category === key && !t.completed).length;
        const btn = document.querySelector(`.category-btn[data-category="${key}"]`);
        if (btn) {
            btn.innerHTML = `${category.icon} ${category.name} <span style="margin-left: auto;">${count}</span>`;
        }
    }
}

/**
 * Render categories in sidebar
 */
function renderCategories() {
    const list = document.getElementById('categoriesList');
    list.innerHTML = Object.entries(CATEGORIES).map(([key, category]) => `
        <button class="category-btn" data-category="${key}" onclick="switchCategory('${key}')">
            ${category.icon} ${category.name} <span style="margin-left: auto;">0</span>
        </button>
    `).join('');
    updateCategoryCounts();
}

// ============================================================================
// SECTION 6: UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Switch to a view
 */
function switchView(view) {
    currentView = view;
    currentCategory = null;
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-view="${view}"]`).classList.add('active');
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    renderTasks();
}

/**
 * Switch to a category
 */
function switchCategory(category) {
    currentView = null;
    currentCategory = category;
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
    renderTasks();
}

// ============================================================================
// SECTION 7: EXPORT & IMPORT
// ============================================================================

/**
 * Export tasks to JSON file
 */
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Import tasks from JSON file
 */
function importTasks(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) {
                alert('Invalid file format. Expected an array of tasks.');
                return;
            }
            tasks = [...tasks, ...imported];
            saveTasks();
            renderTasks();
            updateStats();
            updateCategoryCounts();
            alert(`Imported ${imported.length} tasks!`);
        } catch (error) {
            alert('Error importing tasks: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// ============================================================================
// SECTION 8: EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from storage
    loadTasks();

    // Render initial state
    renderCategories();
    renderTasks();
    updateStats();

    // Add task
    document.getElementById('addBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderTasks();
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTasks();
    });

    // Priority filter
    document.getElementById('filterPriority').addEventListener('change', (e) => {
        currentPriorityFilter = e.target.value;
        renderTasks();
    });

    // Clear completed
    document.getElementById('clearCompleted').addEventListener('click', clearCompletedTasks);

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportTasks);

    // Import
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importTasks(e.target.files[0]);
            e.target.value = '';
        }
    });

    // Toggle advanced options
    document.getElementById('toggleOptionsBtn').addEventListener('click', () => {
        const options = document.querySelector('.advanced-options');
        options.style.display = options.style.display === 'none' ? 'flex' : 'none';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'n') {
                e.preventDefault();
                document.getElementById('taskInput').focus();
            } else if (e.key === 'e') {
                e.preventDefault();
                exportTasks();
            }
        }
    });

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDateInput').min = today;
});

// ============================================================================
// SECTION 9: AUTO-SAVE ON PAGE UNLOAD
// ============================================================================

window.addEventListener('beforeunload', () => {
    saveTasks();
});

// ============================================================================
// SECTION 10: HANDLE STORAGE CHANGES (Multi-tab sync)
// ============================================================================

window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        loadTasks();
        renderTasks();
        updateStats();
    }
});
