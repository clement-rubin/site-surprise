import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <h1>Bienvenue sur le site surprise !</h1>
      <p>
        Chaque jour, tourne la roue pour découvrir un nouvel indice sur la surprise qui t'attend...
      </p>
      <div className="home-actions">
        <Link to="/wheel" className="home-btn">
          🎡 Découvrir un indice
        </Link>
      </div>
      <p className="home-footer">
        <span role="img" aria-label="sparkles">✨</span> Bonne chance et amuse-toi bien ! <span role="img" aria-label="heart">❤️</span>
      </p>
    </div>
  );
}
