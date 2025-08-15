async function searchCity() {
    const city = document.getElementById("city").value.trim();
    if (city === "") {
        alert("Please enter a city name");
        return;
    }
    getWeather(city);
}

async function getWeather(city) {
    try {
        // 1️⃣ Get coordinates from geocoding API
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            document.getElementById("weather").innerHTML = "City not found!";
            document.getElementById("current-weather").innerHTML = "";
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        // 2️⃣ Get current weather
        const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();

        // Display Current Weather
        const currentIcon = getWeatherIcon(currentData.current_weather.weathercode);
        const currentHtml = `
            <div class="current-weather-box">
                <h2>${geoData.results[0].name}</h2>
                <div class="icon">${currentIcon}</div>
                <p><strong>${currentData.current_weather.temperature}°C</strong></p>
                <p>Wind: ${currentData.current_weather.windspeed} km/h</p>
            </div>
        `;
        document.getElementById("current-weather").innerHTML = currentHtml;

        // 3️⃣ Get daily forecast
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // 4️⃣ Build HTML for the 7-day forecast
        let html = `<h2>7 Day Forecast</h2>`;
        html += `<div class="forecast-container">`;

        const days = weatherData.daily.time;
        const maxTemps = weatherData.daily.temperature_2m_max;
        const minTemps = weatherData.daily.temperature_2m_min;
        const codes = weatherData.daily.weathercode;

        for (let i = 0; i < days.length; i++) {
            const date = new Date(days[i]);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const icon = getWeatherIcon(codes[i]);

            html += `
                <div class="forecast-day">
                    <h3>${dayName}</h3>
                    <div class="icon">${icon}</div>
                    <p>${minTemps[i]}°C / ${maxTemps[i]}°C</p>
                </div>
            `;
        }

        html += `</div>`;
        document.getElementById("weather").innerHTML = html;

    } catch (error) {
        document.getElementById("weather").innerHTML = "Error fetching weather data.";
        document.getElementById("current-weather").innerHTML = "";
        console.error(error);
    }
}

// Weather icon mapping
function getWeatherIcon(code) {
    const icons = {
        0: "☀️",   // Clear sky
        1: "🌤️",  // Mostly clear
        2: "⛅",   // Partly cloudy
        3: "☁️",   // Overcast
        45: "🌫️", // Fog
        48: "🌫️", // Fog
        51: "🌦️", // Light rain
        61: "🌧️", // Rain
        71: "❄️", // Snow
    };
    return icons[code] || "❓";
}
