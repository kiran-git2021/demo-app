# database.py
from elasticsearch import Elasticsearch
from conf import config
from Modules.dependencies import logging
logger = logging.setup_logger()

ELASTICSEARCH_URL = config.elasticsearch_url

INDEX_NAME = "connected_users"

# print(ELASTICSEARCH_URL)
try:
    es = Elasticsearch([ELASTICSEARCH_URL],request_timeout=5)
except Exception as e:
    es = "Connection failed"
    logger.info("Database Connection Failed : {}".format(e))

def create_index(INDEX_NAME):
    try:
        if not es.indices.exists(index=INDEX_NAME):
            es.indices.create(index=INDEX_NAME)
    except Exception as e:
        pass

create_index(INDEX_NAME)

# print(es,es.ping)