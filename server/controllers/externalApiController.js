require("dotenv").config();
const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res
        .status(400)
        .json({ error: "City is required in the request body." });
    }

    const apiKey = process.env.OPEN_WEATHER_API;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    res.status(200).json({
      location: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      weather_main: data.weather[0].main,
      weather_description: data.weather[0].description,
      wind_speed: data.wind.speed,
      cloudiness: data.clouds.all,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

module.exports = {
  getWeather,
};
