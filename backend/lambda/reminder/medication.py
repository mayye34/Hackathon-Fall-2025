import boto3
import os
from datetime import datetime
from zoneinfo import ZoneInfo

sns = boto3.client("sns")
TOPIC_ARN = "arn:aws:sns:us-east-1:847521835083:MedRemind"

def lambda_handler(event, context):

    utc_now = datetime.now(ZoneInfo("UTC"))
    est_now = utc_now.astimezone(ZoneInfo("America/New_York"))
    now_str = est_now.strftime("%I:%M %p %Z")
    message = f"💊 Medication Reminder: It's {now_str}. Time to take your medication!"
    sns.publish(
        TopicArn=TOPIC_ARN,
        Subject="Medication Reminder",
        Message=message
    )
    print("Reminder sent at:", now_str)
    return {"statusCode": 200, "body": "Reminder sent."}
