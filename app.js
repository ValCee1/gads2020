let place = document.querySelector(".location");
let date = document.querySelector(".date");
let detailWea = document.querySelector(".weather-details");
let humidityCloudy = document.querySelector(".humidity");
let tempNumber = document.querySelector(".temp-number");
let pressure = document.querySelector(".pressure");
let uvi = document.querySelector(".uvi");
let visibility = document.querySelector(".visibility");
let windSpeed = document.querySelector(".wind-speed");
let dewpoint = document.querySelector(".dewpoint");
let description = document.querySelector(".description");
let searchResult = document.querySelector(".search-result");
let leftDetails1 = document.querySelector(".left-details-1");
let leftDetails2 = document.querySelector(".left-details-2");
let maxTemp = document.querySelector(".max-temp");
let minTemp = document.querySelector(".min-temp");
let eveTemp = document.querySelector(".eve-temp");
let mornTemp = document.querySelector(".morn-temp");
let dayTemp = document.querySelector(".day-temp");
let nightTemp = document.querySelector(".night-temp");
let imgSrc = document.querySelector(".imgSrc");

let weatherDate = Date.now();
searchResult.style.display = "none";
getWeather(weatherDate);
var data, dataJson;
let message = "";

leftDetails1.style.display = "block";
leftDetails2.style.display = "hidden";
visibility.style.display = "block";

async function getWeather(APIdate) {
  //Check for FORECAST dates beyond 7days
  try {
    let unixDate = UTCToUnix(APIdate);
    let APIdateTemp = getDate(APIdate);
    let currentDate = getDate(new Date());
    let futureDate = APIdateTemp + 7;
    let prevDate = APIdateTemp - 5;
    var weatherLink, diffDate;

    //Check Weather History
    if (currentDate - APIdateTemp >= 1 && currentDate - APIdateTemp <= 5) {
      diffDate = currentDate - APIdateTemp;
      weatherLink = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=40.73061&lon=-73.935242&dt=${unixDate}&appid=84833908fcd3707aea50b9bc80e5f569`;
    }

    //cHECK CURRENT WEATHER
    else if (APIdateTemp === currentDate) {
      weatherLink = `https://api.openweathermap.org/data/2.5/onecall?lat=40.73061&lon=-73.935242&exclude=daily,minutely,hourly&appid=84833908fcd3707aea50b9bc80e5f569`;
    }
    //Check future date
    else if (APIdateTemp - currentDate <= 7 && APIdateTemp - currentDate >= 1) {
      diffDate = APIdateTemp - currentDate;
      weatherLink = `https://api.openweathermap.org/data/2.5/onecall?lat=40.73061&lon=-73.935242&exclude=current,minutely,hourly&appid=84833908fcd3707aea50b9bc80e5f569`;
    }
    //Throw Error
    else {
      message =
        "Sorry. You cannot get a daily forecast beyond 7days or a historical weather data beyond 5days ago <br/>";
      weatherLink = `https://api.openweathermap.org/data/2.5/onecall?lat=40.73061&lon=-73.935242&exclude=daily,minutely,hourly&appid=84833908fcd3707aea50b9bc80e5f569`;
    }

    //Fetch API Data
    let result = await fetch(weatherLink);
    //Get the general array
    dataJson = await result.json();

    //gET the current array
    if (dataJson.current) {
      data = dataJson.current;
    } else {
      leftDetails1.style.display = "none";
      leftDetails2.style.display = "block";
      visibility.style.display = "none";
      data = dataJson.daily[diffDate];

      minTemp.innerHTML =
        "Minimum Daily Temp: " + celsius(data.temp.min) + "<sup>o</sup>C";
      maxTemp.innerHTML =
        "Maximum Daily Temp: " + celsius(data.temp.max) + "<sup>o</sup>C";
      mornTemp.innerHTML =
        "Morning Temp: " + celsius(data.temp.morn) + "<sup>o</sup>C ";
      dayTemp.innerHTML =
        "Average Daily Temp: " + celsius(data.temp.day) + "<sup>o</sup>C";
      eveTemp.innerHTML =
        "Evening Temp: " + celsius(data.temp.eve) + "<sup>o</sup>C ";
      nightTemp.innerHTML =
        "Night Temp: " + celsius(data.temp.night) + "<sup>o</sup>C";
    }
    let dataId = data.weather[0].id;
    imgSrc.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    if (dataId < 800 || dataId > 800) {
      message +=
        "Sorry, Your outdoor Event cannot hold because of " +
        data.weather[0].description;
    } else {
      message += "Your Event can Hold at this time";
    }
    //Display Message
    searchResult.style.display = "block";
    searchResult.innerHTML = message;
    message = " ";

    //Display Humidity
    humidityCloudy.textContent =
      data.humidity + "% humidity  ~ " + data.clouds + "% Cloudy";
    //Other Displays
    description.innerHTML = `<b>${data.weather[0].description}</b>`;
    detailWea.textContent = data.weather[0].main;
    place.textContent = dataJson.timezone;
    tempNumber.textContent = celsius(data.temp);
    pressure.textContent = data.pressure + " hPa  Pressure";
    uvi.textContent = data.uvi + " Mid-day  ultra-violet-index";

    dewpoint.textContent = data.dew_point - -273.15 + " Celsius Dew-point";
    windSpeed.textContent = data.wind_speed + " m/s  Wind-Speed";

    visibility.textContent = data.visibility / 1000 + " Km average visibility";

    date.textContent = unixToUTC(data.dt);
  } catch (err) {
    console.log(err);
  }
}

document.querySelector(".date-check").addEventListener("click", function () {
  let input = document.querySelector("#datetime").value;
  var dateTime;
  if (!input) {
    console.log("nO iNPUT");
  } else {
    //Chech Search Input
    dateTime = Date.parse(input);
    getWeather(dateTime);
  }
});

function unixToUTC(t) {
  var dt = new Date(t * 1000);
  return dt.toDateString();
}

function UTCToUnix(t) {
  var dt = t / 1000;
  return Math.floor(dt);
}

function getDate(t) {
  var now = new Date(t);
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}
function celsius(kelvin) {
  let deg = kelvin - 273;
  return Math.floor(deg);
}
function readStorage() {
  const storage = JSON.parse(localStorage.getItem("weatherData"));
  if (storage) data = storage;
}
