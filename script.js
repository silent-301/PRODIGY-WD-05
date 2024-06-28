// script.js

const apiKey = '87558b72433836b3515cb638fa2b3cf5'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const weatherApp = document.querySelector('.weather-app');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const weatherIcon = document.getElementById('weather-icon');
const cityElement = document.getElementById('city');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const pressureElement = document.getElementById('pressure');
const uvIndexElement = document.getElementById('uv-index');
const hourlyForecastList = document.getElementById('hourly-forecast-list');

searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { name, main, weather, wind, sys } = data;
            const temperature = main.temp;
            const description = weather[0].description;
            const humidity = main.humidity;
            const windSpeed = wind.speed;
            const pressure = main.pressure;
            const uvIndex = sys.uvi;

            // Update the UI
            cityElement.textContent = name;
            temperatureElement.textContent = temperature;
            weatherDescriptionElement.textContent = description;
            humidityElement.textContent = humidity;
            windElement.textContent = windSpeed;
            pressureElement.textContent = pressure;
            uvIndexElement.textContent = uvIndex;

            // Update the weather icon
            const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
            weatherIcon.src = iconUrl;

            // Fetch hourly forecast
            fetchHourlyForecast(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchHourlyForecast(city) {
    const url = `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const hourlyForecast = data.list;
            hourlyForecastList.innerHTML = '';

            hourlyForecast.forEach(hourlyData => {
                const { dt, main, weather } = hourlyData;
                const date = new Date(dt * 1000);
                const hour = date.getHours();
                const temperature = main.temp;
                const description = weather[0].description;

                const listItem = document.createElement('li');
                listItem.textContent = `${hour}:00 - ${temperature}°C - ${description}`;
                hourlyForecastList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
        });
}