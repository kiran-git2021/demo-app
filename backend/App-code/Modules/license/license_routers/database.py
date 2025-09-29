# database.py
from elasticsearch import Elasticsearch
from conf import config
from Modules.dependencies import logging
logger = logging.setup_logger()

ELASTICSEARCH_URL = config.elasticsearch_url
INDEX_NAME = 'platform_license_key'



def create_index(INDEX_NAME):
    try:
        if es.ping():
            # Define the mapping with expiry_date as a date field
            mapping = {
                "mappings": {
                    "properties": {
                        "license_key": {"type": "keyword"},
                        "unique_id": {"type": "keyword"},
                        "expiry_date": {"type": "date", "format": "yyyy-MM-dd-HH-mm-ss"},
                        "product_name": {"type": "keyword"}
                    }
                }
            }

            # Create the index with the defined mapping
            if not es.indices.exists(index=INDEX_NAME):
                es.indices.create(index=INDEX_NAME, body=mapping)
        else:
            logger.info("No Database Connection")
    except Exception as e:
        logger.info("Error while creating db index : {}".format(e))
        #pass

try:
    es = Elasticsearch([ELASTICSEARCH_URL],request_timeout=5)
    if es.ping():
        logger.info("Database Connection Success : {} , {}".format(es.ping(),es))
    else:
        logger.info("Database Connection Failed : {} , {}".format(es.ping(), es))
except Exception as e:
    es = "Connection failed"
    logger.info("Database Connection Failed {}".format(e))

if es.ping():
    create_index(INDEX_NAME)

#print(es.ping())