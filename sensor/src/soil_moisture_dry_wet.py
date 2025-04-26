import time
import board
import busio
from adafruit_ads1x15.ads1115 import ADS1115
from adafruit_ads1x15.analog_in import AnalogIn

# Initialize I2C and ADS1115
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS1115(i2c)
chan = AnalogIn(ads, 3)  # A3 channel

def read_average(samples=10, delay=0.2):
    readings = []
    for _ in range(samples):
        value = chan.value
        readings.append(value)
        print(f"  Reading: {value}")
        time.sleep(delay)
    avg = sum(readings) // len(readings)
    print(f"  → Average Value: {avg}\n")
    return avg

# Calibration phase
print("=== Soil Moisture Sensor Calibration ===\n")

input("Step 1: Remove sensor from soil. Press Enter to measure DRY air value...")
dry_reference = read_average()

input("Step 2: Insert sensor into wet soil or water. Press Enter to measure WET value...")
wet_reference = read_average()

threshold = (dry_reference + wet_reference) // 2
print(f"Calibration complete!")
print(f"  Dry Reference: {dry_reference}")
print(f"  Wet Reference: {wet_reference}")
print(f"  → Using threshold: {threshold}")
print("\nStarting live soil monitoring...\n")

# Live monitoring loop
def wet_dry_level(soil_value):
    return "DRY" if soil_value > threshold else "WET"

try:
    while True:
        raw_value = chan.value
        status = wet_dry_level(raw_value)
        print(f"Raw Value: {raw_value} \t Wet-Dry Level: {status}")
        time.sleep(1)

except KeyboardInterrupt:
    print("\nExiting the program. Bye!")
