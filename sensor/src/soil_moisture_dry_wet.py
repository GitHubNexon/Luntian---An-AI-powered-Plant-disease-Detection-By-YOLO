"""
This Raspberry Pi code was developed by newbiely.com
This Raspberry Pi code is made available for public use without any restriction
For comprehensive instructions and wiring diagrams, please visit:
https://newbiely.com/tutorials/raspberry-pi/raspberry-pi-soil-moisture-sensor
"""


import time
import Adafruit_ADS1x15

# Create an ADS1115 ADC object
adc = Adafruit_ADS1x15.ADS1115()

# Set the gain to ±4.096V (adjust if needed)
GAIN = 1

# Single threshold for wet/dry classification (adjust as needed)
THRESHOLD = 45000

# Function to determine the wet-dry level based on the soil moisture percentage
def wet_dry_level(soil_moisture):
    if soil_moisture > THRESHOLD:
        return "DRY"
    else:
        return "WET"

# Main loop to read the analog value from the soil moisture sensor
try:
    while True:
        # Read the raw analog value from channel A3
        raw_value = adc.read_adc(3, gain=GAIN)

        # Determine the wet-dry level based on the raw ADC value
        level = wet_dry_level(raw_value)

        # Print the results
        print("Raw Value: {} \t Wet-Dry Level: {}".format(raw_value, level))

        # Add a delay between readings (adjust as needed)
        time.sleep(1)

except KeyboardInterrupt:
    print("\nExiting the program.")
