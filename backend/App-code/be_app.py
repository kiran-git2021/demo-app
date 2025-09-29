from fastapi import FastAPI, Depends

import uvicorn
from Modules.license import license
from Modules.auth_module import auth_app
# from Modules.live_module import live_app
# from Modules.engine import engine
# from Modules.inventory_module import inventory
# from Modules.events_log import event_logs
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# from Modules.adaptor_module import adaptor

#adaptor.initialize()

from conf import config

app = FastAPI(debug=False,docs_url="/docs")
origins = ["*"]
# Allow CORS for the Flask frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], # Allow All Methods
    allow_headers=["*"],
)

version = config.version
date = config.date
@app.get("/")
def root():
    try:
        status = license.check_license()[0]
    except:
        status = False
    #license_status_msg = " OK :)" if status else " Expired :("
    license_status_msg = " Active :)" if status else " Expired :("
    return f"Backend 'Running' Version: '{version}' last updated on '{date}' | License is '{license_status_msg}' | Managed by Flexer"

app.include_router(license.router, prefix="/license")
app.include_router(auth_app.router, prefix="/auth", dependencies=[Depends(license.lock_service)])
# app.include_router(live_app.router, prefix="/live", dependencies=[Depends(license.lock_service)])
# app.include_router(engine.router, prefix="/engine", dependencies=[Depends(license.lock_service)])
# app.include_router(inventory.router, prefix="/inventory", dependencies=[Depends(license.lock_service)])
# app.include_router(event_logs.router, prefix="/event_logs", dependencies=[Depends(license.lock_service)])
# app.include_router(adaptor.router, prefix="/adaptors", dependencies=[Depends(license.lock_service)])


# --- Models ---
class Stat(BaseModel):
    title: str
    value: str
    diff: int

class TableRow(BaseModel):
    id: str
    amount: float
    status: str
    email: str

# --- Sample Data ---
stats_data = [
    {"title": "Total", "value": "13,456", "diff": 34},
    # {"title": "Revenue", "value": "$4,145", "diff": -13},
    # {"title": "Coupons usage", "value": "745", "diff": 18},
]

table_data = [
    {"id": "728ed52f", "amount": 100, "status": "pending", "email": "m@example.com"},
    {"id": "a123b456", "amount": 250, "status": "completed", "email": "jane@example.com"},
    {"id": "c789d012", "amount": 400, "status": "failed", "email": "john@example.com"},
]
# --- Routes ---
@app.get("/stats")
async def get_stats():
    return stats_data

@app.get("/table")
async def get_table_data():
    return table_data

if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=int(config.port))
    print("Backend Started")



