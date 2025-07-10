import { useEffect, useState } from 'react';
import './Clues.css';

const CLUES_TOTAL = 8;

export default function Clues() {
  const [clues, setClues] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('clues') || '[]');
    setClues(stored);
  }, []);

  return (
    <div className="clues-page">
      <h2>Mes indices découverts</h2>
      <div className="clues-progress">
        {clues.length} / {CLUES_TOTAL} indices découverts
      </div>
      {clues.length === 0 ? (
        <p>Aucun indice pour l'instant...</p>
      ) : (
        <ul className="clues-list">
          {clues.map((clue, i) => (
            <li key={i}>
              <span className="clue-number">{i + 1}.</span> {clue}
            </li>
          ))}
        </ul>
      )}
      {clues.length === CLUES_TOTAL && (
        <div className="clues-congrats">
          <strong>Félicitations !</strong> Tu as trouvé tous les indices ! 🎉
        </div>
      )}
    </div>
  );
}
