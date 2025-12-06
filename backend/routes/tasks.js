const express = require('express');
const router = express.Router();
const pool = require('../db');

const useDemoData = process.env.USE_DEMO_DATA === 'true';

// Demo tasks in memory
let demoTasks = [
  {
    id: 1,
    project_id: 1,
    title: 'Draft IVR call flows',
    description: 'Create initial call flow diagrams for pilot.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    due_date: '2025-01-15',
  },
  {
    id: 2,
    project_id: 1,
    title: 'Review Spanish prompts',
    description: 'Validate Spanish language prompts with SMEs.',
    status: 'TODO',
    priority: 'MEDIUM',
    due_date: '2025-01-20',
  },
  {
    id: 3,
    project_id: 2,
    title: 'Identify self-service use cases',
    description: 'List top 5 MyDSS self-service scenarios.',
    status: 'TODO',
    priority: 'LOW',
    due_date: '2025-02-10',
  },
];

// GET /api/tasks/project/:projectId
router.get('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  if (useDemoData) {
    const tasksForProject = demoTasks.filter(
      (t) => t.project_id === Number(projectId)
    );
    return res.json(tasksForProject);
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks/project/:projectId
router.post('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { title, description, priority, status, due_date } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  if (useDemoData) {
    const newTask = {
      id: demoTasks.length + 1,
      project_id: Number(projectId),
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      due_date: due_date || null,
    };
    demoTasks.unshift(newTask);
    return res.status(201).json(newTask);
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (project_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [
        projectId,
        title,
        description,
        status || 'TODO',
        priority || 'MEDIUM',
        due_date || null,
      ]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id (update status etc.)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (useDemoData) {
    const idx = demoTasks.findIndex((t) => t.id === Number(id));
    if (idx === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    demoTasks[idx] = { ...demoTasks[idx], status: status || demoTasks[idx].status };
    return res.json(demoTasks[idx]);
  }

  try {
    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (useDemoData) {
    const before = demoTasks.length;
    demoTasks = demoTasks.filter((t) => t.id !== Number(id));
    if (demoTasks.length === before) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ message: 'Task deleted' });
  }

  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
