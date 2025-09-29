# models.py
from pydantic import BaseModel, Extra
#from typing import Dict, Any


## Login
class CreateUser(BaseModel):
    username: str
    password: str
    class Config:
        extra = Extra.allow

class User(BaseModel):
    class Config:
        extra = Extra.allow


