import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Wheel.css';

const CLUES = [
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

export default function Wheel() {
  const [canSpin, setCanSpin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [allFound, setAllFound] = useState(false);

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
    setTimeout(() => {
      const discovered = JSON.parse(localStorage.getItem('clues') || '[]');
      const undiscovered = CLUES.filter(c => !discovered.includes(c));
      if (undiscovered.length === 0) {
        setAllFound(true);
        setSpinning(false);
        setTimeout(() => launchConfetti(), 400);
        return;
      }
      const clue = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      setResult(clue);
      localStorage.setItem('clues', JSON.stringify([...discovered, clue]));
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
      <div className={`wheel ${spinning ? 'spinning' : ''} ${!canSpin || allFound ? 'disabled' : ''}`} onClick={spinWheel}>
        <span role="img" aria-label="wheel" style={{ fontSize: '4rem', transition: 'transform 0.2s' }}>🎡</span>
      </div>
      {!canSpin && !allFound && (
        <div className="countdown">
          Prochain indice dans : {formatCountdown(countdown)}
        </div>
      )}
      {result && (
        <div className={`result ${reveal ? 'reveal' : ''}`}>
          <strong>Indice du jour :</strong> {result}
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
