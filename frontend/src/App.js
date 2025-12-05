import { Routes, Route, Link } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            TaskFlow
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Projects
                </Link>
              </li>
            </ul>
            <span className="navbar-text">
              Project & Task Tracker
            </span>
          </div>
        </div>
      </nav>

      {/* Routed Pages */}
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
