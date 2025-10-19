import json
from app import lambda_handler

# Mock event data
event = {
    "medications": ["Digoxin"],
    "supplements": ["Vitamin A"]
}

# Run locally
response = lambda_handler(event, None)

# Pretty-print the result
print(json.dumps(response, indent=2))
