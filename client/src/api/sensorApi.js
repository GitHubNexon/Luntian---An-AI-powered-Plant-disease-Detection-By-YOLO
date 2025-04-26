import { API_BASE_URL } from "./config_sensor";

// Utility function to handle EventSource connection
const sensorApi = {
  connectSensorStream: (onData) => {
    const eventSource = new EventSource(`${API_BASE_URL}/sensor-stream`);

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      onData(data); // Pass data to the callback function
    };

    eventSource.onerror = function (err) {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return eventSource; // Return the EventSource instance for later cleanup
  },
};

export default sensorApi;
