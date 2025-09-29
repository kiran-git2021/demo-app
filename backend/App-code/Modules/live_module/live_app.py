from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List
from Modules.dependencies import logging
from .database import es

INDEXNAME2 = "connected_device_data"

logger = logging.setup_logger()

router = APIRouter()

@router.get("/")
async def live_home():
    logger.info("Welcome to live service..")
    return "Welcome to live service.."


# Payload schema with required fields list
class TimeRangePayloadLive(BaseModel):
    time_range: int = 1  # Time range in minutes
    parameters: List[str]  # List of required fields (variable names)
    select_all: bool = False  # Whether to select all fields
    access_token: str


# Your Elasticsearch client (make sure 'es' is already defined)
# Example: es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

@router.post("/live_data")
async def live_data(payload: TimeRangePayloadLive):

    if payload.access_token != 'admin':
        return {'code':401, "message":"access denied"}

    time_range_minutes = payload.time_range
    required_fields = payload.parameters
    select_all = payload.select_all

    try:
        current_time = datetime.now()

        # Calculate the start time based on the specified time range
        start_time = current_time - timedelta(minutes=time_range_minutes)

        # Only include _source if specific fields are requested
        if select_all:
            # Do not include `_source` key to fetch all fields
            query = {
                "query": {
                    "range": {
                        "TS": {
                            "gte": int(start_time.timestamp() * 1000),  # Start time in epoch milliseconds
                            "lte": int(current_time.timestamp() * 1000)  # End time in epoch milliseconds
                        }
                    }
                },
                "sort": [
                    {
                        "TS": {
                            "order": "asc"  # Ascending order by timestamp
                        }
                    }
                ],
                "size": 10000  # Limit the result size to 10,000 records
            }
        else:
            # Include `_source` key to specify fields
            source_fields = ["TS"] + required_fields if required_fields else ["TS"]
            query = {
                "query": {
                    "range": {
                        "TS": {
                            "gte": int(start_time.timestamp() * 1000),  # Start time in epoch milliseconds
                            "lte": int(current_time.timestamp() * 1000)  # End time in epoch milliseconds
                        }
                    }
                },
                "sort": [
                    {
                        "TS": {
                            "order": "asc"  # Ascending order by timestamp
                        }
                    }
                ],
                "_source": source_fields,  # Include specific fields
                "size": 10000  # Limit the result size to 10,000 records
            }

        # Perform the search query in Elasticsearch
        response = es.search(index=INDEXNAME2, body=query)

        # Process Elasticsearch response
        data_points = response.get("hits", {}).get("hits", [])

        # Prepare datasets
        datasets = []

        if select_all:
            # If select_all is True, pull all fields from the source data
            all_fields = {field for hit in data_points for field in hit["_source"] if field != "TS"}
            for field in all_fields:
                field_data = [
                    # Only include non-null values
                    round(hit["_source"].get(field, 0), 2) if isinstance(hit["_source"].get(field), (int, float)) and hit["_source"].get(field) is not None
                    else hit["_source"].get(field)
                    for hit in data_points
                ]
                # Remove empty fields from the dataset if all values are null
                if any(field_data):
                    datasets.append({"label": field, "data": field_data})
        else:
            # If select_all is False, use the required fields list
            for field in required_fields:
                field_data = [
                    # Only include non-null values
                    round(hit["_source"].get(field, 0), 2) if isinstance(hit["_source"].get(field), (int, float)) and hit["_source"].get(field) is not None
                    else hit["_source"].get(field)
                    for hit in data_points
                ]
                # Remove empty fields from the dataset if all values are null
                if any(field_data):
                    datasets.append({"label": field, "data": field_data})

        # Prepare final response
        response_data = {
            "status": "success",
            "data": {
                "labels": [int(hit["_source"]["TS"]) for hit in data_points],  # Use the actual timestamps from the data
                "datasets": datasets
            }
        }

        return response_data

    except Exception as e:
        # Log the exception for debugging
        logger.error("Error occurred: %s", str(e))
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

class TimeRangePayloadHist(BaseModel):
    start_time: str
    end_time: str
    parameters: List[str]  # List of required fields (variable names)
    select_all: bool = False  # Whether to select all fields
    access_token: str

@router.post("/historical_data")
async def hist_data(payload: TimeRangePayloadHist):

    if payload.access_token != 'admin':
        return {'code': 401, "message": "access denied"}

    try:
        # Fix: Use correct datetime format, e.g. ISO 8601, "2024-10-01T00:00:00"
        start_time = datetime.strptime(payload.start_time, "%Y-%m-%dT%H:%M:%S")
        end_time = datetime.strptime(payload.end_time, "%Y-%m-%dT%H:%M:%S")

        required_fields = payload.parameters
        select_all = payload.select_all

        # Build initial query body without size (scroll requires size)
        source_fields = None
        if not select_all:
            source_fields = ["TS"] + required_fields if required_fields else ["TS"]

        base_query = {
            "query": {
                "range": {
                    "TS": {
                        "gte": int(start_time.timestamp() * 1000),
                        "lte": int(end_time.timestamp() * 1000)
                    }
                }
            },
            "sort": [{"TS": {"order": "asc"}}],
            "size": 1000  # Scroll batch size
        }

        if source_fields:
            base_query["_source"] = source_fields

        # Initialize scroll
        scroll_time = "2m"  # keep scroll context alive for 2 minutes

        response = es.search(index=INDEXNAME2, body=base_query, scroll=scroll_time)
        scroll_id = response["_scroll_id"]
        hits = response["hits"]["hits"]

        all_hits = hits.copy()

        # Scroll loop to fetch all matching documents
        while len(hits) > 0:
            response = es.scroll(scroll_id=scroll_id, scroll=scroll_time)
            scroll_id = response["_scroll_id"]
            hits = response["hits"]["hits"]
            all_hits.extend(hits)

        # Clear scroll context (good practice)
        es.clear_scroll(scroll_id=scroll_id)

        # Prepare datasets
        datasets = []

        if select_all:
            all_fields = {field for hit in all_hits for field in hit["_source"] if field != "TS"}
            for field in all_fields:
                field_data = [
                    round(hit["_source"].get(field, 0), 2) if isinstance(hit["_source"].get(field), (int, float)) and hit["_source"].get(field) is not None
                    else hit["_source"].get(field)
                    for hit in all_hits
                ]
                if any(field_data):
                    datasets.append({"label": field, "data": field_data})
        else:
            for field in required_fields:
                field_data = [
                    round(hit["_source"].get(field, 0), 2) if isinstance(hit["_source"].get(field), (int, float)) and hit["_source"].get(field) is not None
                    else hit["_source"].get(field)
                    for hit in all_hits
                ]
                if any(field_data):
                    datasets.append({"label": field, "data": field_data})

        response_data = {
            "status": "success",
            "data": {
                "labels": [int(hit["_source"]["TS"]) for hit in all_hits],
                "datasets": datasets
            }
        }

        return response_data

    except Exception as e:
        logger.error("Error occurred: %s", str(e))
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")