
# ; Sample INI File

# [APP version]
version = "App v7.0.6"
date = "16-09-2025"
author = "RAVIKIRAN"

#License Credentials
license_user = "admin"
license_password = "admin"

#API Settings
API_KEY = "FLEXER5544332211AA" # for M2M Authentication

# ; Global settings
# [Global]
debug = True
timeout = 60

# ; Database settings
# [Database]
es_ip = "127.0.0.1"
es_port = 8001
username = "admin"
password = "secret"
database = "mydb"
elasticsearch_url = "http://127.0.0.1:9200"

# ; Server settings
# [Server]
host = "127.0.0.1"
port = 8001

# MQTT configuration
mqtt_broker = "broker.hivemq.com"
mqtt_port = 1883
mqtt_topic = "origin/iot/devices"
mqtt_username = None
mqtt_password = None

# Logging
log_console_print = True

# Keycloak Settings
keycloak_url = "http://localhost:8080"

realm_name = "OEM"

keycloak_username = "connected_user"
keycloak_password = "admin"

# User client (for OpenID)
client_id = "OEMclient"
client_secret = "c8kbD3662fAkd3NE6uj3Rw23KZ26Wb8N"

# Admin client (for management via service account)
admin_client_id = "admin-cli"
admin_client_secret = "MXB2PGMSAFvzP5H0jLn7XvSn8m44PAgc"


