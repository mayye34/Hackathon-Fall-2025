// src/components/InteractionForm.js
import React, { useState } from 'react';
import { checkInteractions } from '../api';

function ListInput({ label, items, setItems, placeholder }) {
  const [text, setText] = useState('');
  function addItem() {
    const v = text.trim();
    if (!v) return;
    setItems(prev => [...prev, v]);
    setText('');
  }
  return (
    <div className="list-input">
      <label>{label}</label>
      <div className="list-controls">
        <input value={text} onChange={e => setText(e.target.value)} placeholder={placeholder} />
        <button type="button" onClick={addItem}>Add</button>
      </div>
      <ul className="chip-list">
        {items.map((it, i) => (
          <li key={i} className="chip">
            {it}
            <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} aria-label={`Remove ${it}`}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InteractionForm({ setResult }) {
  const [meds, setMeds] = useState([]);
  const [sups, setSups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (meds.length === 0) {
      setError('Add at least one medication.');
      return;
    }

    setLoading(true);
    try {
      const res = await checkInteractions(meds, sups);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <ListInput label="Medications" items={meds} setItems={setMeds} placeholder="e.g., Methotrexate" />
      <ListInput label="Supplements" items={sups} setItems={setSups} placeholder="e.g., Iron" />

      <div className="actions">
        <button type="submit" disabled={loading}>{loading ? 'Checking…' : 'Check Interactions'}</button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  );
}
