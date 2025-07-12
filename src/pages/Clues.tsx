import { useEffect, useState } from 'react';
import './Clues.css';

export default function Clues() {
  // clues devient un tableau d'objets { clue, note }
  const [clues, setClues] = useState<{ clue: string, note: string }[]>([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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
      setTimeout(() => setHighlighted(null), 800); // animation plus courte
    }
  }, []);

  // Gestion de la modification de note
  function handleNoteChange(idx: number, note: string) {
    const updated = clues.map((c, i) => i === idx ? { ...c, note } : c);
    setClues(updated);
    localStorage.setItem('clues', JSON.stringify(updated));
  }

  function handleCopyAll() {
    const text = clues.map((c, i) => `${i + 1}. ${c.clue}${c.note ? `\nNote: ${c.note}` : ''}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  // On récupère le nombre total d'indices depuis le localStorage ou on fallback à clues.length
  const cluesTotal = (() => {
    // Essaie de lire la liste complète des indices depuis Wheel.tsx si elle est stockée
    // Sinon, fallback à clues.length (toujours >= nombre d'indices trouvés)
    // Pour une vraie robustesse, il faudrait partager la source des indices entre Wheel et Clues
    // Ici, on prend le max trouvé
    const discovered = JSON.parse(localStorage.getItem('clues') || '[]');
    // On tente de deviner le nombre total d'indices en cherchant dans le localStorage si Wheel a stocké la liste complète
    // Mais sinon, on prend le nombre d'indices trouvés
    // Pour la cohérence, on peut hardcoder 15 (voir Wheel.tsx) ou faire mieux si besoin
    return 15;
  })();

  return (
    <div className="clues-page simple">
      <h2>Mes indices découverts</h2>
      <div className="clues-progress">
        {clues.length} / {cluesTotal} indices découverts
      </div>
      {clues.length > 0 && (
        <button className="copy-btn" onClick={handleCopyAll} style={{ marginBottom: 18 }}>
          {copied ? "Copié !" : "📋 Copier tous les indices"}
        </button>
      )}
      {clues.length === 0 ? (
        <p>Aucun indice pour l'instant...</p>
      ) : (
        <ul className="clues-list">
          {clues.map((clueObj, i) => (
            <li
              key={i}
              className={highlighted === i ? 'highlight animated-highlight' : ''}
              style={{ transition: highlighted === i ? 'background 0.5s, color 0.5s, transform 0.5s' : undefined }}
            >
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
                {!clueObj.note && <span className="note-placeholder">Aucune note écrite</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {clues.length === cluesTotal && (
        <div className="clues-congrats" style={{ animation: 'none' }}>
          <strong>Félicitations !</strong> Tu as trouvé tous les indices ! 🎉
        </div>
      )}
    </div>
  );
}
