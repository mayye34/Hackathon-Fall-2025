// src/components/ResultCard.js
import React from 'react';
import './ResultCard.css'; // optional if you want local styling

export default function ResultCard({ data }) {
  if (!data) return null;

  // Handle trial response
  if (data.drug && data.demographic && data.details) {
    const { drug, demographic, representation, details } = data;
    return (
      <div className="result-card">
        <h3 className="result-title">{drug.charAt(0).toUpperCase() + drug.slice(1)} Trial Summary</h3>
        <p className="representation">
          Representation level: <span className="highlight">{representation}</span>
        </p>

        <div className="section">
          <h4>Demographic</h4>
          <ul>
            <li>Gender: {demographic.gender}</li>
            <li>Ethnicity: {demographic.ethnicity}</li>
            <li>Age: {demographic.age}</li>
          </ul>
        </div>

        <div className="section">
          <h4>Representation Details</h4>
          <ul>
            <li>Gender: {details.gender}</li>
            <li>Ethnicity: {details.ethnicity}</li>
            <li>Age group: {details.age_group}</li>
          </ul>
        </div>
      </div>
    );
  }

  // Handle interactions response
  if (data.interaction && data.message) {
    return (
      <div className="result-card">
        <h3 className="result-title">Drug Interaction Check</h3>
        <p>
          <strong>Interaction Level:</strong>{' '}
          <span className="highlight">{data.interaction}</span>
        </p>
        <p>{data.message}</p>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="result-card">
      <pre className="json">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}



// // src/components/ResultCard.js
// import React from 'react';

// export default function ResultCard({ data }) {
//   // data is whatever your Lambda returns. Example shapes:
//   // { drug: 'Atorvastatin', trials_found: 2, report: ['Underrepresented...'] }
//   // { message: 'Potential interactions found', results: [...] }

//   return (
//     <div className="result">
//       <pre className="json">{JSON.stringify(data, null, 2)}</pre>
//       {/* Optionally, you can parse and render it nicer:
//           - If data.report exists -> show badges
//           - If data.results -> show list of interactions
//       */}
//     </div>
//   );
// }
