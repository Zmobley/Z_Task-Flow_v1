const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tasks/project/:projectId - tasks for a project
router.get('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks/project/:projectId - create a task
router.post('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO tasks (project_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        title,
        description || null,
        status || 'TODO',
        priority || 'MEDIUM',
        due_date || null
      ]
    );

    const newTask = {
      id: result.insertId,
      project_id: Number(projectId),
      title,
      description: description || null,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      due_date: due_date || null
    };

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - update task (partial-safe)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  try {
    // Get current task so we can safely merge updates
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const existing = rows[0];

    const updatedTitle = title ?? existing.title;
    const updatedDescription = description ?? existing.description;
    const updatedStatus = status ?? existing.status;
    const updatedPriority = priority ?? existing.priority;
    const updatedDueDate = typeof due_date !== 'undefined' ? due_date : existing.due_date;

    await db.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
       WHERE id = ?`,
      [
        updatedTitle,
        updatedDescription,
        updatedStatus,
        updatedPriority,
        updatedDueDate,
        id
      ]
    );

    res.json({ message: 'Task updated' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - delete task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
