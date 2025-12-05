const express = require('express');
const cors = require('cors');

const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);

// Health check
app.get('/', (req, res) => {
  res.send('TaskFlow backend is running');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
