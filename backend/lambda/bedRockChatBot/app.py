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

    try:
        # Initialize the Bedrock Runtime client
        bedrock_runtime = boto3.client(
            service_name='bedrock-runtime',
            region_name='us-east-1'
        )
        
        # Prepare the request body
        request_body = {
            "prompt": "\n\nHuman: " + prompt + "\n\nAssistant: ",
            "max_tokens_to_sample": 1000,
            "temperature": 0.7,
            "top_p": 0.9,
        }
        
        print("Sending request to Bedrock...")
        print(f"Request body: {json.dumps(request_body, indent=2)}")
        
        # Invoke the model
        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body)
        )
        
        # Parse the response
        response_body = json.loads(response.get('body').read())
        print(f"Response: {json.dumps(response_body, indent=2)}")
        
        # Extract the completion
        reply = response_body.get('completion', "Sorry, could not generate a response.")
    except Exception as e:
        print(f"Error calling Bedrock: {str(e)}")
        reply = f"Error: {str(e)}"

    return {
        "statusCode": 200,
        "body": json.dumps({"reply": reply})
    }
