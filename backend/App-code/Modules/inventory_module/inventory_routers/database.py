# database.py
from elasticsearch import Elasticsearch
from conf import config

from Modules.dependencies import logging
logger = logging.setup_logger()

ELASTICSEARCH_URL = config.elasticsearch_url
INDEX_NAME = "connected_items"

try:
    es = Elasticsearch([ELASTICSEARCH_URL],timeout=5)
except:
    es = "Connection failed"
    logger.info("Database Connection Failed")

def create_index():
    try:
        if not es.indices.exists(index=INDEX_NAME):
            es.indices.create(index=INDEX_NAME, body={
                "mappings": {
                    "properties": {
                        "id": {"type": "integer"},
                        "name": {"type": "text"},
                        "description": {"type": "text"}
                    }
                }
            })
    except Exception as e:
        pass

def create_new_index(INDEX_NAME):
    try:
        if not es.indices.exists(index=INDEX_NAME):
            es.indices.create(index=INDEX_NAME)
    except Exception as e:
        pass

create_index()

#print(es.ping())