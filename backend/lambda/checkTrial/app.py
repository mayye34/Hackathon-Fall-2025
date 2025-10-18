import json
import boto3
import csv
from io import StringIO

s3 = boto3.client('s3')
BUCKET = 'wellness-hack-trial-data'
TRIALS_KEY = 'trials.csv'

def lambda_handler(event, context):
    body = event.get('body')
    if body:
        payload = json.loads(body)
    else:
        payload = event

    drug = payload.get('drug','').strip()
    demographic = payload.get('demographic', {})
    
    user_gender = payload.get('demographic', {}).get('gender', '').lower()
    user_ethnicity = payload.get('demographic', {}).get('ethnicity', '').lower()
    user_age_group = payload.get('demographic', {}).get('age_group', '').lower()

    # Read CSV from S3
    resp = s3.get_object(Bucket=BUCKET, Key=TRIALS_KEY)
    csv_text = resp['Body'].read().decode('utf-8')
    f = StringIO(csv_text)
    reader = csv.DictReader(f)

    trials = [r for r in reader if r['drug_name'].lower() == drug.lower()]
    if not trials:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No trials found for that drug in our dataset."})
        }

    # Aggregate simple stats
    def avg(key):
        vals = []
        for t in trials:
            try:
                vals.append(float(t.get(key,0)))
            except:
                pass
        return (sum(vals)/len(vals)) if vals else 0

    percent_black = avg('percent_black')
    percent_white = avg('percent_white')
    percent_asian = avg('percent_asian')
    percent_female = avg('percent_female')
    percent_male = avg('percent_male')
    percent_hispanic = avg('percent_hispanic')
    percent_middle_eastern = avg('percent_middle_eastern')
    percent_native_american = avg('percent_native_american')

    # Evaluate user's demographic
    report = []
    
    if user_gender in demographic_columns['gender']:
        col = demographic_columns['gender'][user_gender]
        report.append(f"Average representation of {user_gender.capitalize()} participants across # studies: {avg(col):.2f}%")
    if user_ethnicity in demographic_columns['ethnicity']:
        col = demographic_columns['ethnicity'][user_ethnicity]
        report.append(f"Average representation of {user_ethnicity.capitalize()} participants across # studies: {avg(col):.2f}%")
    if user_age_group in demographic_columns['age_group']:
        col = demographic_columns['age_group'][user_age_group]
        report.append(f"Average representation of age group {user_age_group} participants across # studies: {avg(col):.2f}%")
    if not report:
        report.append("No demographic information provided. Consult a provider for more information and guidance.")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "drug": drug,
            "trials_found": len(trials),
            "report": report
        })
    }

demographic_columns = {
'gender': {
    'female': 'percent_female',
    'male': 'percent_male'
},
'ethnicity': {
    'black': 'percent_black',
    'white': 'percent_white',
    'asian': 'percent_asian',
    'hispanic': 'percent_hispanic',
    'middle eastern': 'percent_middle_eastern',
    'native american': 'percent_native_american'
},
'age_group': {
    '18-29': 'percent_18_29',
    '30-39': 'percent_30_39',
    '40-49': 'percent_40_49',
    '50-59': 'percent_50_59',
    '60+': 'percent_60_plus'
}
}




