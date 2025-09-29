import time

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import Optional
import os
import json

from Modules.adaptor_module.adaptors.mqtt_adaptor import MQTTClientThread
from conf import config
from Modules.dependencies import logging
import threading

logger = logging.setup_logger()
router = APIRouter()

#SETTINGS_FILE = "app-be/conf/adaptor_settings.json"
SETTINGS_FILE = "conf/adaptor_settings.json"

ADMIN_PASSWORD = "admin"
mqtt_client = None

# ------------------- MODELS ------------------- #
class AdaptorSettings(BaseModel):
    mqtt_enabled: Optional[bool] = False
    mqtt_broker: Optional[str] = ""
    mqtt_port: Optional[str] = ""
    mqtt_topic: Optional[str] = ""
    mqtt_username: Optional[str] = ""
    mqtt_password: Optional[str] = ""
    web_enabled: Optional[bool] = False
    web_protocol: Optional[str] = "https"
    web_endpoint: Optional[str] = ""

class SettingsPayload(BaseModel):
    admin_password: str
    adaptor_settings: AdaptorSettings

# ------------------- SETTINGS I/O ------------------- #
def load_settings():
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE) as f:
                return json.load(f)
        except json.JSONDecodeError:
            logger.error("Failed to parse adaptor_settings.json")
            return {"adaptor_settings": {}}
    return {"adaptor_settings": {}}

def save_settings(data: dict):
    try:
        with open(SETTINGS_FILE, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        logger.error(f"Failed to save settings: {e}")
        return False
    return True

# ------------------- ADAPTOR CONTROL ------------------- #
def connect_mqtt_if_enabled(settings: dict):
    global mqtt_client

    if not settings.get("mqtt_enabled"):
        logger.info("MQTT is disabled. Skipping connection.")
        if mqtt_client and mqtt_client.is_alive():
            logger.info("Stopping existing MQTT client as it is now disabled...")
            mqtt_client.stop()
            mqtt_client = None
        return

    try:
        # Stop previous client if running
        if mqtt_client and mqtt_client.is_alive():
            logger.info("Stopping existing MQTT client before starting new one...")
            mqtt_client.stop()
            mqtt_client = None

        # Load new settings into config
        config.mqtt_broker = settings.get("mqtt_broker", config.mqtt_broker)
        config.mqtt_port = int(settings.get("mqtt_port", config.mqtt_port))
        config.mqtt_topic = settings.get("mqtt_topic", config.mqtt_topic)
        config.mqtt_username = settings.get("mqtt_username", config.mqtt_username)
        config.mqtt_password = settings.get("mqtt_password", config.mqtt_password)

        # Create and start new MQTT client
        mqtt_client = MQTTClientThread(
            broker=config.mqtt_broker,
            port=config.mqtt_port,
            topic=config.mqtt_topic,
            username=config.mqtt_username,
            password=config.mqtt_password,
        )
        mqtt_client.start()

        logger.info(f" MQTT client started for {config.mqtt_broker}:{config.mqtt_port}")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("👋 Stopping MQTT thread...")
            mqtt_client.stop()

    except Exception as e:
        logger.error(f" Failed to start MQTT client: {e}")


# ------------------- ROUTES ------------------- #
@router.get("/")
def auth_home():
    logger.info("Welcome to adaptor service.")
    return JSONResponse(content={"message": "Welcome to adaptor service."}, status_code=200)

@router.get("/settings/fetch")
async def get_settings():
    try:
        settings = load_settings()
        return JSONResponse(content=settings, status_code=200)
    except Exception as e:
        logger.error(f"Failed to load settings: {e}")
        return JSONResponse(content={"error": "Failed to load settings"}, status_code=500)

@router.post("/settings/save")
async def update_settings(payload: SettingsPayload):
    try:
        if payload.admin_password != ADMIN_PASSWORD:
            logger.warning("Unauthorized settings update attempt")
            return JSONResponse(content={"error": "Invalid admin password"}, status_code=403)

        current_data = load_settings()
        current_data["adaptor_settings"] = payload.adaptor_settings.dict()

        if not save_settings(current_data):
            return JSONResponse(content={"error": "Error saving settings"}, status_code=500)

        connect_mqtt_if_enabled(payload.adaptor_settings.dict())
        return JSONResponse(content={"success": True}, status_code=200)

    except ValidationError as ve:
        logger.error(f"Validation error: {ve}")
        return JSONResponse(content={"error": "Invalid data format"}, status_code=422)

    except Exception as e:
        logger.error(f"Unexpected error during settings update: {e}")
        return JSONResponse(content={"error": "Internal server error"}, status_code=500)

# initialize
def initialize():
    print("Initializing Adaptor")
    settings_default = load_settings()
    print(settings_default)
    logger.info("loading mqtt settings : ".format(str(settings_default)))
    connect_mqtt_if_enabled(settings_default['adaptor_settings'])

