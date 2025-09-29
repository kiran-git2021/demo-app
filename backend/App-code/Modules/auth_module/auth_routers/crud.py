from datetime import datetime
from .models import User,CreateUser
from .database import es,INDEX_NAME
import uuid

from Modules.dependencies import logging
logger = logging.setup_logger(module="engine")


#login
def create_user(user: CreateUser):
    # Generate a unique ID for a new user
    user_data = user
    user_data["uuid"] = str(uuid.uuid4())
    user_data["created_on"] = datetime.now()
    logger.info(user_data)
    logger.info(INDEX_NAME)
    es.index(index=INDEX_NAME, body=user_data)
    return User(**user_data)
