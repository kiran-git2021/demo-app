# auth_app.py
# routers/items.py
from fastapi import APIRouter, HTTPException, status
import json,os

from Modules.dependencies import logging
from pydantic import BaseModel

logger = logging.setup_logger(module="event_logs")

router = APIRouter(prefix="")

@router.get("/", status_code=status.HTTP_200_OK)
async def event_logs_home():
    logger.info("welcome to event_logs service..")
    return "welcome to event_logs service.."

# @router.get('/fetch_events',status_code=status.HTTP_200_OK)
# async def fetch_events():
#     logger.info("welcome to event_logs service..")
#     with open(os.path.join(os.path.dirname(__file__), '..\\log\\api_transactions.log'), 'r') as file:
#         logs = file.readlines()
#     return {"logs": logs}

class eventPayload(BaseModel):
    access_token : str
@router.post('/fetch_events', status_code=status.HTTP_200_OK)
async def fetch_events(data:eventPayload):
    if data.access_token != 'admin':
        return {'code': 401, "message": "access denied"}
    #logger.info("Welcome to event_logs service..")
    log_file_path = os.path.join(os.path.dirname(__file__), '..\\..\\log\\api_transactions.log')
    
    # Read logs from file
    with open(log_file_path, 'r') as file:
        logs = file.readlines()
    
    # Define a function to parse the timestamp from each log entry
    def parse_timestamp(log):
        # Assuming the timestamp is the first part of the log line and is space-separated
        return log.split(' - ')[0]

    # Sort logs by timestamp in descending order
    logs.sort(key=lambda log: parse_timestamp(log), reverse=True)
    
    return {"logs": logs}