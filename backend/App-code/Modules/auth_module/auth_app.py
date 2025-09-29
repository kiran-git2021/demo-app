#----------------
# Date : 16-05-2024
# Version: 0.2
#
#----------------
from fastapi import FastAPI, HTTPException, Depends,APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from datetime import datetime , timedelta
import random
import uvicorn
import rsa
from Modules.auth_module.auth_routers.database import es,create_index,INDEX_NAME
from Modules.auth_module.auth_routers.crud import create_user

from Modules.dependencies import logging
from conf import config as cfg

logger = logging.setup_logger()

router = APIRouter()
# origins = ["*"]
# # Allow CORS for the Flask frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

#############
from Modules.auth_module.auth_routers.keycloak_connect import KeycloakClient

kc = KeycloakClient()

# # # --- Get OpenID connection ---
# token = kc.openid.token("admin", "Admin@flexeron")
# # token = kc.openid.token("connected_user", "admin")
# # token = kc.openid.token("admin", "admin")
#
# print(token["access_token"])
# # # print("User token:", token["access_token"][:40], "...")
#
# # --- Get Admin connection ---
# admin = kc.get_admin()
# users = admin.get_users()
# print("Total users in realm:", len(users))

##########




global_access_token = "nMEgCQQCFfzG2l2NQLBheyE1h6Z1fjP71EqnIFY31iDuHa25dMItAVw/Uqs0N94jQ\ntJkhV2g0zi5qE63dskgpKEHGaY7xAgMBAAE="

@router.get("/status")
def auth_home():
    logger.info("welcome to auth service..")
    return "welcome to auth service.."


def validateApiKey(apiKey):
    if apiKey == cfg.API_KEY:
        return {"code":200,"message":"success"}
    else:
        return {"code":401,"message":"Unauthorized"}


class Credentials(BaseModel):
    username: str
    password: str


### ~~~~Secured Authentication~~~~ ####
class PublicKeyPayload(BaseModel):
    ApiKey : str

publicKey_PEM, privateKey_PEM = rsa.newkeys(nbits=512,accurate=True)
PublicKey = publicKey_PEM.save_pkcs1('PEM')

@router.post("/GetPublicKey")
def get_key(data:PublicKeyPayload):
    validKey = validateApiKey(data.ApiKey)
    if validKey['code'] == 200:
        return {'code':200,'PublicKey':PublicKey}
    else:
        return validKey

class AuthenticatePublicKeyPayload(BaseModel):
    PublicKey : str

@router.post("/AuthenticatePublicKey")
def authenticate_key(data:AuthenticatePublicKeyPayload):
    validKey = validateApiKey(data.ApiKey)
    if validKey['code'] == 200:
        return {'code':200,'PublicKey':PublicKey}
    else:
        return validKey

### ~~~~Secured Authentication~~~~ ####
@router.post("/GetUserAccessToken")
def get_user_token(credentials: Credentials):
    logger.info("GetUserToken | es connection status "+str(es.ping()))
    try:
        try:
            token = kc.openid.token(credentials.username, credentials.password)
            if token:
                return JSONResponse(status_code=201, content={"code": 201,"status": "success","message":"authentication success","ApiKey":"FLEXER5544332211AA",**token})
            else:
                logger.info("Failed to Generate Token | Invalid Credentials")
                return JSONResponse(status_code=401, content={"code": 401,"status": "failed","message":"Invalid Credentials"})
        except Exception as e:
            logger.info("Token Generation Exception : {} ".format(str(e)))
            return JSONResponse(status_code=401, content={"code": 401,"status": "failed","message":"Invalid Credentials"})

    except Exception as e:
        logger.info("API Exception : {} ".format(str(e)))
        return JSONResponse(status_code=500,content="Internal Server Error")

class TokenVal(BaseModel):
    access_token: constr(strict=True, min_length=5, max_length=10000)

@router.post("/ValidateToken")
def validate_token(Payload: TokenVal):
    #logger.info("ValidateToken | es connection status " + str(es.ping()))
    token = Payload.access_token
    try:
        validate  = kc.openid.introspect(token)
        logger.info("Validate Token {}".format(validate))
        if validate['active'] :
            if "resource_access" in validate:
                return JSONResponse(status_code=200,
                                    content={"code": 200, "status": "success", "message": "Token Is Valid",
                                             "roles": validate['resource_access']})

            else:
                return JSONResponse(status_code=200,
                                    content={"code": 200, "status": "success", "message": "Token Is Valid",
                                             "roles": "No Roles Found"})

        else:
            return JSONResponse(status_code=401, content={"code": 200,"status": "failed","message":"User Token Invalid"})
    except Exception as e:
        logger.info("Failed to Validate Token {}".format(str(e)))
        return JSONResponse(status_code=401, content="Unauthorized")

class CreateCredentials(BaseModel):
    firstname: str
    lastname: str
    email: str = "abc@example.com"
    username: str
    password: str
    role:list = []
    access_token: str

@router.post("/CreateUser")
def creatuser(userInfo: CreateCredentials):
    logger.info("Creating User..")

    try:
        if es.ping():
            if userInfo.access_token == global_access_token:
                existing_user = es.search(index=INDEX_NAME, body={
                    "query": {
                        "bool": {
                            "must": [
                                {"match": {"username": userInfo.username}},
                                #{"match": {"password": credentials.password}}
                            ]
                        }
                    }
                })
                logger.info("existing user : {}".format(existing_user))
                if existing_user['hits']['total']['value'] > 0:
                    logger.info("user already exist")
                    return JSONResponse(status_code=401, content="user already exist")
                else:
                    # count = es.search(index=INDEX_NAME, body={
                    #     "query": {
                    #         "match_all": {}
                    #     },
                    #     "size": 0
                    # })['hits']['total']['value']

                    data = {}

                    # data = {'username':userInfo.username,'password':userInfo.password,
                    #         'email':userInfo.email, 'role':userInfo.role}
                    userInfo_Dict = userInfo.__dict__  # convert into dict

                    for i in userInfo_Dict:
                        if i in ['firstname', 'lastname']:
                            data[i] = userInfo_Dict[i].capitalize()
                        else:
                            data[i] = userInfo_Dict[i]
                    print(data)
                    response = create_user(data)
                    print(">>",response)
                    if response.username == userInfo.username:
                        logger.info("User created successfully")
                        return JSONResponse(status_code=201, content={"status":"User created successfully"})

                    else:
                        logger.info("Something went wrong while creating user")
                        return JSONResponse(status_code=401, content={"status": "Something went wrong"})
            else:
                logger.info("Invalid access token used")
                return JSONResponse(status_code=401, content="Invalid access token")
        else:
            logger.info("es connection error")
            return JSONResponse(status_code=401, content="connection error")
    except Exception as e:
        logger.info("API Exception : {} ".format(str(e)))
        return JSONResponse(status_code=500, content="Internal Server Error")

@router.get("/FetchAllUsers")
def fetchAllusers():
    logger.info("Fetching Users...")
    try:
        if es.ping():
            existing_users = es.search(index=INDEX_NAME, body={
                "query": {
                    "match_all": {
                    }
                }
            })
            users = []
            if existing_users['hits']['hits']:
                for i in existing_users['hits']['hits']:
                    logger.info(i['_source'])
                    users.append(i['_source'])
                logger.info("users : {}".format(users))
                users_output = []
                for i in users:
                    temp_dict = {}
                    for j in i:
                        if j in ["firstname", "lastname", "username", "email", "phone", "role", "created_on"]:
                            temp_dict[j] = i[j]
                    users_output.append(temp_dict)

                return JSONResponse(status_code=200, content=users_output)
            else:
                logger.info("No Users Found")
                return JSONResponse(status_code=404, content="No Users")
        else:
            logger.info("es connection error")
            return JSONResponse(status_code=401, content="connection error")
    except Exception as e:
        logger.info("API Exception : {} ".format(str(e)))
        return JSONResponse(status_code=500,content="Internal Server Error")

class UserInfo(BaseModel):
    username: str
    access_token: str

@router.post("/FetchUserDetails")
def fetchUserDetails(Payload:UserInfo):
    logger.info("Fetching Users...")
    username = Payload.username
    try:
        if es.ping():
            existing_users = es.search(index=INDEX_NAME, body={
                "query": {
                        "bool": {
                            "must": [
                                {"match": {"username": username}},
                            ]
                        }
                    }
                })
            users = []
            if existing_users['hits']['hits']:
                for i in existing_users['hits']['hits']:
                    logger.info(i['_source'])
                    users.append(i['_source'])
                logger.info("users : {}".format(users))
                users_output = []
                for i in users:
                    temp_dict = {}
                    for j in i:
                        if j in ["firstname", "lastname", "username", "email", "phone", "role", "created_on"]:
                            temp_dict[j] = i[j]
                    users_output.append(temp_dict)
                return JSONResponse(status_code=200, content= users_output[0])
            else:
                logger.info("No User Found")
                return JSONResponse(status_code=404, content="No Users Found")
        else:
            logger.info("es connection error")
            return JSONResponse(status_code=401, content="connection error")
    except Exception as e:
        logger.info("API Exception : {} ".format(str(e)))
        return JSONResponse(status_code=500,content="Internal Server Error")

class deleteUser(BaseModel):
    username: str
    access_token: str

@router.delete("/delete_user")
async def delete_user(payload:deleteUser):
    try:
        username = payload.username
        access_token = payload.access_token
        if access_token not in [global_access_token]:
            return JSONResponse(status_code=401, content="Access Denied")

        if username in ['admin','user']:
            logger.info(f"Deleting user with username: {username} is not allowed")
            return JSONResponse(status_code=401, content=f"Deleting username '{username}' is not allowed...")

        logger.info(f"Deleting user with username: {username}...")
        if es.ping():
            # Search for the user by username to get their ID
            search_response = es.search(index=INDEX_NAME, body={
                "query": {
                    "match": {
                        "username": username
                    }
                }
            })
            if not search_response['hits']['hits']:
                logger.info(f"User with username {username} not found.")
                return JSONResponse(status_code=404, content="User not found")

            user_id = search_response['hits']['hits'][0]['_id']

            # Delete the user by ID
            delete_response = es.delete(index=INDEX_NAME, id=user_id)
            if delete_response['result'] == 'deleted':
                logger.info(f"User with username {username} deleted successfully.")
                return JSONResponse(status_code=200, content="User deleted successfully")
            else:
                logger.error(f"Failed to delete user with username {username}.")
                return JSONResponse(status_code=404, content="User not found")
        else:
            logger.error("Elasticsearch connection error")
            return JSONResponse(status_code=401, content="Connection error")

    except Exception as e:
        logger.info("API Exception : {} ".format(str(e)))
        return JSONResponse(status_code=500,content="Internal Server Error")