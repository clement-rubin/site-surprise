import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <h1>Bienvenue !</h1>
      <p>
        Chaque jour, tourne la roue pour découvrir un nouvel indice sur ta surprise...
      </p>
      <p>
        <span role="img" aria-label="sparkles">✨</span> Bonne chance ! <span role="img" aria-label="heart">❤️</span>
      </p>
    </div>
  );
}
