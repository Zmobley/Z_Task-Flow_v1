import { API_BASE_URL } from '../config';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  fetch(`${API_BASE_URL}/api/projects`)
    .then((res) => res.json())
    .then((data) => {
      console.log('Projects API response:', data);

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && data.error) {
        setError(data.error);
        setProjects([]);
      } else {
        setError('Unexpected response format when loading projects.');
        setProjects([]);
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching projects:', err);
      setError('Could not load projects.');
      setProjects([]);
      setLoading(false);
    });
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error('Failed to create project');

      const newProject = await res.json();
      setProjects(prev => [newProject, ...prev]);
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setError('Could not save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">TaskFlow – Projects</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* New project form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Project</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. IVR Modernization Pilot"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of this project"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Project'}
            </button>
          </form>
        </div>
      </div>

      {/* Projects list */}
      <h2 className="mb-3">Existing Projects</h2>

      {loading ? (
  <p>Loading projects...</p>
) : !Array.isArray(projects) ? (
  <p>Unexpected project data. Please try refreshing.</p>
) : projects.length === 0 ? (
  <p>No projects yet. Add one above!</p>
) : (
   <div className="row">
    {projects.map((project) => (
      <div className="col-md-4 mb-3" key={project.id}>
        {/* your existing project card code here */}
      </div>
    ))}
  </div>
)}
        <ul className="list-group">
          {projects.map(project => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={project.id}>
              <div>
                <strong>{project.name}</strong>
                <br />
                <small>{project.description}</small>
              </div>
              <Link
                to={`/projects/${project.id}`}
                className="btn btn-sm btn-outline-secondary"
              >
                View Tasks
              </Link>
            </li>
          ))}
        </ul>
        
    </div>
  );
}

export default ProjectsPage;
