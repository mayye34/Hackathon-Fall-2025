export async function callLambda(functionName, payload) {
  console.log(`Mock invoking Lambda "${functionName}" with payload:`, payload);

  // -------- CHECK TRIAL --------
  if (functionName === "CheckTrial") {
    const { drug, demographic } = payload;
    if (!drug) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing drug" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        drug,
        demographic,
        representation: "Underrepresented",
        details: {
          gender: "low",
          ethnicity: "adequate",
          age_group: "balanced",
        },
      }),
    };
  }

  // -------- CHECK INTERACTIONS --------
  if (functionName === "CheckInteractions") {
    const { medications, supplements } = payload;

    if (!medications || medications.length === 0 || !supplements || supplements.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing medications or supplements" }) };
    }

    // For mock purposes, pick the first med/supp and pretend there’s an interaction
    const drug1 = medications[0];
    const drug2 = supplements[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        interaction: "minor",
        message: `${drug1} and ${drug2} may have mild interactions.`,
      }),
    };
  }

  // -------- UNKNOWN FUNCTION --------
  return { statusCode: 404, body: JSON.stringify({ error: "Unknown Lambda function" }) };
}


// export async function callLambda(functionName, payload) {
//   console.log(`Mock invoking Lambda "${functionName}" with payload:`, payload);

//   if (functionName === "CheckTrial") {
//     const { drug, demographic } = payload;
//     if (!drug) {
//       return { statusCode: 400, body: JSON.stringify({ error: "Missing drug" }) };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         drug,
//         demographic,
//         representation: "Underrepresented",
//         details: {
//           gender: "low",
//           ethnicity: "adequate",
//           age_group: "balanced"
//         }
//       })
//     };
//   }

//   if (functionName === "CheckInteractions") {
//     const { drug1, drug2 } = payload;
//     if (!drug1 || !drug2) {
//       return { statusCode: 400, body: JSON.stringify({ error: "Missing drugs" }) };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         interaction: "minor",
//         message: `${drug1} and ${drug2} may have mild interactions.`
//       })
//     };
//   }

//   return { statusCode: 404, body: JSON.stringify({ error: "Unknown Lambda function" }) };
// }