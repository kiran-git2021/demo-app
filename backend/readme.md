```bash
8000 ---> Front End

8001 ---> BE-Auth APIs
          router1---> auth
          router2---> live_screen
          router3---> engine
```
```bash

Version : 7.0.6

Version : 7.0.4
--> all logo and names are removed
--> Bring Adaptor Configuration Settings Screen - MQTT / HTTP / Other ( in progress )
    a) HTML screen APIs not working
    b) Backend APIs are working

Version : 7.0.3
--> Integrating live mQTT data with LIve module api
--> License Dependency check function improved
--> added GetPublicKey API (used rsa module)
--> changed URL from /GetUserToken to /GetUserAccessToken
--> API Key Added in /GetUserAccessToken
--> access token parameter is added in inventory and event logs modules
--> backend bug fixes , url and API methods corrections ,
--> font end APIs corrections and improvements
--> UI  Improved (Login Page , added logo , dark theme , Bootstrap5, inventory table, event logs )
--> Logo improved
--> Improved Live screen, Event logs , User-mangement
--> Historical API added ( not tested )

Version : 7.0.2
--> improving auth APIs and user table update, adding email and role keys
--> MQTT Adaptor is implemented
--> improved service start code (run.py)
--> improved Licensing , correct API responses and error handling

Version : 7.0.1
1.  All the directories are restructured for future developments
2.  User table, customer table, data table are created
3.  All index names are renamed and updated in code
4.  Data masking added
5.  License expairy added in status and corrected APIs
6.  Minor corrections in crud files , INDEX is retrieved from database files
7.  Bug fixes in creating duplicate user with different password
8.  Left side bar animation transition speed reduced from 0.3 sec to 0.9 sec
9.  Kibana launch issue fixed , and it is working
10. License Status Screen to be added ?
11. Database tables rename
    Users table name    : connected_users
    Customer table name : connected_customers
    Device data table   : connected_device_data
    Inventory table     : connected_items
    License table       : platform_license_key

```



