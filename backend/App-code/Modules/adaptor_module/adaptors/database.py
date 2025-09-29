from elasticsearch import Elasticsearch
from conf import config

from Modules.dependencies import logging
logger = logging.setup_logger()

ELASTICSEARCH_URL = config.elasticsearch_url

INDEX_NAME1 = "connected_device_data_raw"
INDEX_NAME2 = "connected_device_data"

TS_FIELD_MAPPING = {
    "mappings": {
        "properties": {
            "TS": {
                "type": "date",
                "format": "epoch_millis"
            }
        }
    }
}
try:
    es = Elasticsearch([ELASTICSEARCH_URL], request_timeout=5)
except:
    es = "Connection failed"
    logger.info("Database Connection Failed")

def create_index(INDEX_NAME):
    try:
        if not es.indices.exists(index=INDEX_NAME):
            es.indices.create(index=INDEX_NAME, body=TS_FIELD_MAPPING)  # Add the date mapping for TS
            logger.info(f"Index {INDEX_NAME} created with date mapping for TS.")
        else:
            logger.info(f"Index {INDEX_NAME} already exists.")
    except Exception as e:
        logger.error(f"Failed to create index {INDEX_NAME}: {e}")

# Create indices with proper mapping
create_index(INDEX_NAME1)
create_index(INDEX_NAME2)

# Uncomment for pinging the Elasticsearch to check connection
#print(es.ping())
