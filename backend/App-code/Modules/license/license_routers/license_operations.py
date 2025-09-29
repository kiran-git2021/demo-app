import uuid
import base64
import datetime

from Modules.license.license_routers.database import es, INDEX_NAME
import time

ProductName = "ProductOrigin"

# Function to generate a license key with an expiry date and encode it
def generate_license_key(days:int):
    unique_id = str(uuid.uuid4())  # Generate a random UUID as a unique identifier
    generated_date  = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    expiry_date = (datetime.datetime.now() + datetime.timedelta(days=days)).strftime("%Y-%m-%d-%H-%M-%S")  # 30 days from now
    license_key = f"{unique_id}#{expiry_date}#{ProductName}"
    encoded_license_key = base64.b64encode(license_key.encode()).decode()

    # Store the generated license key in Elasticsearch, ensuring only a single record is present
    es.delete_by_query(index=INDEX_NAME, body={"query": {"match_all": {}}})  # Delete all existing records
    document = {
        "license_key": encoded_license_key,
        "unique_id": unique_id,
        "generated_on": generated_date,
        "expiry_date": expiry_date,
        "product_name": ProductName
    }
    es.index(index=INDEX_NAME, id=unique_id, body=document)

    return encoded_license_key

def license_status():
    try:
        result = es.search(index=INDEX_NAME, body={"query": {"match_all": {}}})
        if len(result['hits']['hits']) == 0:
            return [False,False]  # No license key found

        document = result['hits']['hits'][0]['_source']
        # generated_date = document['generated_on']
        # expiry_date= document['expiry_date']
        return document
    except:
        return {"generated_on":None,"expiry_date":None}

# Function to validate and decode a license key from Elasticsearch
def validate_and_decode_license_key_from_db():
    try:
        # Fetch the license key document from Elasticsearch
        result = es.search(index=INDEX_NAME, body={"query": {"match_all": {}}})
        if len(result['hits']['hits']) == 0:
            return False  # No license key found

        document = result['hits']['hits'][0]['_source']
        encoded_license_key = document['license_key']

        expiry_date = document['expiry_date']

        # Decode the license key
        license_key = base64.b64decode(encoded_license_key).decode()

        # Split the license key into its parts
        fetched_unique_id, fetched_expiry_date, product_name = license_key.split('#')

        # Check if the expiry date has passed
        current_date = datetime.datetime.now()
        fetched_expiry_date = datetime.datetime.strptime(fetched_expiry_date, "%Y-%m-%d-%H-%M-%S")

        if fetched_expiry_date < current_date:
            return [False,fetched_expiry_date]

        return [True ,fetched_expiry_date]

    except:
        return [False , None]

# if __name__ == "__main__":
#     # Generate a license key with an expiry date and encode it
#     encoded_license_key = generate_license_key()
#     print("Generated Encoded License Key:", encoded_license_key)
#     time.sleep(2)
#     for i in range(10):
#         # Validate the license key
#         is_valid = validate_and_decode_license_key_from_db()
#
#         if is_valid:
#             print("License is valid.")
#             # Start other services here
#         else:
#             print("License has expired, is invalid, or has been used.")
#         time.sleep(2)

