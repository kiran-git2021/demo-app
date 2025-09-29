# database.py
from elasticsearch import Elasticsearch
from conf import config

ELASTICSEARCH_URL = config.elasticsearch_url

INDEX_NAME = "connected_device_data"

es = Elasticsearch([ELASTICSEARCH_URL])

def create_index(INDEX_NAME):
    try:
        if not es.indices.exists(index=INDEX_NAME):
            es.indices.create(index=INDEX_NAME)
    except Exception as e:
        pass

create_index(INDEX_NAME)

#print(es.ping())