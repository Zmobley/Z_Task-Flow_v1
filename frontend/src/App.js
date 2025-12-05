import { useEffect, useState } from 'react';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">TaskFlow – Projects</h1>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <ul className="list-group">
          {projects.map(project => (
            <li className="list-group-item" key={project.id}>
              <strong>{project.name}</strong>
              <br />
              <small>{project.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

