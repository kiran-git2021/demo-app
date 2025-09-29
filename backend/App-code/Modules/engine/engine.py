from fastapi import APIRouter, HTTPException, status

from Modules.dependencies import logging
logger = logging.setup_logger(module="engine")

router = APIRouter(prefix="")

@router.get("/", status_code=status.HTTP_200_OK)
async def engine_home():
    logger.info("welcome to engine service..")
    return "welcome to engine service.."
