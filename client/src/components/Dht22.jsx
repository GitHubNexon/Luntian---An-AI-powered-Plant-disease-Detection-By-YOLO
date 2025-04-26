import React, { useEffect, useState } from "react";
import sensorApi from "../api/sensorApi";
import { WiHumidity, WiThermometer } from "react-icons/wi";

const Dht22 = () => {
  const [dhtData, setDhtData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorApi.get_dht22();
        setDhtData(data);
      } catch (error) {
        console.error("Error fetching DHT22 data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-blue-100 p-6 rounded-2xl shadow-md w-full max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">DHT22 Sensor Data</h2>
      {dhtData ? (
        <div className="flex justify-around text-blue-800 text-2xl">
          <div className="flex flex-col items-center">
            <WiThermometer size={48} />
            <p>{dhtData.temperature}°C</p>
          </div>
          <div className="flex flex-col items-center">
            <WiHumidity size={48} />
            <p>{dhtData.humidity}%</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Dht22;
