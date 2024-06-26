document.addEventListener('DOMContentLoaded', () => {
    const fetchWeatherButton = document.getElementById('fetchWeatherButton');
    const currentLocationButton = document.getElementById('currentLocationButton');
    const weatherContainer = document.getElementById('weatherContainer');
    const locationInput = document.getElementById('locationInput');
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    const API_KEY = 'ffb36a82c3e70466c7e820e3b579c264'; // Replace with your OpenWeatherMap API key

    fetchWeatherButton.addEventListener('click', () => {
        const location = locationInput.value;
        if (location) {
            fetchWeather(location);
        }
    });

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            });
        }
    });

    const map = L.map('map').setView([20, 0], 2); // Center map at initial view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        fetchWeatherByCoords(lat, lon);
    });

    function fetchWeather(location) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function displayWeather(data) {
        const { main, weather, wind, sys, name } = data;
        const temp = main.temp;
        const feels_like = main.feels_like;
        const humidity = main.humidity;
        const description = weather[0].description;
        const windSpeed = wind.speed;
        const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
        const country = sys.country;

        leftColumn.innerHTML = `
            <p>Location: ${name}, ${country}</p>
            <p>Temperature: ${temp}°C</p>
            <p>Feels Like: ${feels_like}°C</p>
            <p>Humidity: ${humidity}%</p>
        `;

        rightColumn.innerHTML = `
            <p>Conditions: ${description}</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
        `;
    }
});
