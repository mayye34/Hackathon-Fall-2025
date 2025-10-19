import json
import boto3
import csv
from io import StringIO

s3 = boto3.client('s3')
BUCKET = 'drug-drug-interactions'
INTER_KEY = 'db_drug_interactions.csv'

def lambda_handler(event, context):
    body = event.get('body')
    if body:
        payload = json.loads(body)
    else:
        payload = event

    meds = [m.lower() for m in payload.get('medications',[])]
    sups = [s.lower() for s in payload.get('supplements',[])]

    resp = s3.get_object(Bucket=BUCKET, Key=INTER_KEY)
    csv_text = resp['Body'].read().decode('utf-8')
    f = StringIO(csv_text)
    reader = csv.DictReader(f)
    
    results = []
    for row in reader:
        drug1 = row.get('Drug 1', '').lower()
        drug2 = row.get('Drug 2', '').lower()
        interaction = row.get('Interaction Description', '')
        
        # Check if any of our medications match drug1
        if drug1 in meds:
            # Check if any of our supplements match drug2
            for sup in sups:
                if sup.lower() in drug2:
                    results.append({
                        "med": drug1,
                        "supplement": drug2,
                        "interaction": interaction
                    })
        
        # Also check the reverse (if supplement is in drug1 and medication in drug2)
        if drug2 in meds:
            for sup in sups:
                if sup.lower() in drug1:
                    results.append({
                        "med": drug2,
                        "supplement": drug1,
                        "interaction": interaction
                    })

    if not results:
        message = "No known interactions found in our dataset."
    else:
        message = "Potential interactions found."

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": message,
            "results": results
        })
    }

if __name__ == "__main__":
    raw_input = sys.stdin.read()
    if raw_input:
        event = json.loads(raw_input)
        result = lambda_handler(event, None)
        print(json.dumps(result))
