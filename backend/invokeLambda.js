export async function callLambda(functionName, payload) {
  console.log(`Mock invoking Lambda "${functionName}" with payload:`, payload);

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
          age_group: "balanced"
        }
      })
    };
  }

  if (functionName === "CheckInteractions") {
    const { drug1, drug2 } = payload;
    if (!drug1 || !drug2) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing drugs" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        interaction: "minor",
        message: `${drug1} and ${drug2} may have mild interactions.`
      })
    };
  }

  return { statusCode: 404, body: JSON.stringify({ error: "Unknown Lambda function" }) };
}



// import AWS from "aws-sdk";

// // configure region and credentials
// AWS.config.update({ region: "us-east-1" });

// const lambda = new AWS.Lambda();

// export async function callLambda(functionName, payload) {
//   const params = {
//     FunctionName: functionName,
//     Payload: JSON.stringify(payload)
//   };

//   try {
//     const response = await lambda.invoke(params).promise();
//     return JSON.parse(response.Payload);
//   } catch (err) {
//     console.error("Error invoking lambda:", err);
//     throw err;
//   }
// }
