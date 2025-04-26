import time
import board
import busio
from adafruit_ads1x15.ads1115 import ADS1115
from adafruit_ads1x15.analog_in import AnalogIn

# Initialize I2C and ADS1115
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS1115(i2c)
chan = AnalogIn(ads, 3)  # A3 channel

# Function to take multiple readings and calculate the average
def read_average(samples=10, delay=0.2):
    readings = []
    for _ in range(samples):
        value = chan.value
        readings.append(value)
        time.sleep(delay)
    avg = sum(readings) // len(readings)  # Integer division for simplicity
    return avg

# Automatic calibration: measure dry and wet soil values
def calibrate_soil_sensor():
    print("=== Soil Moisture Sensor Calibration ===\n")

    print("Measuring dry soil value (sensor out of soil)...")
    dry_reference = read_average()  # Dry value (sensor out of soil)
    print(f"Dry reference value: {dry_reference}")

    print("Measuring wet soil value (sensor inserted into soil)...")
    wet_reference = read_average()  # Wet value (sensor in soil or water)
    print(f"Wet reference value: {wet_reference}")

    # Calculate the threshold dynamically
    threshold = (dry_reference + wet_reference) // 2
    print(f"Calibration complete!")
    print(f"  Dry Reference: {dry_reference}")
    print(f"  Wet Reference: {wet_reference}")
    print(f"  → Using threshold: {threshold}")
    return threshold

# Call the calibration function to set the threshold
threshold = calibrate_soil_sensor()

# Function to determine the wet/dry level based on the threshold
def wet_dry_level(soil_value):
    return "DRY" if soil_value > threshold else "WET"

# Function to read the soil value and determine its status
def read_soil():
    soil_value = chan.value
    status = wet_dry_level(soil_value)
    return {"value": soil_value, "level": status}

# Optional: Continuous monitoring for live data (if desired in a loop)
def live_monitoring():
    try:
        while True:
            soil_data = read_soil()
            print(f"Raw Value: {soil_data['value']} \t Wet-Dry Level: {soil_data['level']}")
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nExiting the program. Bye!")
