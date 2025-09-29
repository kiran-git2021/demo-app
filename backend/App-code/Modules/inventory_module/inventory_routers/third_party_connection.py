# routers/third_party.py
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()

async def send_to_third_party(data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post("https://thirdparty.com/api/endpoint", json=data)
        response.raise_for_status()
        return response.json()

@router.post("/send", response_model=dict)
async def send_item_to_third_party(data: dict):
    try:
        response = await send_to_third_party(data)
        return response
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=str(exc))
