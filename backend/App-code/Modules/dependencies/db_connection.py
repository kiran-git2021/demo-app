# database.py
from elasticsearch import Elasticsearch

ELASTICSEARCH_URL = "http://localhost:9200"

es = Elasticsearch([ELASTICSEARCH_URL],timeout=10)



