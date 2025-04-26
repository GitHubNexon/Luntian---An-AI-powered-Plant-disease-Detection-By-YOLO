# services/dht22.py
import adafruit_dht
import board
import time

dht_device = adafruit_dht.DHT22(board.D4)

def read_dht22():
    try:
        temperature = dht_device.temperature
        humidity = dht_device.humidity
        return {"temperature": temperature, "humidity": humidity}
    except RuntimeError:
        return {"temperature": None, "humidity": None}
