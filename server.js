const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(express.json());
app.use(express.static('public'));

// Initialize todos file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper function to read todos
function readTodos() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write todos
function writeTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get('/api/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

// Add new todo
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Todo text is required' });
    }

    const todos = readTodos();
    const newTodo = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    if (text !== undefined) todos[todoIndex].text = text;
    if (completed !== undefined) todos[todoIndex].completed = completed;

    writeTodos(todos);
    res.json(todos[todoIndex]);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const todos = readTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);

    if (todos.length === filteredTodos.length) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    writeTodos(filteredTodos);
    res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Todo List server running on http://0.0.0.0:${PORT}`);
});