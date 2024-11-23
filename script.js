const apiKey = 'a3da2a49ca0fe6bf026367c33b7471c3'; // Replace with your actual API key
let unit = 'metric'; // Default unit for temperature
const searchHistory = [];

document.getElementById('get-weather').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    }
});

document.getElementById('get-location').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(`lat=${lat}&lon=${lon}`); // Use latitude and longitude
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

// Toggle between Celsius and Fahrenheit
document.getElementById('toggle-unit').addEventListener('click', function() {
    unit = unit === 'metric' ? 'imperial' : 'metric'; // Toggle unit
    this.textContent = unit === 'metric' ? 'Toggle °C/°F' : 'Toggle °F/°C'; // Update button text
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city); // Fetch weather again with the new unit
    }
});

function getWeather(location) {
    const weatherResult = document.getElementById('weather-result');
    const loading = document.getElementById('loading');
    weatherResult.innerHTML = '';
    loading.classList.remove('hidden');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('City not found or invalid coordinates');
            return response.json();
        })
        .then(data => {
            const temp = data.main.temp;
            const weatherDescription = data.weather[0].description;
            const icon = data.weather[0].icon; // Get weather icon code
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            weatherResult.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}">
                <p>Temperature: ${temp}°${unit === 'metric' ? 'C' : 'F'}</p>
                <p>Weather: ${weatherDescription}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `;

            // Add to search history
            addToHistory(location);
        })
        .catch(error => {
            weatherResult.innerHTML = error.message;
        })
        .finally(() => {
            loading.classList.add('hidden'); // Hide loading after fetching
        });
}

function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        const historyContainer = document.getElementById('search-history');
        const historyItem = document.createElement('div');
        historyItem.textContent = city;
        historyItem.classList.add('history-item');
        historyItem.onclick = () => getWeather(city); // Fetch weather for history item
        historyContainer.appendChild(historyItem);
    }
}
