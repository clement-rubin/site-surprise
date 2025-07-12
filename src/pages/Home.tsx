import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-bg">
      <div className="home-layout">
        <aside className="home-aside">
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&q=80"
            alt="Décor île"
            className="home-aside-img"
          />
        </aside>
        <main className="home">
          <div className="home-header">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80"
              alt="Iles paradisiaques"
              className="home-hero-img"
            />
            <h1>
              Bienvenue sur le site surprise pour l'or la plus belle fille du monde entier!
            </h1>
            <div className="home-subtitle">
              Prête à découvrir chaque jour un peu plus de la surprise ? 🌴✨
            </div>
          </div>
          <p>
            Chaque jour, tourne la roue pour découvrir un nouvel indice sur la surprise qui t'attend...
          </p>
          <div className="home-actions">
            <Link to="/wheel" className="home-btn pulse-btn">
              🎡 Découvrir un indice beauté des îles 
            </Link>
          </div>
          <p className="home-footer">
            <span role="img" aria-label="sparkles">✨</span> Bonne chance et amuse-toi bien ! <span role="img" aria-label="heart">❤️</span>
          </p>
        </main>
      </div>
    </div>
  );
}
