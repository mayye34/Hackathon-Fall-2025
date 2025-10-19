import json
from app import lambda_handler

# Mock event data
event = {
    "body": json.dumps({
        "message": "What are the side effects of Ibuprofen?"
    })
}

# Set environment variable
import os
BEDROCK_TOKEN = os.environ.get('AWS_BEARER_TOKEN_BEDROCK')

# Run locally
response = lambda_handler(event, None)

# Pretty-print the result
print(json.dumps(response, indent=2))