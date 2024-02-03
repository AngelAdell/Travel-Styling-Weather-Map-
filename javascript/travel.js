const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const apiKey = "df0dc0594d5f2dec8f3c7c2d9c958908";
const cityName = document.getElementById("city-input").value;

// API for current weather and 5-day forecast
const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

// Mapbox API to get coordinates for the entered city
const geocodingApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${mapboxApiKey}`;


// API request to fetch the current weather data
fetch(forecastApiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        // Extract relevant data
        const currentTemperature = data.main.temp;
        const currentWindSpeed = data.wind.speed;
        const currentHumidity = data.main.humidity;
        const currentCity = data.name;

        // weather is an array. [0] represent the first element in the array
        const weatherIcon = data.weather[0].icon; // Get the weather icon code
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

        const weatherIconElement = document.createElement("img");
        weatherIconElement.src = iconUrl;
        const today = new Date(); // Get the current date
        const options = { year: "numeric",
            month: "2-digit", day: "2-digit" }; // Date formatting options

        // Format today's date as "YYYY-MM-DD"
        const formattedToday = today.toLocaleDateString(undefined, options);

        // Update the current weather section in the HTML
        document.getElementById(
            "current-search-term"
        ).textContent = `${currentCity} (${formattedToday})`;
        document
            .getElementById("current-search-term")
            .appendChild(weatherIconElement);
        document.getElementById(
            "current-temp"
        ).textContent = `${currentTemperature}°F`;
        document.getElementById(
            "current-wind"
        ).textContent = `${currentWindSpeed} m/s`;
        document.getElementById(
            "current-humidity"
        ).textContent = `${currentHumidity}%`;
    })
    // .catch((error) => {
    //     console.error("Error fetching current weather:", error);
    // });

fetch(currentWeatherApiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        // Extract relevant data for the next 5 days with a daily interval
        const forecastData = [];

        // Loop through the forecast data and select data for the next 5 days with a daily interval
        // i += 8 (i = i+8)

        // .length is a js method that we use to determine the length of an array.
        for (let i = 2; i <= data.list.length; i += 8) {
            const forecastDay = data.list[i];
            forecastData.push(forecastDay);
        }

        // Get the forecast container element
        const forecastContainer = document.getElementById("forecast-container");
        forecastContainer.innerHTML = "";

        // Loop through the forecast data for each day
        forecastData.forEach((forecastDay, index) => {
            // Create elements for each day's forecast
            const box = document.createElement("div");
            box.classList.add("box");
            const content = document.createElement("div");
            content.classList.add("content");
            const dateElement = document.createElement("h4");
            const iconElement = document.createElement("img");
            const ulElement = document.createElement("ul");

            // Extract relevant data for each day
            const dateArray = forecastDay.dt_txt.split(" "); // Split the string into an array at the space character
            const forecastDate = dateArray[0];
            // as dateArray is an array we can access the item using [1]
            const forecastTemperature = forecastDay.main.temp;
            const forecastWindSpeed = forecastDay.wind.speed;
            const forecastHumidity = forecastDay.main.humidity;

            // Update the elements with the forecast data
            // .textContent property defines the content for the html element
            dateElement.textContent= forecastDate;
            const forecastIconCode = forecastDay.weather[0].icon; // Get the icon code from the API response
            const iconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}.png`; // Construct the icon URL

            // Update iconElement.src with the icon URL
            iconElement.src = iconUrl;
            ulElement.innerHTML = `
       <li>Temp: <span>${forecastTemperature}°F</span></li>
       <li>Wind: <span>${forecastWindSpeed} m/s</span></li>
       <li>Humidity: <span>${forecastHumidity}%</span></li>
     `;

            // Append the elements to the forecast container
            content.appendChild(dateElement);
            content.appendChild(iconElement);
            content.appendChild(ulElement);
            box.appendChild(content);
            forecastContainer.appendChild(box);
        });
    })

    .catch((error) => {
        console.error("Error fetching 5-day forecast:", error);
    });

// Search Button API request
search.addEventListener('click', () => {
    const weatherAPIKey = 'b06e2b56487d8b6b56828ca9b30fa8aa';
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-box .humidity span');
            const wind = document.querySelector('.weather-box .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = '../images/clear.png';
                    break;
                case 'Rain':
                    image.src = '../images/rain.png';
                    break;
                case 'Snow':
                    image.src = '../images/snow.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                case 'Clouds':
                    image.src = '../images/cloud.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°F</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}mph`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            container.style.height = '590px';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}`)
});