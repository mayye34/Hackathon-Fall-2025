// src/components/ResultCard.js
import React from 'react';

export default function ResultCard({ data }) {
  // data is whatever your Lambda returns. Example shapes:
  // { drug: 'Atorvastatin', trials_found: 2, report: ['Underrepresented...'] }
  // { message: 'Potential interactions found', results: [...] }

  return (
    <div className="result">
      <pre className="json">{JSON.stringify(data, null, 2)}</pre>
      {/* Optionally, you can parse and render it nicer:
          - If data.report exists -> show badges
          - If data.results -> show list of interactions
      */}
    </div>
  );
}
