import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Wheel from './pages/Wheel.tsx';
import Clues from './pages/Clues.tsx';

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1 className="site-title">🎁 Site Surprise</h1>
        <nav aria-label="Navigation principale">
          <ul className="nav-list">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/wheel">La Roue</Link></li>
            <li><Link to="/clues">Mes Indices</Link></li>
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
