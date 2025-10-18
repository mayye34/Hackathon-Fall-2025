import json
import boto3

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
    inter_json = json.loads(resp['Body'].read().decode('utf-8'))

    results = []
    for med in meds:
        if med in inter_json:
            med_interactions = inter_json[med]
            for it in med_interactions:
                # quick substring match of supplement names in interaction text
                for sup in sups:
                    if sup in it.lower() or any(word in it.lower() for word in sup.split()):
                        results.append({"med": med, "interaction": it})

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
