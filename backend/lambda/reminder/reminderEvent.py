import json
import boto3

events = boto3.client("events")
lambda_client = boto3.client("lambda")

LAMBDA_TARGET_ARN = "arn:aws:lambda:us-east-1:123456789012:function:MedicationReminder"

def lambda_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    time = body.get("time", "09:00")  # "HH:MM"
    days = body.get("days", ["MON","TUE","WED","THU","FRI"])
    email = body.get("email")
    med_name = body.get("medName", "your medication")

    # Convert to UTC and build a cron expression
    hour, minute = map(int, time.split(":"))
    cron_expr = f"cron({minute} {hour} ? * {','.join(days)} *)"

    rule_name = f"Reminder_{email.replace('@','_').replace('.','_')}_{med_name}"

    # Create or update the EventBridge rule
    events.put_rule(
        Name=rule_name,
        ScheduleExpression=cron_expr,
        State="ENABLED",
        Description=f"Reminder for {email} - {med_name}"
    )

    # Attach the existing MedicationReminder Lambda as the target
    events.put_targets(
        Rule=rule_name,
        Targets=[{"Id": "1", "Arn": LAMBDA_TARGET_ARN}]
    )

    # Allow EventBridge to invoke it
    lambda_client.add_permission(
        FunctionName=LAMBDA_TARGET_ARN,
        StatementId=f"{rule_name}-perm",
        Action="lambda:InvokeFunction",
        Principal="events.amazonaws.com",
        SourceArn=f"arn:aws:events:us-east-1:123456789012:rule/{rule_name}"
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"Reminder set for {time} on {days}",
            "cron": cron_expr
        })
    }
