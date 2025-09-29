
from fastapi import APIRouter, HTTPException, status

from Modules.inventory_module.inventory_routers.models import ItemCreate, FetchItem, UpdateItem, DeleteItem
from Modules.inventory_module.inventory_routers.crud import create_item, get_item, get_items, delete_item, update_item_count
from Modules.inventory_module.inventory_routers.database import es, INDEX_NAME

from Modules.dependencies import logging
from pydantic import BaseModel

logger = logging.setup_logger(module="inventory")

router = APIRouter(prefix="")

@router.get("/", status_code=status.HTTP_200_OK)
def engine_home():
    logger.info("welcome to inventory service..")
    return "welcome to inventory service.."


@router.post("/items/create",status_code=status.HTTP_201_CREATED)
def create_item_endpoint(item:ItemCreate):
    if item.access_token != 'admin':
        return {'code': 401, "message": "access denied"}

    logger.info("creating..")
    logger.info(item)
    # Check if item already exists
    if es.ping():
        existing_items = es.search(index=INDEX_NAME, body={
            "query": {
                "match": {
                    "name": item.name
                }
            }
        })
        if existing_items['hits']['total']['value'] > 0:
            existing_item = existing_items['hits']['hits'][0]['_source']
            count = item.count if item.count >= 0 else 0
            count = existing_item['count'] + count  # add count data
            item_id = existing_items['hits']['hits'][0]['_id']
            updated_item = update_item_count(item_id=item_id, count=count)
            return updated_item
        else:
            item.count = item.count if item.count >= 0 else 0
            existing_items = es.search(index=INDEX_NAME, body={
                "aggs": {
                    "max_id": {
                        "max": {
                            "field": "id"
                        }
                    }
                }
            })

            # Extract the maximum ID number
            if existing_items['aggregations']['max_id']['value']:
                max_id = existing_items['aggregations']['max_id']['value']
                item_id = int(max_id + 1)  # increment to next id
                logger.info("created")
                return create_item(item=item, item_id=item_id)
            else:
                item_id = 1
                return create_item(item=item, item_id=item_id)
    else:
        logger.error("internal error")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal error")


# @router.post("/items/{item_id}",status_code=status.HTTP_200_OK)
# def read_item(payload:Item):
#     if payload.access_token != 'admin':
#         return {'code': 401, "message": "access denied"}
#
#     logger.info("fetching..")
#     db_item = get_item(item_id=payload.item_id)
#     if db_item is None:
#         logger.info("Item not found")
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
#     logger.info(db_item)
#     return db_item

@router.post("/items/fetch", status_code=status.HTTP_200_OK)
def read_items(payload:FetchItem):
    logger.info("fetching..")
    if payload.access_token != 'admin':
        return {'code': 401, "message": "access denied"}
    items = get_items(skip=payload.skip, limit=payload.limit)
    logger.info(items)
    return items

@router.put("/items/update", status_code=status.HTTP_200_OK)
def update_item_endpoint(item: UpdateItem):
    if item.access_token != 'admin':
        return {'code': 401, "message": "access denied"}

    logger.info("updating..")
    logger.info(item)
    # Check if item exists or not
    if es.ping():
        existing_items = es.search(index=INDEX_NAME, body={
            "query": {
                "match": {
                    "name": item.name
                }
            }
        })
        if existing_items['hits']['total']['value'] > 0:
            item_id = existing_items['hits']['hits'][0]['_source']['id']
            count = item.count if item.count >= 0 else 0  # only positive count allowed
            updated_item = update_item_count(item_id=item_id, count=count)
            logger.info("item updated")
            return updated_item
        else:
            logger.info("Item not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal error")

@router.delete("/items/delete", status_code=status.HTTP_200_OK)
def delete_item_endpoint(item: DeleteItem):
    if item.access_token != 'admin':
        return {'code': 401, "message": "access denied"}

    logger.info("deleting..")
    logger.info(item.item_id)
    db_item = get_item(item_id=item.item_id)
    if db_item is None:
        logger.info("Item not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    delete_item(item_id=item.item_id)
    logger.info("Item deleted successfully")
    return {"message": "Item deleted successfully"}
