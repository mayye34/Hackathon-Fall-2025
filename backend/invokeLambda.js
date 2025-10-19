import AWS from "aws-sdk";

// configure region and credentials
AWS.config.update({ region: "us-east-1" });

const lambda = new AWS.Lambda();

export async function callLambda(functionName, payload) {
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload)
  };

  try {
    const response = await lambda.invoke(params).promise();
    return JSON.parse(response.Payload);
  } catch (err) {
    console.error("Error invoking lambda:", err);
    throw err;
  }
}
