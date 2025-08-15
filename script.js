// 1. Get references to the input, button, and display area
const cityInput = document.getElementById('city');
const searchBtn = document.getElementById('search');
const weatherDiv = document.getElementById('weather');

// 2. Weather code to emoji mapping
const weatherIcons = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
    45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌧️",
    61: "🌦️", 63: "🌧️", 65: "🌧️",
    71: "🌨️", 73: "🌨️", 75: "❄️", 77: "❄️",
    80: "🌦️", 81: "🌧️", 82: "🌧️",
    85: "🌨️", 86: "❄️",
    95: "⛈️", 96: "⛈️", 99: "⛈️"
};

// 3. Weather code to description mapping
const weatherDescriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
};

// 4. Add click event to the button
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") {
        weatherDiv.innerHTML = "Please enter a city name.";
        return;
    }
    getWeather(cityName);
});

// 5. Function to get weather for a city
async function getWeather(city) {
    weatherDiv.innerHTML = "Loading...";

    try {
        // Get latitude & longitude
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherDiv.innerHTML = "City not found.";
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const placeName = geoData.results[0].name;

        // Get current weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const temp = weatherData.current.temperature_2m;
        const code = weatherData.current.weather_code;
        const icon = weatherIcons[code] || "❓";
        const description = weatherDescriptions[code] || "Unknown weather";

        // Display result with icon and description
        weatherDiv.innerHTML = `
      <h2>${placeName}</h2>
      <p style="font-size: 2rem;">${icon}</p>
      <p>${description}</p>
      <p>Temperature: ${temp}°C</p>
    `;
    } catch (error) {
        weatherDiv.innerHTML = "Error fetching weather data.";
        console.error(error);
    }
}
