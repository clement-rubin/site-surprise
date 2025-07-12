import { useEffect, useState } from 'react';
import './Clues.css';

const CLUES_TOTAL = 8;

export default function Clues() {
  // clues devient un tableau d'objets { clue, note }
  const [clues, setClues] = useState<{ clue: string, note: string }[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  useEffect(() => {
    // Migration si besoin : si l'ancien format (array de string) est détecté
    const storedRaw = localStorage.getItem('clues') || '[]';
    let stored: any[] = [];
    try {
      stored = JSON.parse(storedRaw);
    } catch {
      stored = [];
    }
    if (stored.length > 0 && typeof stored[0] === "string") {
      // Migration vers le nouveau format
      const migrated = stored.map((clue: string) => ({ clue, note: "" }));
      localStorage.setItem('clues', JSON.stringify(migrated));
      setClues(migrated);
    } else {
      setClues(stored);
    }
    if (stored.length > 0) {
      setHighlighted(stored.length - 1);
      setTimeout(() => setHighlighted(null), 1200);
    }
  }, []);

  // Gestion de la modification de note
  function handleNoteChange(idx: number, note: string) {
    const updated = clues.map((c, i) => i === idx ? { ...c, note } : c);
    setClues(updated);
    localStorage.setItem('clues', JSON.stringify(updated));
  }

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
          {clues.map((clueObj, i) => (
            <li key={i} className={highlighted === i ? 'highlight' : ''}>
              <span className="clue-number">{i + 1}.</span> {clueObj.clue}
              <div>
                <textarea
                  className="clue-note"
                  placeholder="Ta note personnelle..."
                  value={clueObj.note}
                  onChange={e => handleNoteChange(i, e.target.value)}
                  rows={2}
                  style={{ width: '100%', marginTop: 6 }}
                />
              </div>
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
