import time
import board
import busio
from adafruit_ads1x15.ads1115 import ADS1115
from adafruit_ads1x15.analog_in import AnalogIn

# Initialize I2C
i2c = busio.I2C(board.SCL, board.SDA)

# Create the ADC object
ads = ADS1115(i2c)

# Read from analog channel A3 (use index 3)
chan = AnalogIn(ads, 3)

# Main loop
try:
    while True:
        print("Soil Moisture Raw Value: {:>5}".format(chan.value))
        print("Soil Moisture Voltage: {:.2f} V".format(chan.voltage))
        time.sleep(1)

except KeyboardInterrupt:
    print("\nExiting the program.")
