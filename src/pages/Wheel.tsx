import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Wheel.css';

const CLUES  = [
  "Un lieu où le temps semble suspendu...",
  "Des bulles pourraient accompagner la soirée...",
  "Un voyage sans prendre l'avion...",
  "Un moment pour se ressourcer ensemble...",
  "Un endroit où la nature veille sur nous...",
  "Peut-être un peu d'eau, mais pas la mer...",
  "Un cocon loin du quotidien...",
  "Un souvenir à créer, unique et doux...",
  "Il aura un refuge animalier, un cocon de douceur...",
  "Un lieu où l'on peut se perdre dans la nature...",
  "Un espace pour rêver et se détendre...",
  "Un endroit secret, juste pour nous...",
  "Un lieu où les étoiles brillent plus fort...",
  "Un havre de paix pour deux amoureux...",
  "Un lieu magique, loin de l'agitation...",
  "Tu peux préparer une petite valise… mais pas besoin de passeport.",
  "On part en voiture, c’est à quelques heures d’ici.",
  "Il n’y aura pas d’hôtel… mais un logement très original.",
  "On dormira dans un endroit en bois… mais ce n’est pas une cabane.",
  "C’est tout petit, tout mignon, et on y dort à deux.",
  "Il y aura un spa rien que pour nous.",
  "Prévois ton maillot de bain (oui, même s’il n’y a pas de mer).",
  "On sera en pleine campagne, loin du bruit et des voisins.",
  "On va se réveiller avec la nature autour de nous.",
  "Il y aura des animaux pas loin, peut-être même qu’on pourra les approcher.",
  "On pourra dîner ensemble dans un endroit tranquille, sans resto ni foule.",
  "Pas d'écran, pas de téléphone… juste toi, moi, et le moment présent.",
  "Le ciel y est magnifique la nuit, tu verras toutes les étoiles.",
  "C’est un endroit où l’on peut se blottir et oublier le monde.",
  "C’est une surprise pensée pour nous deux… un moment hors du temps.",
];

function getNextSpinTime() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime();
}

function launchConfetti() {
  // Simple confetti burst (canvas-free, for demo)
  const colors = ['#a78bfa', '#f3e8ff', '#7c3aed', '#e0c3fc', '#fff'];
  for (let i = 0; i < 32; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = `${Math.random() * 100}%`;
    conf.style.animationDelay = `${Math.random()}s`;
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 2200);
  }
}

function playSound(url: string) {
  const audio = new Audio(url);
  audio.volume = 0.25;
  audio.play();
}

export default function Wheel() {
  const [canSpin, setCanSpin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [allFound, setAllFound] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const spinSound = '/spin.mp3'; // Place these files in public/
  const revealSound = '/reveal.mp3';

  useEffect(() => {
    const lastSpin = localStorage.getItem('lastSpin');
    if (lastSpin) {
      const last = parseInt(lastSpin, 10);
      const now = Date.now();
      if (now < last) {
        setCanSpin(false);
        setCountdown(last - now);
      }
    }
    // Vérifie si tous les indices sont trouvés
    const discovered = JSON.parse(localStorage.getItem('clues') || '[]');
    if (discovered.length >= CLUES.length) {
      setAllFound(true);
      setCanSpin(false);
      setTimeout(() => launchConfetti(), 400);
    }
    const timer = setInterval(() => {
      if (!canSpin && !allFound) {
        const last = parseInt(localStorage.getItem('lastSpin') || '0', 10);
        const now = Date.now();
        if (now < last) {
          setCountdown(last - now);
        } else {
          setCanSpin(true);
          setCountdown(0);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [canSpin, allFound]);

  function spinWheel() {
    if (!canSpin || allFound) return;
    setSpinning(true);
    setResult(null);
    setReveal(false);
    playSound(spinSound);
    setTimeout(() => {
      // On récupère les indices stockés sous forme d'objets { clue, note }
      const discovered = JSON.parse(localStorage.getItem('clues') || '[]');
      const discoveredClues = discovered.map((c: any) => c.clue);
      const undiscovered = CLUES.filter(c => !discoveredClues.includes(c));
      if (undiscovered.length === 0) {
        setAllFound(true);
        setSpinning(false);
        setTimeout(() => launchConfetti(), 400);
        return;
      }
      const clue = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      setResult(clue);
      playSound(revealSound);
      // Ajoute l'indice avec une note vide
      localStorage.setItem('clues', JSON.stringify([...discovered, { clue, note: "" }]));
      const next = getNextSpinTime();
      localStorage.setItem('lastSpin', next.toString());
      setCanSpin(false);
      setCountdown(next - Date.now());
      setSpinning(false);
      setTimeout(() => setReveal(true), 200); // animation de révélation
      if (undiscovered.length === 1) {
        setAllFound(true);
        setTimeout(() => launchConfetti(), 400);
      }
    }, 2000);
  }

  function formatCountdown(ms: number) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  }

  return (
    <div className="wheel-page">
      <h2>Tourne la roue bolosse !</h2>
      <div
        className={`wheel ${spinning ? 'spinning' : ''} ${!canSpin || allFound ? 'disabled' : ''}`}
        onClick={spinWheel}
        onMouseEnter={() => { if (!canSpin || allFound) setShowTooltip(true); }}
        onMouseLeave={() => setShowTooltip(false)}
        tabIndex={0}
        aria-disabled={!canSpin || allFound}
        style={{ position: 'relative' }}
      >
        <span role="img" aria-label="wheel" style={{ fontSize: '4rem', transition: 'transform 0.2s' }}>🎡</span>
        {spinning && (
          <div className="wheel-spinner">
            <div className="spinner"></div>
          </div>
        )}
        {showTooltip && (
          <div className="wheel-tooltip">
            {allFound ? "Tous les indices sont découverts !" : "Tu dois attendre demain pour rejouer."}
          </div>
        )}
      </div>
      {!canSpin && !allFound && (
        <div className="countdown">
          Prochain indice dans : {formatCountdown(countdown)}
        </div>
      )}
      {result && (
        <div className={`result ${reveal ? 'reveal' : ''}`}>
          <strong>Indice du jour :</strong>
          <span className="clue-reveal">{result}</span>
        </div>
      )}
      {allFound && (
        <div className="all-found">
          <strong>Bravo !</strong> Tu as découvert tous les indices. 🎉<br />
          <Link to="/clues" className="home-btn" style={{ marginTop: 18, display: 'inline-block' }}>
            Voir mes indices
          </Link>
        </div>
      )}
      <p className="hint">Tu peux tourner la roue une fois par jour.</p>
      {/* Confetti CSS only, see Wheel.css */}
    </div>
  );
}
