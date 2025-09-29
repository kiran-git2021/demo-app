from datetime import datetime
#from .database import es,INDEX_NAME1,INDEX_NAME2
import uuid

from Modules.dependencies import logging
logger = logging.setup_logger(module="adaptor")
from pydantic import BaseModel

# class inputValidate(BaseModel):
#       TS : str
#       ID : str
#       AD : str
#       DATA : list

#login
def schema_validation(data):
    try:
        # Generate a unique ID for a new user
        data_packet = {}
        data_packet['TS'] = data['TS']
        data_packet['ID'] = data['ID']
        data_packet['AD'] = data['AD']
        data_packet['DATA'] = data['DATA']

        data_packet["uuid"] = str(uuid.uuid4())
        data_packet["server_time"] = datetime.now()
        #es.index(index=INDEX_NAME, body=data_packet)
        return {"status":"success","data":data_packet,"error":None}
    except Exception as e:
        print({"status":"failed","data":None,"error":str(e)})
        return {"status":"failed","data":None,"error":str(e)}
