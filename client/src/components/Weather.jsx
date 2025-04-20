import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import { showToast } from "../utils/toastNotifications";
import externalApi from "../api/externalApi";
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaWater,
  FaWind,
  FaCloudSun,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { WiBarometer } from "react-icons/wi";

const Weather = () => {
  const [city, setCity] = useState("Quezon City");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch(); // Auto-fetch for default city
  }, []);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async () => {
    if (!city.trim()) {
      showToast("Please enter a city name", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await externalApi.getWeather({ city });
      setWeatherData(response.data);
    } catch (error) {
      showToast("Failed to fetch weather data or Input a right City", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        🌿 Weather Dashboard
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="w-full sm:flex-1">
          <TextInput name="city" value={city} onChange={handleChange} />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 shadow-lg rounded-2xl p-6">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-green-800">
              {weatherData.location}, {weatherData.country}
            </h3>
            <p className="text-green-700 capitalize mb-2 flex items-center">
              <FaCloudSun className="inline mr-2 " /> {weatherData.weather_main}{" "}
              - {weatherData.weather_description}
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <FaTemperatureHigh className="mr-2 animate-pulse" /> Temp:{" "}
              {weatherData.temperature}°C
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <FaTemperatureLow className="mr-2 animate-pulse" /> Feels like:{" "}
              {weatherData.feels_like}°C
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <FaWater className="mr-2 " /> Humidity: {weatherData.humidity}%
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <WiBarometer className="mr-2 animate-pulse" /> Pressure:{" "}
              {weatherData.pressure} hPa
            </p>
          </div>
          <div>
            <p className="text-green-700 mb-1 flex items-center">
              <FaWind className="mr-2 " /> Wind Speed: {weatherData.wind_speed}{" "}
              m/s
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <FaCloudSun className="mr-2 " /> Cloudiness:{" "}
              {weatherData.cloudiness}%
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <FaSun className="mr-2 " /> Sunrise: {weatherData.sunrise}
            </p>
            <p className="text-green-700 mb-1 flex items-center">
              <FaMoon className="mr-2 " /> Sunset: {weatherData.sunset}
            </p>
          </div>
        </div>
      )}

      {!weatherData && !loading && (
        <div className="text-center text-red-600 mt-6 text-lg font-semibold">
          No Weather available
        </div>
      )}
    </div>
  );
};

export default Weather;
