// src/components/ResultCard.js
import React from "react";
import "./ResultCard.css";

export default function ResultCard({ data }) {
  if (!data) return null;

  // Parse nested JSON if body is still a string
  const parsed = typeof data.body === "string" ? JSON.parse(data.body) : data;
  const {
    drug,
    demographic,
    representation,
    details,
    interaction,
    message,
  } = parsed;

  // 🧪 Case 1: Clinical Trial Representation
  if (drug && demographic && details) {
    return (
      <div className="result-card">
        <h3 className="result-title">
          {drug.charAt(0).toUpperCase() + drug.slice(1)} — Clinical Trial Summary
        </h3>

        <p className="representation">
          <strong>Representation Level: </strong>
          <span
            className={`badge ${
              representation?.toLowerCase() || "balanced"
            }`}
          >
            {representation}
          </span>
        </p>

        <div className="section">
          <h4>Demographics</h4>
          <ul>
            <li>
              <strong>Gender:</strong> {demographic.gender}
            </li>
            <li>
              <strong>Ethnicity:</strong> {demographic.ethnicity}
            </li>
            <li>
              <strong>Age:</strong> {demographic.age}
            </li>
          </ul>
        </div>

        <div className="section">
          <h4>Trial Representation Details</h4>
          <ul>
            <li>
              <strong>Gender representation:</strong> {details.gender}
            </li>
            <li>
              <strong>Ethnicity representation:</strong> {details.ethnicity}
            </li>
            <li>
              <strong>Age group representation:</strong> {details.age_group}
            </li>
          </ul>
        </div>

        <div className="interaction-message">
          <em>
            Note: These levels indicate how well your demographics were
            represented in past clinical trials for this medication.
          </em>
        </div>
      </div>
    );
  }

  // 💊 Case 2: Drug–Supplement Interaction
  if (interaction && message) {
    return (
      <div className="result-card">
        <h3 className="result-title">Drug–Supplement Interaction Check</h3>

        <p className="representation">
          <strong>Interaction Severity: </strong>
          <span className={`badge ${interaction.toLowerCase()}`}>
            {interaction.charAt(0).toUpperCase() + interaction.slice(1)}
          </span>
        </p>

        <div className="section">
          <h4>Result</h4>
          <p>{message}</p>
        </div>

        <div className="interaction-message">
          <em>
            Always consult a healthcare provider before combining medications
            and supplements.
          </em>
        </div>
      </div>
    );
  }

  // 🧾 Fallback: show any other JSON in a formatted block
  return (
    <div className="result-card">
      <pre className="json">{JSON.stringify(parsed, null, 2)}</pre>
    </div>
  );
}


// // src/components/ResultCard.js
// import React from 'react';
// import './ResultCard.css'; // optional if you want local styling

// export default function ResultCard({ data }) {
//   if (!data) return null;

//   // Handle trial response`
//   if (data.drug && data.demographic && data.details) {
//     const { drug, demographic, representation, details } = data;
//     return (
//       <div className="result-card">
//         <h3 className="result-title">{drug.charAt(0).toUpperCase() + drug.slice(1)} Trial Summary</h3>
//         <p className="representation">
//           Representation level: <span className="highlight">{representation}</span>
//         </p>

//         <div className="section">
//           <h4>Demographic</h4>
//           <ul>
//             <li>Gender: {demographic.gender}</li>
//             <li>Ethnicity: {demographic.ethnicity}</li>
//             <li>Age: {demographic.age}</li>
//           </ul>
//         </div>

//         <div className="section">
//           <h4>Representation Details</h4>
//           <ul>
//             <li>Gender: {details.gender}</li>
//             <li>Ethnicity: {details.ethnicity}</li>
//             <li>Age group: {details.age_group}</li>
//           </ul>
//         </div>
//       </div>
//     );
//   }

//   // Handle interactions response
//   if (data.interaction && data.message) {
//     return (
//       <div className="result-card">
//         <h3 className="result-title">Drug Interaction Check</h3>
//         <p>
//           <strong>Interaction Level:</strong>{' '}
//           <span className="highlight">{data.interaction}</span>
//         </p>
//         <p>{data.message}</p>
//       </div>
//     );
//   }

//   // Default fallback
//   return (
//     <div className="result-card">
//       <pre className="json">{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// }



// // // src/components/ResultCard.js
// // import React from 'react';

// // export default function ResultCard({ data }) {
// //   // data is whatever your Lambda returns. Example shapes:
// //   // { drug: 'Atorvastatin', trials_found: 2, report: ['Underrepresented...'] }
// //   // { message: 'Potential interactions found', results: [...] }

// //   return (
// //     <div className="result">
// //       <pre className="json">{JSON.stringify(data, null, 2)}</pre>
// //       {/* Optionally, you can parse and render it nicer:
// //           - If data.report exists -> show badges
// //           - If data.results -> show list of interactions
// //       */}
// //     </div>
// //   );
// // }
