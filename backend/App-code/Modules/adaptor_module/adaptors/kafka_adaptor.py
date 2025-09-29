from kafka import KafkaProducer
import json
import ssl

producer = KafkaProducer(
    bootstrap_servers=['kafka.example.com:9093'],
    security_protocol="SSL",
    ssl_cafile="ca.pem",
    ssl_certfile="service.cert",
    ssl_keyfile="service.key",
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_to_kafka(data):
    producer.send('iot-data', value=data)
    producer.flush()
