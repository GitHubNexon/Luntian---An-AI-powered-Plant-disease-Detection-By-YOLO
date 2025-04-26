import React, { useEffect, useState } from "react";
import { FaSeedling, FaThermometerHalf } from "react-icons/fa";
import sensorApi from "../api/sensorApi"; // Adjust the import path as necessary

const Soil = () => {
  const [soilData, setSoilData] = useState(null);
  const [dhtData, setDhtData] = useState(null);

  useEffect(() => {
    // Connect to the sensor stream using sensorApi
    const eventSource = sensorApi.connectSensorStream((data) => {
      setSoilData(data.soil);  // Assuming soil data is an object with value & level
      setDhtData(data.dht);    // Assuming DHT data is an object with temperature & humidity
    });

    return () => {
      eventSource.close();  // Clean up the connection on component unmount
    };
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Soil Moisture Card */}
        <div className="bg-green-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 flex justify-center items-center gap-2 text-green-700">
            <FaSeedling /> Soil Moisture
          </h2>
          {soilData ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-green-800">
                Moisture Level: {soilData.level}
              </p>
              <p className="text-xl text-green-600">Value: {soilData.value}</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading soil data...</p>
          )}
        </div>

        {/* Temperature and Humidity Card */}
        <div className="bg-blue-100 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 flex justify-center items-center gap-2 text-blue-700">
            <FaThermometerHalf /> Temperature & Humidity
          </h2>
          {dhtData ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-800">
                Temperature: {dhtData.temperature}°C
              </p>
              <p className="text-xl text-blue-600">Humidity: {dhtData.humidity}%</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading DHT22 data...</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Soil;
