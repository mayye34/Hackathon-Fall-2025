import json
import boto3
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


S3_PATH = "s3://sagemaker-drug-trail-data/clinical_trials_converted_sheet.csv - clinical_trials_converted_sheet.csv.csv"

s3 = boto3.client("s3")

def load_data():
    local_path = "/tmp/trials.csv"
    if not hasattr(load_data, "data"):
        bucket = S3_PATH.split("/")[2]
        key = "/".join(S3_PATH.split("/")[3:])
        s3.download_file(bucket, key, local_path)
        load_data.data = pd.read_csv(local_path)
    return load_data.data



def lambda_handler(event, context=None):
    """Main handler for user input"""
    df = load_data()
    body = event if isinstance(event, dict) else json.loads(event)

    med_id = int(body["medication_id"])
    gender = body["gender"].strip().lower()
    race = body["race"].strip().lower()
    age = int(body["age"])

    # Build user demographic vector
    user_vector = {
        "male%": 100 if gender == "m" else 0,
        "female%": 100 if gender == "f" else 0,
        "white%": 100 if race == "white" else 0,
        "black%": 100 if race == "black" else 0,
        "hispanic%": 100 if race == "hispanic" else 0,
        "asian%": 100 if race == "asian" else 0,
        "native%": 100 if race == "native" else 0,
        "mideast%": 100 if race == "mideast" else 0,
        "age18under": 100 if age < 18 else 0,
        "age18to65": 100 if 18 <= age <= 65 else 0,
        "age65plus": 100 if age > 65 else 0,
    }

    user_df = pd.DataFrame([user_vector])
    features = ["male%", "female%", "white%", "black%", "hispanic%", "asian%", "native%", "mideast%", "age18under", "age18to65", "age65plus"]

    trial_row = df[df["medication_id"] == med_id][features]

    if trial_row.empty:
        return {"error": f"Medication ID {med_id} not found"}

    score = float(cosine_similarity(trial_row, user_df)[0][0])

    return {"representation_score": round(score, 3)}
