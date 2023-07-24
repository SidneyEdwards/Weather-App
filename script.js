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


  // Fetch and display 5-day forecast
    forecastWeather: function (city) {
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + this.apiKey
    )
    .then((response) => response.json())
    .then((data) => {
  // Filter the forecasts to only include one forecast per day
        const forecasts = data.list.filter((item, index) => index % 8 === 0);
    
        for (let i = 0; i < forecasts.length && i < 5; i++) {
    const { dt_txt: date, weather: [{icon}], main: {temp, humidity}, wind: {speed} } = forecasts[i];
    
  // Get forecast card by index
    const forecastCard = document.querySelector(`#forecast-${i+1}`);
    
  // Display date, weather icon, temperature, humidity, and wind speed
    forecastCard.querySelector('p').innerText = dayjs(date).format('M/D/YYYY hA');
    forecastCard.querySelector('.weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />`;
    forecastCard.querySelector('.temp').innerText = temp + "℉";
    forecastCard.querySelector('#humidity').innerText = "Humidity: " + humidity + "%";
    forecastCard.querySelector('#wind').innerText = "Wind Speed: " + speed + "mph";
        }
    });
    },

//This is a function that is being called when the button is clicked. It is logging the text content of the button and then calling the fetchWeather function.
search: function() {
    const cityName = document.querySelector(".city-input").value;
    this.fetchWeather(cityName);
    this.forecastWeather(cityName);
    document.querySelector(".city-input").value = "";
},


//This is a function that is being called when the button is clicked. It is logging the text content of the button and then calling the fetchWeather function
onClick: function (event) {
    console.log(event.target.textContent)
    weather.fetchWeather(event.target.textContent)
}
};

//This is an event listener that is listening for a click on the button. When the button is clicked it is calling the search function.
document.getElementById("button-addon2").addEventListener("click", function() {
weather.search();
});

function displayTime () {
var todaysDate = dayjs().format('dddd, MMMM DD, YYYY');
currentDayEl.text(todaysDate);
}
displayTime();
setInterval(displayTime, 60000); 



//Add an event listener to the input field to listen for the "keydown" event
document.querySelector(".city-input").addEventListener("keydown", function(event) {

//Search for a city when 'Enter' is hit
if (event.keyCode === 13) {
    weather.search();
}
});

//This is creating a button for each city in the search history. 
for (let i = 0; i < searchHistory.length; i++) {
let btn = document.createElement('button');
btn.setAttribute("class", "btn btn-outline-primary mt-2")
btn.textContent = searchHistory[i]
btn.onclick = weather.onClick
document.querySelector(".list-group").append(btn)


}



//It clears the local storage and removes all the list items from the history list
function clearHistory() {
  localStorage.clear();
  const historyList = document.querySelector(".list-group");
  while (historyList.firstChild) {
    historyList.removeChild(historyList.firstChild);
}
}