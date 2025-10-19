/// since API not ready to fetch yet:
// If API_BASE is not set, fallback to mocks:
export async function checkTrial(drug, demographic) {
  await new Promise(r => setTimeout(r, 350));
  return {
    drug,
    trials_found: 2,
    avg_percent_black: 8.2,
    avg_percent_female: 36,
    report: demographic.ethnicity?.toLowerCase() === 'black' ? ['Underrepresented: Black participants ~8.2%'] : ['No clear underrepresentation in our demo dataset']
  };
}

export async function checkInteractions(medications, supplements) {
    await new Promise(r => setTimeout(r, 350));
    return {
        medications, 
        supplements,
        report: "Issue reported"
    };
}


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