import json
import boto3
import csv
from io import StringIO

# Clients
s3 = boto3.client('s3')
runtime = boto3.client('sagemaker-runtime')

# Constants
BUCKET = 'sagemaker-drug-trail-data'
TRIALS_KEY = 'medication_id_key.csv - medication_id_key.csv.csv'
SAGEMAKER_ENDPOINT = 'drug-trial-representation-endpoint'

def lambda_handler(event, context):
    body = event.get('body')
    if body:
        payload = json.loads(body)
    else:
        payload = event

    drug = payload.get('drug', '').strip()
    drug = convert_drug_to_id(drug)
    if drug == -1:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "Medication not found in our dataset."})
        }
    demographic = payload.get('demographic', {})
    user_gender = demographic.get('gender', '').lower()
    user_ethnicity = demographic.get('ethnicity', '').lower()
    user_age_group = demographic.get('age_group', '').lower()


    # 🔹 Call SageMaker endpoint
    # Build model input (matching your endpoint's input format)
    csv_input = f"{drug},{extract_age_number(user_age_group)},{user_gender},{user_ethnicity}"

    try:
        response = runtime.invoke_endpoint(
            EndpointName=SAGEMAKER_ENDPOINT,
            ContentType="text/csv",   # or "application/json" if your endpoint expects JSON
            Body=csv_input
        )
        result = response['Body'].read().decode('utf-8')
        result_json = json.loads(result) if result.strip().startswith('{') else {"raw": result}

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Error calling SageMaker endpoint: {str(e)}"})
        }

    # 🔹 Construct combined response
    return {
        "statusCode": 200,
        "body": json.dumps({
            "drug": drug,
            "user_demographic": demographic,
            "representation_score": result_json.get("representation_score", result_json),
            "message": "Score represents similarity of user demographics to clinical trial participants"
        })
    }

# Helper function to convert age group label to representative age value
def extract_age_number(age_group):
    if not age_group:
        return 30
    if age_group.startswith('18'): return 25
    if age_group.startswith('30'): return 35
    if age_group.startswith('40'): return 45
    if age_group.startswith('50'): return 55
    if '60' in age_group: return 65
    return 30

def convert_drug_to_id(drug_name):
    medication_dict = {
        "Azithromycin": 1,
        "Tretinoin": 2,
        "Duloxetine": 3,
        "Citalopram": 4,
        "Acetaminophen": 5,
        "Ibuprofen": 6,
        "Naproxen": 7,
        "Hydrocodone": 8,
        "Oxycodone": 9,
        "Celecoxib": 10,
        "Prednisolone": 11,
        "Dexamethasone": 12,
        "Amoxicillin-clavulanate": 13,
        "Ciprofloxacin": 14,
        "Levofloxacin": 15,
        "Clindamycin": 16,
        "Doxycycline": 17,
        "Penicillin V": 18,
        "Atenolol": 19,
        "Metoprolol": 20,
        "Ramipril": 21,
        "Valsartan": 22,
        "Furosemide": 23,
        "Spironolactone": 24,
        "Pantoprazole": 25,
        "Esomeprazole": 26,
        "Famotidine": 27,
        "Cetirizine": 28,
        "Loratadine": 29,
        "Diphenhydramine": 30,
        "Montelukast": 31,
        "Fluticasone": 32,
        "Salbutamol": 33,
        "Tiotropium": 34,
        "Bupropion": 35,
        "Venlafaxine": 36,
        "Escitalopram": 37,
        "Trazodone": 38,
        "Lorazepam": 39,
        "Alprazolam": 40,
        "Diazepam": 41,
        "Zolpidem": 42,
        "Gabapentin": 43,
        "Pregabalin": 44,
        "Topiramate": 45,
        "Lamotrigine": 46,
        "Clonidine": 47,
        "Methylphenidate": 48,
        "Adderall": 49,
        "Amoxicillin": 50,
        "Omeprazole": 51,
        "Prednisone": 52,
        "Metformin": 53,
        "Cyclobenzaprine": 54,
        "Albuterol": 55,
        "Clonazepam": 56,
        "Hydrochlorothiazide": 57,
        "Quetiapine": 58,
        "Lisinopril": 59,
        "Amlodipine": 60,
        "Fluoxetine": 61,
        "Warfarin": 62,
        "Sertraline": 63,
        "Losartan": 64,
        "Simvastatin": 65,
        "Tramadol": 66,
        "Levothyroxine": 67,
        "Sildenafil": 68,
        "Estrogen": 69,
        "Finasteride": 70,
        "Progesterone": 71,
        "Aripiprazole": 72,
        "Buprenorphine": 73,
        "Methadone": 74,
        "Tacrolimus": 75,
        "Anakinra": 76,
        "Interferon": 77,
        "Albuterol HFA": 78,
        "Enalapril": 79,
        "Levetiracetam": 80,
        "Risperidone": 81,
        "Ropinirole": 82,
        "Glipizide": 83,
        "Insulin": 84,
        "Clopidogrel": 85,
        "Dabigatran": 86,
        "Atorvastatin": 87,
        "Metronidazole": 88,
        "Tamsulosin": 89,
        "Tylenol (PRN)": 90,
        "Oxybutynin": 91,
        "Cefalexin": 92,
        "Cyclosporine": 93,
        "Heparin": 94,
        "Hydrocortisone": 95,
        "Tadalafil": 96,
        "Ethinyl Estradiol": 97,
        "Rivaroxaban": 98,
        "Amphetamine": 99,
        "Methotrexate": 100,
        "Fentanyl": 101,
        "Insulin Pump Trial": 102,
        "Rexulti": 103,
        "Carbamazepine": 104,
        "Ambien": 105,
        "Modafinil": 106,
        "Januvia": 107,
        "Keppra": 108,
        "Advair": 109,
        "Glucophage": 110,
        "Nexium": 111,
        "Zoloft": 112,
        "Levitra": 113,
        "Celexa": 114,
        "Seroquel": 115,
        "Humalog": 116,
        "Ocrelizumab": 117,
        "Latuda": 118,
        "Allopurinol": 119,
        "Lunesta": 120,
        "Plavix": 121,
        "Codeine": 122,
        "Victoza": 123,
        "Fluconazole": 124,
        "Adalimumab": 125,
        "Rozerem": 126,
        "Zantac (PRN)": 127,
        "Viagra": 128,
        "Coumadin": 129,
        "Folic Acid": 130,
        "Abilify": 131,
        "Naltrexone": 132,
        "Lyrica": 133,
        "Ibuprofen (PRN)": 134,
        "Rifampin": 135,
        "Effexor": 136,
        "Topamax": 137,
        "Phenytoin": 138,
        "Hydroxyzine": 139,
        "Benadryl": 140,
        "Depakote": 141,
        "Prilosec": 142,
        "Chlorpromazine": 143,
        "Rituximab": 144,
        "Tegretol": 145,
        "Diltiazem": 146,
        "Zocor": 147,
        "Lantus": 148,
        "Aspirin (Low Dose)": 149,
        "Vancomycin": 150,
        "Wellbutrin": 151,
        "Infliximab": 152,
        "Diovan": 153,
        "Cymbalta": 154,
        "Nuvigil": 155,
        "Armodafinil": 156,
        "Eliquis": 157,
        "Neurontin": 158,
        "Vraylar": 159,
        "Promethazine": 160,
        "Naproxen (PRN)": 161,
        "Norvasc": 162,
        "Amoxicillin-Clavulanate": 163,
        "Cialis": 164,
        "Zyrtec": 165,
        "Morphine": 166,
        "Provigil": 167,
        "Lithium": 168,
        "Claritin": 169,
        "Synthroid": 170,
        "Prozac": 171,
        "Baclofen": 172,
        "Spiriva": 173
    }

    
    lookup = {k.lower(): v for k, v in medication_dict.items()}
    drug_name = drug_name.lower()

    if drug_name in lookup:
        return lookup[drug_name] 
    else:
        return -1


