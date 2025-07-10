import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Wheel from './pages/Wheel.tsx';
import Clues from './pages/Clues.tsx';

export default function App() {
  const location = useLocation();
  return (
    <div className="app-container">
      <header>
        <h1 className="site-title" style={{
          animation: 'popIn 1.2s cubic-bezier(.36,.07,.19,.97)'
        }}>🎁 Site Surprise</h1>
        <nav aria-label="Navigation principale">
          <ul className="nav-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 24 }}>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link>
            </li>
            <li>
              <Link to="/wheel" className={location.pathname === '/wheel' ? 'active' : ''}>La Roue</Link>
            </li>
            <li>
              <Link to="/clues" className={location.pathname === '/clues' ? 'active' : ''}>Mes Indices</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wheel" element={<Wheel />} />
          <Route path="/clues" element={<Clues />} />
        </Routes>
      </main>
    </div>
  );
}
