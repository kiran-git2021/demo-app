from datetime import datetime
from .models import Item, ItemCreate
from .database import es,INDEX_NAME

from Modules.dependencies import logging
logger = logging.setup_logger(module="engine")

# Inventory
def create_item(item: ItemCreate, item_id: int,):
    item_data = item.dict()
    item_data["id"] = item_id
    item_data["created_on"] = datetime.now()
    item_data["updated_on"] = item_data["created_on"]
    es.index(index=INDEX_NAME, id=item_id, body=item_data)
    return Item(**item_data)

def get_item(item_id: int):
    res = es.get(index=INDEX_NAME, id=item_id, ignore=[404])
    if res['found']:
        return Item(**res['_source'])
    return None

def get_items(skip: int = 0, limit: int = 10000):
    res = es.search(index=INDEX_NAME, body={
        "from": skip, "size": limit, "query": {"match_all": {}}
    })
    items = [Item(**hit["_source"]) for hit in res['hits']['hits']]
    return items

def update_item_count(item_id: int, count: int):
    updated_on = datetime.now()
    es.update(index=INDEX_NAME, id=item_id, body={
        "doc": {"count": count, "updated_on": updated_on}
    })
    updated_item = es.get(index=INDEX_NAME, id=item_id)['_source']
    return Item(**updated_item)

def delete_item(item_id):
    es.delete(index=INDEX_NAME, id=item_id)
