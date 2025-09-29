import time
import json
import threading
import paho.mqtt.client as mqtt

from .database import es, INDEX_NAME1, INDEX_NAME2
from .crud import schema_validation

TAG_MAPPING = {
    "HOUR_RM": 0, "HR_MINUTE_RM": 1, "MAT_VALUE_RM": 2, "MAP_VALUE_RM": 3, "GSP_VALUE_RM": 4,
    "VIB_VALUE_RM": 5, "VIB2_VALUE_RM": 6, "EG1_VALUE_RM": 7, "EG2_VALUE_RM": 8,
    "GSP_LOW_ALARM_RM_INT": 9, "GSP_HIGH_ALARM_RM_INT": 10, "MAT_TRIP_ALARM_RM_INT": 11,
    "MAT_HIGH_ALARM_RM_INT": 12, "MAP_LOW_ALARM_RM_INT": 13, "MAP_HIGH_ALARM_RM_INT": 14,
    "VIB_TRIP_ALARM_RM_INT": 15, "VIB_HIGH_ALARM_RM_INT": 16, "VIB2_TRIP_ALARM_RM_INT": 17,
    "VIB2_HIGH_ALARM_RM_INT": 18, "EGT1_TRIP_ALARM_RM_INT": 19, "EGT1_HIGH_ALARM_RM_INT": 20,
    "EGT2_TRIP_ALARM_RM_INT": 21, "EGT2_HIGH_ALARM_RM_INT": 22, "DFK_ON_RM_INT": 23
}

def process_data(data):
    try:
        processed_data = {
            "TS": data['TS'],
            "ID": data['ID'],
            "AD": data['AD'],
        }

        for tag, index in TAG_MAPPING.items():
            if index < len(data['DATA']):
                processed_data[tag] = data['DATA'][index]

        es.index(index=INDEX_NAME2, body=processed_data)
        print("✅ Data successfully processed and saved.")
        return {"status": "success", "message": "Data successfully processed and saved."}

    except Exception as e:
        print(f"❌ Exception while processing MQTT packet: {str(e)}")
        return {"status": "error", "message": str(e)}


class MQTTClientThread:
    def __init__(self, broker, port, topic, username=None, password=None):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.username = username
        self.password = password
        self._is_connected = False
        self._stop_event = threading.Event()
        self.client = mqtt.Client()
        self.thread = threading.Thread(target=self.run, daemon=True)

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("✅ Connected to MQTT Broker")
            self._is_connected = True

            result, _ = client.subscribe(self.topic)
            if result == mqtt.MQTT_ERR_SUCCESS:
                print(f"🔗 Subscribed to topic: {self.topic}")
            else:
                print(f"❌ Subscription failed with code {result}")

            # Optional: Send a test message
            test_message = {
                "TS": int(time.time() * 1000),
                "ID": "1",
                "AD": "4",
                "DATA": [66, 566, 56, 56, 266, 3, 2, 23, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
            client.publish(self.topic, json.dumps(test_message))
        else:
            print(f"❌ Failed to connect to MQTT Broker: {rc}")

    def on_disconnect(self, client, userdata, rc):
        self._is_connected = False
        print("⚠️ MQTT Disconnected")

    def on_message(self, client, userdata, message):
        try:
            print(f"📨 Raw message received: {message.payload}")

            if not message.payload.strip().startswith(b'{'):
                print("⚠️ Skipping non-JSON message")
                return

            data = json.loads(message.payload.decode())
            print(f"📩 Decoded message: {data}")

            validation = schema_validation(data)
            if validation['status'] == "success":
                es.index(index=INDEX_NAME1, body=validation['data'])
                print("✅ MQTT packet saved to ES")
                process_data(validation['data'])
            else:
                print("⚠️ Validation failed.")

        except json.JSONDecodeError:
            print("❌ Invalid JSON format")
        except Exception as e:
            print(f"❌ Error handling message: {e}")

    def run(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect

        if self.username and self.password:
            print("🔐 Using MQTT authentication")
            self.client.username_pw_set(self.username, self.password)
        else:
            print("🟢 Connecting without authentication")

        while not self._stop_event.is_set():
            try:
                print(f"🚀 Connecting to {self.broker}:{self.port}")
                self.client.connect(self.broker, self.port)
                self.client.loop_forever()
            except Exception as e:
                print(f"❌ MQTT connection error: {e}")
                time.sleep(5)
            finally:
                try:
                    self.client.disconnect()
                except:
                    pass
                self._is_connected = False
                print("🛑 MQTT Client shutting down...")

    def start(self):
        if not self.thread.is_alive():
            self._stop_event.clear()
            self.thread = threading.Thread(target=self.run, daemon=True)
            self.thread.start()

    def stop(self):
        print("🧹 Stopping MQTT Client Thread...")
        self._stop_event.set()
        try:
            self.client.disconnect()
        except:
            pass
        if self.thread.is_alive():
            self.thread.join(timeout=5)

    def is_connected(self):
        return self._is_connected

    def is_alive(self):
        return self.thread.is_alive()


if __name__ == "__main__":
    mqtt_thread = MQTTClientThread(
        broker="broker.hivemq.com",
        port=1883,
        topic="/origin/iot/devices"
    )
    mqtt_thread.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("👋 Stopping MQTT thread...")
        mqtt_thread.stop()
