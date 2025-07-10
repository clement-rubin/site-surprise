import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Wheel from './pages/Wheel.tsx';
import Clues from './pages/Clues.tsx';

export default function App() {
  return (
    <div className="app-container">
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/wheel">La Roue</Link>
        <Link to="/clues">Mes Indices</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wheel" element={<Wheel />} />
        <Route path="/clues" element={<Clues />} />
      </Routes>
    </div>
  );
}
