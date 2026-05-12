# To-Do List Application with Local Storage

A modern, feature-rich to-do list application built with HTML5, CSS3, and vanilla JavaScript. All tasks are automatically saved to your browser's local storage!

## ✨ Features

### Core Functionality
- ✅ **Create, Read, Update, Delete** tasks (CRUD operations)
- ✅ **Local Storage** - Tasks persist between sessions
- ✅ **Mark as Complete** - Check off finished tasks
- ✅ **Edit Tasks** - Modify task text directly
- ✅ **Delete Tasks** - Remove unwanted tasks
- ✅ **Task Priority** - Low, Medium, High priority levels
- ✅ **Categories** - Organize tasks by category
- ✅ **Due Dates** - Set deadlines for tasks
- ✅ **Search** - Find tasks by text
- ✅ **Filter** - By priority, status, or category
- ✅ **Sort** - By date, priority, alphabetical, or due date
- ✅ **Progress Tracking** - See completion percentage

### Advanced Features
- ✅ **Export Tasks** - Download as JSON backup
- ✅ **Import Tasks** - Restore from JSON file
- ✅ **Multiple Views** - All, Active, Completed, Today
- ✅ **Task Statistics** - Total, active, completed, progress
- ✅ **Overdue Indicators** - Visual warning for missed deadlines
- ✅ **Keyboard Shortcuts** - Quick actions
- ✅ **Dark Mode Ready** - Extensible design
- ✅ **Responsive Design** - Works on all devices

### User Experience
- 🎨 Beautiful gradient UI with purple theme
- ⚡ Fast and smooth animations
- 📱 Mobile-friendly interface
- ♿ Accessible design
- 🎯 Intuitive navigation
- 💾 Auto-save functionality

## 🚀 Getting Started

### Installation
1. Download all files:
   - `index.html`
   - `styles.css`
   - `app.js`

2. Open `index.html` in your browser

3. Start adding tasks!

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Any modern browser with localStorage support

## 📋 How to Use

### Adding Tasks
1. Enter task text in the input field
2. (Optional) Select category, priority, and due date
3. Press **Enter** or click **Add** button
4. Task appears at the top of your list

### Managing Tasks
- **Complete**: Click the checkbox to mark task as done
- **Edit**: Click the ✏️ button and update text
- **Delete**: Click the 🗑️ button to remove
- **Sell**: Hover over task for more options

### Filtering & Searching
- **Search**: Type in search box to find tasks
- **Filter by Priority**: Select priority level
- **Sort**: Choose sort order (date, priority, alphabetical, due date)
- **View Types**: 
  - All Tasks - Show everything
  - Active - Only incomplete tasks
  - Completed - Only finished tasks
  - Today - Tasks due today

### Organizing with Categories
Click any category in the sidebar to filter:
- 💼 Work
- 👤 Personal
- 🛒 Shopping
- 🏥 Health
- 📌 Other

### Bulk Actions
- **Clear Completed** - Remove all finished tasks
- **Export Tasks** - Download as JSON file
- **Import Tasks** - Restore from backup file

## 🗂️ Categories

| Category | Icon | Color | Use For |
|----------|------|-------|---------|
| Work | 💼 | Blue-Purple | Work-related tasks |
| Personal | 👤 | Purple | Personal matters |
| Shopping | 🛒 | Pink | Shopping lists |
| Health | 🏥 | Cyan | Health & fitness |
| Other | 📌 | Green | Miscellaneous |

## ⭐ Priority Levels

| Level | Color | Use For |
|-------|-------|---------|
| High | Red | Urgent/Important |
| Medium | Purple | Regular tasks |
| Low | Blue | Can wait |

## 💾 Local Storage

### How It Works
- All tasks are automatically saved to browser's localStorage
- Data persists when you close the browser
- Each browser/device has separate storage
- Limited to ~5-10MB per domain

### Manual Backup
1. Click **Export Tasks**
2. A JSON file downloads to your computer
3. Share or store safely

### Restoring Backup
1. Click **Import Tasks**
2. Select your JSON backup file
3. Tasks are added to your list

### Storage Statistics
- Check browser DevTools > Application > Local Storage
- Storage Key: `todoAppData`
- Max storage: ~5-10MB (depends on browser)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Enter** | Add task (when focused on input) |
| **Ctrl+N** or **⌘+N** | Focus on input |
| **Ctrl+E** or **⌘+E** | Export tasks |

## 🎨 UI Components

### Header
- App title and subtitle
- Clean, modern gradient background

### Sidebar
- Navigation views (All, Active, Completed, Today)
- Category shortcuts with task counts
- Bulk action buttons
- Real-time counters

### Main Content Area
- Task input with advanced options
- Statistics dashboard
- Search and filter controls
- Task list with full CRUD operations

### Task Items
- Checkbox for completion
- Task text with optional editing
- Priority and category badges
- Due date indicator
- Quick action buttons

## 📊 Statistics Panel

Real-time metrics:
- **Total Tasks** - All tasks in system
- **Active** - Incomplete tasks
- **Completed** - Finished tasks
- **Progress** - Completion percentage (0-100%)

## 🔍 Search & Filter

### Search Box
- Find tasks by text
- Case-insensitive
- Real-time results

### Sort Options
- **Newest First** - Recently added
- **Oldest First** - Oldest first
- **Priority** - High → Low
- **A-Z** - Alphabetical
- **Due Date** - Soonest first

### Priority Filter
- All Priorities (default)
- High Priority only
- Medium Priority only
- Low Priority only

## 🎯 Advanced Options

Click **More Options** to reveal:
- Category selector
- Priority selector
- Due date picker

These options apply to the next task you create.

## 📱 Responsive Breakpoints

| Size | Layout |
|------|--------|
| Desktop (1024px+) | Sidebar + Main content (side-by-side) |
| Tablet (768px-1024px) | Stacked layout |
| Mobile (480px-768px) | Full-width stacked |
| Small Mobile (<480px) | Compact mobile layout |

## 🛠️ Code Structure

```
app.js
├── State & Configuration
├── Local Storage Functions
├── Task Management Class
├── Filtering & Sorting
├── Rendering Functions
├── Utility Functions
├── Event Listeners
├── Initialization
├── Auto-save on Unload
└── Keyboard Shortcuts
```

### Key Functions
- `addTask()` - Create new task
- `deleteTask(id)` - Remove task
- `toggleTask(id)` - Mark complete/incomplete
- `editTask(id, text)` - Update task text
- `getFilteredTasks()` - Filter and sort
- `renderTasks()` - Display tasks
- `saveTasks()` - Save to localStorage
- `loadTasks()` - Load from localStorage
- `exportTasks()` - Backup to JSON
- `importTasks(file)` - Restore from JSON

## 💡 Tips & Tricks

1. **Quick Add**: Press Enter to quickly add tasks
2. **Bulk Clear**: Remove all completed tasks at once
3. **Backup Regularly**: Export important task lists
4. **Use Categories**: Keep work and personal separate
5. **Set Priorities**: High priority tasks show first
6. **Set Due Dates**: Get visual reminders
7. **Search**: Use search for quick task lookup
8. **Sort By Priority**: See important tasks first

## ⚙️ Customization

### Modify Categories
Edit `CATEGORIES` object in `app.js`:
```javascript
const CATEGORIES = {
    yourCategory: { 
        name: 'Display Name', 
        color: '#hexcolor', 
        icon: '🎨' 
    }
};
```

### Change Colors
Modify CSS variables in `styles.css`:
```css
/* Change the purple gradient to your preference */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Storage Key
Change `STORAGE_KEY` in `app.js` for multiple apps:
```javascript
const STORAGE_KEY = 'myCustomKey';
```

## 🐛 Troubleshooting

### Tasks Not Saving?
- Check browser localStorage is enabled
- Not in private/incognito mode
- Storage quota not exceeded
- Browser console for errors

### Import Not Working?
- Use file exported from this app
- Check JSON file is valid
- Browser console shows error details
- Try a different JSON file

### Tasks Disappearing?
- Check if in incognito mode (localStorage disabled)
- Browser cache clearing
- Storage quota exceeded
- Different browser/device

## 📊 Storage Limits

| Browser | Limit | Notes |
|---------|-------|-------|
| Chrome | 10MB | Per domain |
| Firefox | 10MB | Per domain |
| Safari | 5MB | Per domain |
| Edge | 10MB | Per domain |
| IE 11 | 10MB | Per domain |

Most users won't hit these limits. ~1,000 average tasks = ~200KB

## 🚀 Future Enhancements

Possible additions:
- Recurring tasks
- Task notes/descriptions
- Subtasks
- Time tracking
- Dark mode toggle
- Cloud sync
- Task templates
- Notifications
- Voice input
- Mobile app

## 📝 License

Free to use, modify, and distribute for personal use.

## 🤝 Contributing

Feel free to fork and improve! Suggestions:
1. Better UI design
2. Mobile optimization
3. Additional features
4. Performance improvements
5. Accessibility enhancements

---

**Happy organizing! 📝✨**
