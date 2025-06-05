class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTodos();
    }

    initializeElements() {
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        this.filterButtons = document.querySelectorAll('.filter-btn');
    }

    attachEventListeners() {
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Failed to load todos:', error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const text = this.todoInput.value.trim();
        
        if (!text) return;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const newTodo = await response.json();
                this.todos.push(newTodo);
                this.todoInput.value = '';
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    }

    async deleteTodo(id) {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.todos = this.todos.filter(todo => todo.id !== id);
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !todo.completed }),
            });

            if (response.ok) {
                todo.completed = !todo.completed;
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    }

    async updateTodoText(id, newText) {
        if (!newText.trim()) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newText }),
            });

            if (response.ok) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.text = newText;
                    this.renderTodos();
                }
            }
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    }

    startEdit(id) {
        this.editingId = id;
        this.renderTodos();
        
        const editInput = document.querySelector(`[data-id="${id}"] .edit-input`);
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }

    finishEdit(id, newText) {
        this.editingId = null;
        if (newText && newText.trim()) {
            this.updateTodoText(id, newText.trim());
        } else {
            this.renderTodos();
        }
    }

    handleFilter(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTodos();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = filteredTodos.map(todo => {
            const isEditing = this.editingId === todo.id;
            
            return `
                <li class="todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}" data-id="${todo.id}">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <input type="text" class="edit-input" value="${this.escapeHtml(todo.text)}">
                    <div class="todo-actions">
                        <button class="edit-btn">${isEditing ? '保存' : '編集'}</button>
                        <button class="delete-btn">削除</button>
                    </div>
                </li>
            `;
        }).join('');

        this.attachTodoEventListeners();
    }

    attachTodoEventListeners() {
        this.todoList.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const id = e.target.closest('.todo-item').dataset.id;
                this.toggleTodo(id);
            }
        });

        this.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            const id = todoItem?.dataset.id;

            if (e.target.classList.contains('delete-btn')) {
                this.deleteTodo(id);
            } else if (e.target.classList.contains('edit-btn')) {
                if (this.editingId === id) {
                    const editInput = todoItem.querySelector('.edit-input');
                    this.finishEdit(id, editInput.value);
                } else {
                    this.startEdit(id);
                }
            }
        });

        this.todoList.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
                const id = e.target.closest('.todo-item').dataset.id;
                this.finishEdit(id, e.target.value);
            }
        });
    }

    updateStats() {
        const activeCount = this.todos.filter(todo => !todo.completed).length;
        this.todoCount.textContent = activeCount;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});