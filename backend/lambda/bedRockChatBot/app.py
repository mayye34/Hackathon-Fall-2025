import os
import json
import boto3
import requests

# Get the token from environment variable
BEDROCK_TOKEN = os.environ.get('AWS_BEARER_TOKEN_BEDROCK')
BEDROCK_ENDPOINT = "https://bedrock-runtime.us-east-1.amazonaws.com"  # replace <region> and endpoint


MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0"

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    user_message = body.get('message', '').strip()

    if not user_message:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No message provided."})
        }

    system_prompt = (
        "You are a helpful assistant for medication advice. "
        "Answer questions clearly and accurately about medications and supplements. "
        "If the user asks about drug interactions, explain each drug individually "
        "and say 'To learn about how these two drugs interact, please visit our drug interaction tab'. "
        "If the user asks about demographic compatibility for a drug, give basic info and say "
        "'If you want to learn about the demographic of clinical trial participants for this drug, please visit our clinical trials tab'. "
        "Never provide medical advice — respond with 'Sorry, I can only provide basic answers on medication and supplements. "
        "Please consult your doctor for further questions and advice!' if they request medical advice. "
        "If the question is unrelated to medication, reply 'Sorry, I can only answer questions related to medications and supplements.'"
    )

    # ✅ Claude 3 Messages API full structure
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_message}
                ]
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.7
    }

    try:
        bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")

        print("Sending request to Bedrock...")
        print(json.dumps(request_body, indent=2))

        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body)
        )

        raw_body = response.get("body")
        if raw_body:
            response_data = json.loads(raw_body.read())
        else:
            response_data = response

        print("Response from Bedrock:")
        print(json.dumps(response_data, indent=2))

        # ✅ Extract text safely
        reply = None
        if isinstance(response_data, dict):
            # Claude 3 responses contain "content": [{"type":"text","text":"..."}]
            if "content" in response_data and isinstance(response_data["content"], list):
                reply = response_data["content"][0].get("text")
            elif "output" in response_data:
                reply = response_data["output"]
            elif "message" in response_data:
                reply = response_data["message"]
            elif "messages" in response_data and response_data["messages"]:
                reply = response_data["messages"][0]["content"][0]["text"]

        if not reply:
            reply = "Sorry, could not generate a response."

    except Exception as e:
        print(f"Error calling Bedrock: {str(e)}")
        reply = f"Error: {str(e)}"

    return {
        "statusCode": 200,
        "body": json.dumps({"reply": reply})
    }
