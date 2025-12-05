import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProjectDetailPage() {
  const { id } = useParams(); // project id from URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState('');

  // Task form state
  const [title, setTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch project info
  useEffect(() => {
    fetch(`http://localhost:4000/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setProject(data);
        }
        setLoadingProject(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load project.');
        setLoadingProject(false);
      });
  }, [id]);

  // Fetch tasks for this project
  useEffect(() => {
    fetch(`http://localhost:4000/api/tasks/project/${id}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoadingTasks(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load tasks.');
        setLoadingTasks(false);
      });
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`http://localhost:4000/api/tasks/project/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: taskDescription,
          status,
          priority,
          due_date: dueDate || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create task');

      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);

      // reset form
      setTitle('');
      setTaskDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
    } catch (err) {
      console.error(err);
      setError('Could not save task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-link mb-3">&larr; Back to Projects</Link>

      {error && <div className="alert alert-danger">{error}</div>}

      {loadingProject ? (
        <p>Loading project...</p>
      ) : !project ? (
        <p>Project not found.</p>
      ) : (
        <>
          <h1>{project.name}</h1>
          <p>{project.description}</p>

          {/* New Task Form */}
          <div className="card mb-4 mt-3">
            <div className="card-body">
              <h5 className="card-title">Add New Task</h5>
              <form onSubmit={handleAddTask}>
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Draft test plan"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Details about this task"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Add Task'}
                </button>
              </form>
            </div>
          </div>

          {/* Tasks list */}
          <h3>Tasks</h3>
          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks yet. Add one above!</p>
          ) : (
            <ul className="list-group">
              {tasks.map(task => (
                <li className="list-group-item" key={task.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{task.title}</strong> {' '}
                      <span className="badge bg-secondary me-2">
                        {task.status}
                      </span>
                      <span className="badge bg-info text-dark">
                        {task.priority}
                      </span>
                      <br />
                      <small>{task.description}</small>
                      {task.due_date && (
                        <div>
                          <small>Due: {task.due_date}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default ProjectDetailPage;
