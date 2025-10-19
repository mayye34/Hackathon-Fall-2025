import os
import json
import boto3
import requests

# Get the token from environment variable
BEDROCK_TOKEN = os.environ.get('AWS_BEARER_TOKEN_BEDROCK')
BEDROCK_ENDPOINT = "https://bedrock-runtime.us-east-1.amazonaws.com"  # replace <region> and endpoint

MODEL_ID = "anthropic.claude-sonnet-4-5-20250929-v1:0"

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    user_message = body.get('message', '').strip()

    if not user_message:
        return {"statusCode": 400, "body": json.dumps({"error": "No message provided."})}

    prompt = f"You are a helpful assistant for medication advice. Answer this question about medications clearly and accurately :\n{user_message}. \nYou should answer their question by providing basic information, symptoms, side effects, etc. If the user asks about drug interactions, give them information about each individual drug and then say 'To learn about how these two drugs interact, please visit our drug interaction tab'. If the user asks about their compatability for a drug based on trials, give the basic information on the drug, and then say 'If you want to learn about the demographic of clinical trial participants for this drug, please visit our clinical trials tab'. Never provide medical advice, if the user asks for advice respond with 'Sorry, I can only provide basic answers on medication and supplements. Please consult your doctor for further questions and advice!'. If the user asks a question not related to medication or supplements, respond with 'Sorry, I can only answer questions related to medications and supplements.'"

    # Build the request
    headers = {
        "Authorization": f"Bearer {BEDROCK_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    data = json.dumps({
        "modelId": MODEL_ID,
        "inputText": prompt
    })

    # Call Bedrock using requests
    response = requests.post(f"{BEDROCK_ENDPOINT}/invokeModel", headers=headers, data=data)
    response_json = response.json()
    reply = response_json.get('outputText', "Sorry, could not generate a response.")

    return {
        "statusCode": 200,
        "body": json.dumps({"reply": reply})
    }
