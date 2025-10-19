// src/components/TrialCheckForm.js
import React, { useState } from 'react';
import { checkTrial } from '../api';

export default function TrialCheckForm({ setResult }) {
  const [drug, setDrug] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!drug.trim()) {
      setError('Please enter a medication or treatment name.');
      return;
    }

    setLoading(true);
    try {
      const demographic = { gender, ethnicity, age: age ? Number(age) : null };
      const res = await checkTrial(drug.trim(), demographic);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Medication / Treatment
        <input value={drug} onChange={e => setDrug(e.target.value)} placeholder="e.g., Methotrexate" />
      </label>

      <div className="row">
        <label>
          Gender
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Ethnicity
          <select value={ethnicity} onChange={e => setEthnicity(e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="White">Black</option>
            <option value="Black">White</option>
            <option value="Hispanic/Latino">Hispanic/Latino</option>
            <option value="Asian">Asian</option>
            <option value="Native American / Alaskan Native">Native American / Alaskan Native</option>
            <option value="Native Hawaiian / Pacific Islander">Native Hawaiian / Pacific Islander</option>
            <option value="Middle Eastern">Middle Eastern</option>
          </select>
        </label>

        <label>
          Age
          <input value={age} onChange={e => setAge(e.target.value)} type="number" min="0" placeholder="optional" />
        </label>
      </div>

      <div className="actions">
        <button type="submit" disabled={loading}>{loading ? 'Checking…' : 'Check Representation'}</button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  );
}
