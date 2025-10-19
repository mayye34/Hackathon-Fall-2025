// const API_BASE = '"http://localhost:5001"'; // or your deployed URL

// export async function checkTrial(drug, demographic) {
//   const resp = await fetch(`${API_BASE}/checkTrial`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ drug, demographic }),
//   });

//   const data = await resp.json();

//   // Handle Lambda proxy format
//   if (data.body) {
//     return JSON.parse(data.body);
//   }

//   return data;
// }

// export async function checkInteractions(drug1, drug2) {
//   const resp = await fetch(`${API_BASE}/checkInteractions`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ drug1, drug2 }),
//   });

//   const data = await resp.json();

//   // Handle Lambda proxy format
//   if (data.body) {
//     return JSON.parse(data.body);
//   }

//   return data;
// }

// src/api.js
// import { callLambda } from "../../backend/invokeLambda";


// export async function checkTrial(drug, demographic) {
//   const resp = await callLambda("CheckTrial", { drug, demographic });
//   return JSON.parse(resp.body);
// }

// export async function checkInteractions(drug1, drug2) {
//   const resp = await callLambda("CheckInteractions", { drug1, drug2 });
//   return JSON.parse(resp.body);
// }


// src/api.js
const API_BASE = "http://localhost:5001";

export async function checkTrial(drug, demographic) {
  const resp = await fetch(`${API_BASE}/checkTrial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drug, demographic }),
  });
  if (!resp.ok) throw new Error("Error fetching trial data");
  return await resp.json();
}

export async function checkInteractions(medications, supplements) {
  const resp = await fetch(`${API_BASE}/checkInteractions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medications, supplements }),
  });
  if (!resp.ok) throw new Error("Error fetching interactions");
  return await resp.json();
}



/// since API not ready to fetch yet:
// If API_BASE is not set, fallback to mocks:
// export async function checkTrial(drug, demographic) {
//   await new Promise(r => setTimeout(r, 350));
//   return {
//     drug,
//     trials_found: 2,
//     avg_percent_black: 8.2,
//     avg_percent_female: 36,
//     report: demographic.ethnicity?.toLowerCase() === 'black' ? ['Underrepresented: Black participants ~8.2%'] : ['No clear underrepresentation in our demo dataset']
//   };
// }

// export async function checkInteractions(medications, supplements) {
//     await new Promise(r => setTimeout(r, 350));
//     return {
//         medications, 
//         supplements,
//         report: "Issue reported"
//     };
// }


/*

// src/api.js
const API_BASE = 'https://<api-id>.execute-api.<region>.amazonaws.com'; // replace

export async function checkTrial(drug, demographic) {
  const resp = await fetch(`${API_BASE}/checkTrial`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drug, demographic }),
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(error.error || error.message || resp.statusText);
  }
  return resp.json();
}

export async function checkInteractions(medications, supplements) {
  const resp = await fetch(`${API_BASE}/checkInteractions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medications, supplements }),
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(error.error || error.message || resp.statusText);
  }
  return resp.json();
}

*/