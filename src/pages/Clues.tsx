import { useEffect, useState } from 'react';
import './Clues.css';

export default function Clues() {
  const [clues, setClues] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('clues') || '[]');
    setClues(stored);
  }, []);

  return (
    <div className="clues-page">
      <h2>Mes indices découverts</h2>
      {clues.length === 0 ? (
        <p>Aucun indice pour l'instant...</p>
      ) : (
        <ul>
          {clues.map((clue, i) => (
            <li key={i}>{clue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
