# models.py
from pydantic import BaseModel, Extra
from typing import Dict, Any, Optional


## Login
class CreateUser(BaseModel):
    username: str
    password: str
    access_token: str
    class Config:
        extra = Extra.allow

class User(BaseModel):
    access_token: str
    class Config:
        extra = Extra.allow

#Inventory
class Item(BaseModel):
    class Config:
        extra = Extra.allow


class ItemCreate(BaseModel):
    name: str
    count: int
    access_token: str
    class Config:
        extra = Extra.allow
class FetchItem(BaseModel):
    skip: Optional[int] = 0
    limit: Optional[int] = 10000
    access_token: str
    class Config:
        extra = Extra.allow

class UpdateItem(BaseModel):
    name: str
    item_id: int
    access_token: str
    count: int
    description: str

    class Config:
        extra = Extra.allow

class DeleteItem(BaseModel):
    item_id: int
    access_token: str
    class Config:
        extra = Extra.allow

