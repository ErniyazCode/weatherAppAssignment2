let weatherApi = "/weather"
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const weatherIcon = document.querySelector('.weatherIcon i')
const tempElement = document.querySelector('.temperature span')
const weatherCondition = document.querySelector('.weatherCondition')

const locationElement = document.querySelector('.place')
const dateElement = document.querySelector('.date')

const coordinatesElement = document.querySelector('.coordinates')
const feelsTemperatureElement = document.querySelector('.feels-temperature')
const humidityElement = document.querySelector('.humidity')
const pressureElement = document.querySelector('.pressure')
const windSpeedElement = document.querySelector('.wind-speed')
const countryCodeElement = document.querySelector('.country-code')
// const rainVolumeElement = document.querySelector('.rain-volume')
// const threeHoursElement = document.querySelector('.3-hours')

const mapElement = document.querySelector('#map')

const aqiValueElement = document.querySelector('.aqi-value');
const aqiApiToken = 'f0eca44705ca0cd064bbdec5705521490c2aaa88';

const newsApiToken = 'f7141a51c7184f4086f610af3db1ca18'

const currentDate = new Date()
const options = {month: "long"}
const monthName = currentDate.toLocaleString("en-US", options)

dateElement.textContent = currentDate.getDate() + ", " + monthName



weatherForm.addEventListener("submit", (e) => {
    e.preventDefault()
    // console.log(search.value)
    locationElement.textContent = "Loading.."
    weatherIcon.className = ""
    tempElement.textContent = ""
    weatherCondition.textContent = ""

    mapElement.textContent = ""

    coordinatesElement.textContent = ""
    feelsTemperatureElement.textContent = ""
    humidityElement.textContent = ""
    pressureElement.textContent = ""
    windSpeedElement.textContent = ""
    countryCodeElement.textContent = ""
    // rainVolumeElement.textContent = ""
    // threeHoursElement.textContent = ""

    showData(search.value)
})

function showData(city) {
    getWeatherData(city, (result) => {
        // console.log(result)
        if(result.cod==200) {
            console.log(result)
            if(result.weather[0].description == "rain" || result.weather[0].description == "fog") {
                weatherIcon.className = "wi wi-day-" + result.weather[0].description
            }
            else {
                weatherIcon.className = "wi wi-day-cloudy"
            }
            
            locationElement.textContent = result?.name
            tempElement.textContent = (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176)
            weatherCondition.textContent = result?.weather[0]?.description?.toUpperCase()

            // //other detail
            coordinatesElement.textContent = `Lat: ${result?.coord?.lat} Lon: ${result?.coord?.lon}`
            feelsTemperatureElement.textContent = `Feels like: ${(result?.main?.feels_like - 273.5).toFixed(2)}`
            humidityElement.textContent = `Humidity: ${result?.main?.humidity}`
            pressureElement.textContent = `Pressure: ${result?.main?.pressure}`
            windSpeedElement.textContent = `Wind Speed: ${result?.wind?.speed}`
            countryCodeElement.textContent = `Country Code: ${result?.sys?.country}`;


            updateMap(result.coord.lat, result.coord.lon ); 
            fetchAQIData(result.coord.lat, result.coord.lon);
            fetchNewsData(city);
        }
        else{
            locationElement.textContent = "City not founded"
        }
    })
}

function getWeatherData(city, callback) {
    const locationApi = weatherApi + "?address=" + city
    fetch(locationApi).then((response) => {
        response.json().then((response) => {
            callback(response)
        })
    })
} 


let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.5085, lng: -0.1257 }, // Default coordinates
        zoom: 8
    });
}

function updateMap(lat, lng) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng }, // Default coordinates
        zoom: 8
    });
}

//AQI
function fetchAQIData(lat, lon) {
    const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqiApiToken}`;
    
    fetch(aqiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                const aqi = data.data.aqi;
                aqiValueElement.textContent = `AQI: ${aqi} - ${determineAirQuality(aqi)}`;
            } else {
                aqiValueElement.textContent = 'AQI data not available';
            }
        })
        .catch(error => {
            console.error('Error fetching AQI data:', error);
            aqiValueElement.textContent = 'Error fetching AQI data';
        });
}

function determineAirQuality(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}


// NEWS
function fetchNewsData(city) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(city)}&from=2023-12-18&sortBy=publishedAt&apiKey=${newsApiToken}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                displayNews(data.articles);
            } else {
                console.error('Error fetching news:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; 

    articles.slice(0, 3).forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.innerHTML = `
            <div class="article-info">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank" class="article_link">Read more</a>
            </div>
        `;
        newsContainer.appendChild(articleElement);
    });
}

