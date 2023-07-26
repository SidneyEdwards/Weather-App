var currentDayEl = $('#currentDay')


var searchHistory = JSON.parse(localStorage.getItem("citySearch")) || []


//Creating an object called weather that calls a weather API
let weather = {
"apiKey": "bcb20722301e0211fa413ee5b69f5581",

//Fetch the weather from the API.
fetchWeather: function (city) {
    fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&cnt=3&appid=" + this.apiKey
    )

    .then((response) => response.json())
    .then((data) => this.displayWeather(data));
},

displayWeather: function(data) {
    const {name} = data;
    const {icon, description} = data.weather[0];
    const {temp, humidity} = data.main; 
    const {speed} = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".weather-icon").src = "https://openweathermap.org/img/wn/"+ icon + ".png";    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "℉";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerHTML = "Wind Speed: " + speed + "mph";

if (!searchHistory.includes(name)){
searchHistory.push(name)
localStorage.setItem("citySearch",JSON.stringify(searchHistory))
let btn = document.createElement('button');
btn.setAttribute("class", "btn btn-outline-primary  mt-2")
btn.textContent = name
btn.onclick = this.onClick
document.querySelector(".list-group").append(btn)

this.forecastWeather(name);

forecastWeather();
}
},



    forecastWeather: function (city) {
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + this.apiKey
    )
    .then((response) => response.json())
    .then((data) => {

        const forecasts = data.list.filter((item, index) => index % 8 === 0);
    
        for (let i = 0; i < forecasts.length && i < 5; i++) {
    const { dt_txt: date, weather: [{icon}], main: {temp, humidity}, wind: {speed} } = forecasts[i];
    

    const forecastCard = document.querySelector(`#forecast-${i+1}`);
    

    forecastCard.querySelector('p').innerText = dayjs(date).format('M/D/YYYY hA');
    forecastCard.querySelector('.weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />`;
    forecastCard.querySelector('.temp').innerText = temp + "℉";
    forecastCard.querySelector('#humidity').innerText = "Humidity: " + humidity + "%";
    forecastCard.querySelector('#wind').innerText = "Wind Speed: " + speed + "mph";
        }
    });
    },


    const cityName = document.querySelector(".city-input").value;
    this.fetchWeather(cityName);
    this.forecastWeather(cityName);
    document.querySelector(".city-input").value = "";
},



onClick: function (event) {
    console.log(event.target.textContent)
    weather.fetchWeather(event.target.textContent)
};


document.getElementById("button-addon2").addEventListener("click", function() {
weather.search();
});

function displayTime () {
var todaysDate = dayjs().format('dddd, MMMM DD, YYYY');
currentDayEl.text(todaysDate);
}
displayTime();
setInterval(displayTime, 60000); 



document.querySelector(".city-input").addEventListener("keydown", function(event) {


if (event.keyCode === 13) {
    weather.search();
}
});


for (let i = 0; i < searchHistory.length; i++) {
let btn = document.createElement('button');
btn.setAttribute("class", "btn btn-outline-primary mt-2")
btn.textContent = searchHistory[i]
btn.onclick = weather.onClick
document.querySelector(".list-group").append(btn)
}




function clearHistory() {
localStorage.clear();
const historyList = document.querySelector(".list-group");
while (historyList.firstChild) {
    historyList.removeChild(historyList.firstChild);
}
}