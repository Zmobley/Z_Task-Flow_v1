const express = require('express');
const router = express.Router();
const pool = require('../db');

// For cloud demo: always use in-memory demo data
const useDemoData = true;


// Some demo projects for cloud mode
const demoProjects = [
  {
    id: 1,
    name: 'IVR Modernization Pilot',
    description: 'Demo IVR modernization project for TaskFlow.',
    status: 'ACTIVE',
    created_at: '2025-01-01',
  },
  {
    id: 2,
    name: 'MyDSS Self-Service Enhancements',
    description: 'Demo project for portal self-service improvements.',
    status: 'PLANNED',
    created_at: '2025-02-01',
  },
];

// GET /api/projects
router.get('/', async (req, res) => {
  // If demo mode, return in-memory projects
  if (useDemoData) {
    return res.json(demoProjects);
  }

  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required.' });
  }

  // Demo mode: push into in-memory array
  if (useDemoData) {
    const newProject = {
      id: demoProjects.length + 1,
      name,
      description,
      status: 'ACTIVE',
      created_at: new Date().toISOString().slice(0, 10),
    };
    demoProjects.unshift(newProject);
    return res.status(201).json(newProject);
  }

  // Real DB mode
  try {
    const [result] = await pool.query(
      'INSERT INTO projects (name, description, status) VALUES (?, ?, ?)',
      [name, description, 'ACTIVE']
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (useDemoData) {
    const project = demoProjects.find((p) => p.id === Number(id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  }

  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

module.exports = router;
