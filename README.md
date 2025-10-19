### Lehigh Fall 2025 Hackathon - Hack Your Life
# MedCheck
## Overview

This application provides a comprehensive platform for managing medications and verifying clinical trial representation. It includes three main features:

1. **Clinical Trial Representation Verification**  
   Users can check whether they would have been represented in clinical trials for a medication based on demographics such as gender, race, and age.

2. **Medication Interaction & Reminder System**  
   The system alerts users to potential interactions between medications and supplements. It also provides automated medication reminders via email.

3. **Medication Knowledge Chatbot**  
   A chatbot allows users to get simple, safe information about medications including side effects, uses, and general guidance, with built-in safety measures to prevent inappropriate medical advice.

---

## Frontend

- **Technologies:** React, JavaScript, CSS  
- Provides a user-friendly interface for:
  - Inputting personal demographic data
  - Adding medications and supplements
  - Interacting with the chatbot
  - Viewing medication reminders and alerts

---

## Backend Architecture

The backend leverages several AWS services to provide scalable and secure functionality:

- **SageMaker**:  
  - Used to create and train a model to determine a user’s compatibility with clinical trial data.
  - Model data is hosted in **S3 buckets**.

- **Bedrock**:  
  - Hosts the supporting chatbot for safe medication knowledge.

- **Amazon SNS**:  
  - Sends email medication reminders to users based on their medication schedules.

- **EventBridge**:  
  - Triggers medication reminder events at the appropriate times.

- **AWS Lambda**:  
  - Handles underlying functions such as processing user input, checking for interactions, triggering SNS notifications, and orchestrating SageMaker and Bedrock calls.

---

## Features

- **Clinical Trial Eligibility Check**
  - Input personal demographics
  - Receive feedback on whether users match representation in historical clinical trials

- **Medication Interaction Alerts**
  - Input medications and supplements
  - Receive alerts for potential conflicts or interactions

- **Automated Medication Reminders**
  - Schedule reminders for AM/PM dosages
  - Receive reminders via email triggered by EventBridge

- **Medication Chatbot**
  - Ask questions about medications
  - Receive safe, non-prescriptive guidance
  - Powered by Bedrock AI