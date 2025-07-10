import { useState, useEffect } from 'react';
import './Wheel.css';

const CLUES = [
  "C'est un endroit insolite...",
  "Prépare-toi à te détendre...",
  "Il y aura un jacuzzi...",
  "On partira en voiture...",
  "Ce sera une nuit magique...",
  "Pense à prendre un maillot !",
  "La nature sera au rendez-vous...",
  "Un cocon rien que pour nous deux...",
];

function getNextSpinTime() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime();
}

export default function Wheel() {
  const [canSpin, setCanSpin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
    const timer = setInterval(() => {
      if (!canSpin) {
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
  }, [canSpin]);

  function spinWheel() {
    if (!canSpin) return;
    setSpinning(true);
    setTimeout(() => {
      const discovered = JSON.parse(localStorage.getItem('clues') || '[]');
      const undiscovered = CLUES.filter(c => !discovered.includes(c));
      const clue = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      setResult(clue);
      localStorage.setItem('clues', JSON.stringify([...discovered, clue]));
      const next = getNextSpinTime();
      localStorage.setItem('lastSpin', next.toString());
      setCanSpin(false);
      setCountdown(next - Date.now());
      setSpinning(false);
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
      <h2>Tourne la roue !</h2>
      <div className={`wheel ${spinning ? 'spinning' : ''}`} onClick={spinWheel}>
        <span role="img" aria-label="wheel">🎡</span>
      </div>
      {!canSpin && (
        <div className="countdown">
          Prochain indice dans : {formatCountdown(countdown)}
        </div>
      )}
      {result && (
        <div className="result">
          <strong>Indice du jour :</strong> {result}
        </div>
      )}
      <p className="hint">Tu peux tourner la roue une fois par jour.</p>
    </div>
  );
}
