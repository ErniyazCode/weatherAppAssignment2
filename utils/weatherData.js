const request = require("request")

const openWeatherMap = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY: "6a38ad5b632203c61ee41ef58542e609",
}

const weatherData = (address, callback) => {
    const url = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&appid=" + openWeatherMap.SECRET_KEY

    console.log(url)

    request({url, json: true}, (error, data) => {
        if(error) {
            callback(true, "unable to fetch please try again" + error)
        }
        callback(false, data?.body)
    })
}

module.exports = weatherData