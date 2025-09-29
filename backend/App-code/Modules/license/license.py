from fastapi import FastAPI, Depends, APIRouter, HTTPException
from datetime import datetime, timedelta
import time
from pydantic import BaseModel, constr
from typing import Type
from fastapi.responses import JSONResponse

from Modules.license.license_routers.license_operations import validate_and_decode_license_key_from_db, \
    generate_license_key, license_status
from Modules.dependencies import logging
from conf import config as cfg

logger = logging.setup_logger()

router = APIRouter()

version = cfg.version

# Global variables to store license status and last check date
is_valid = False
last_check_date = datetime.now()
expiry = ""


def check_license():
    global is_valid, last_check_date, expiry
    try:
        current_date = datetime.now()
        # Check the license if the current date is different from the last check date
        if current_date > last_check_date:
            fetch_info = validate_and_decode_license_key_from_db()
            is_valid = fetch_info[0]
            expiry = fetch_info[1]
            last_check_date = current_date

        # Convert datetime to string for JSON serialization
        expiry_str = expiry.strftime("%Y-%m-%d %H:%M:%S") if expiry else None

        return [is_valid, expiry_str]

    except Exception as e:
        # Log the error if needed
        logger.error(f"Error checking license: {e}")
        # Return a failure response or a default value
        return [False, None]


# def lock_service():
#     if not check_license()[0]:
#         return JSONResponse(status_code=401, content={"status": "error",
#                                                       "detail": "Oops! service locked since license has expired, please contact support team."})
#     return True

def lock_service():
    if not check_license()[0]:
        raise HTTPException(
            status_code=401,
            detail="Oops! service locked since license is expired, please contact support team."
        )
    return True

#@router.get("/")
@router.get("/status")
def license_stat():
    try:
        if check_license()[0]:
            return JSONResponse(status_code=200,
                                content={"status": "success", "message": "Great! You have a valid license.",
                                         "valid_till": check_license()[1]})
        else:
            return JSONResponse(status_code=401, content={"status": "error",
                                                          "detail": f"License expired on {check_license()[1]}, please contact support team."})
    except Exception as e:
        print(str(e))
        logger.info("exception at license status: {}".format(str(e)))
        return JSONResponse(status_code=401,
                            content={"status": "error", "detail": "License has expired, please contact support team."})

class IgnoredType:
    pass


class LicenseInput(BaseModel):
    days: int = constr(pattern="^[0-9]+$", min_length=1, max_length=20)
    username: str = constr(pattern="^[A-Za-z0-9_]+$", min_length=1, max_length=20)
    password: str = constr(pattern="^[A-Za-z0-9_]+$", min_length=1, max_length=20)


@router.post("/GenerateNewLicense")
def gen_new_license(payload: LicenseInput):
    days = payload.days
    username = payload.username
    pwd = payload.password

    if username == cfg.license_user and pwd == cfg.license_password:
        if days == 0:
            return JSONResponse(status_code=400, content={"status": "error", "detail": "Oops! Invalid days entry."})
        generate_license_key(days)
        time.sleep(5)
        if check_license():
            return JSONResponse(status_code=200, content={"status": "success",
                                                          "message": f" Awesome! You got a new license, it is activated for next {days} days and valid till: {license_status()['expiry_date'][:10]} "})
        else:
            return JSONResponse(status_code=500, content={"status": "error", "detail": "Something went wrong."})
    else:
        return JSONResponse(status_code=401,
                            content={"status": "error", "detail": "Invalid credentials used / access denied."})
