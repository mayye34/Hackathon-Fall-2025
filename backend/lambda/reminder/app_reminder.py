# backend/app_reminder.py
from flask import Flask, request, jsonify
import json, boto3, os

app = Flask(__name__)
events = boto3.client("events", region_name="us-east-1")
lambda_client = boto3.client("lambda", region_name="us-east-1")

LAMBDA_TARGET_ARN = "arn:aws:lambda:us-east-1:847521835083:function:MedicationReminder"  # <-- use the actual Lambda ARN

@app.route("/setReminder", methods=["POST"])
def set_reminder():
    body = request.get_json(force=True)
    time = body.get("time", "09:00")
    email = body.get("email")
    med_name = body.get("medName", "Medication")
    days = body.get("days", ["MON", "TUE", "WED", "THU", "FRI"])  # optional array from frontend

    hour, minute = map(int, time.split(":"))
    cron_expr = f"cron({minute} {hour} ? * {','.join(days)} *)"

    rule_name = f"Reminder_{email.replace('@','_').replace('.','_')}_{med_name}"

    events.put_rule(
        Name=rule_name,
        ScheduleExpression=cron_expr,
        State="ENABLED",
        Description=f"Reminder for {email} - {med_name}"
    )

    events.put_targets(
        Rule=rule_name,
        Targets=[{"Id": "1", "Arn": LAMBDA_TARGET_ARN}]
    )

    lambda_client.add_permission(
        FunctionName=LAMBDA_TARGET_ARN,
        StatementId=f"{rule_name}-perm",
        Action="lambda:InvokeFunction",
        Principal="events.amazonaws.com",
        SourceArn=f"arn:aws:events:us-east-1:847521835083:rule/{rule_name}"
    )

    return jsonify({
        "message": f"Reminder set for {time} on {', '.join(days)} for {med_name}",
        "cron": cron_expr
    })

if __name__ == "__main__":
    from flask_cors import CORS
    CORS(app)
    app.run(port=5002, debug=True)
