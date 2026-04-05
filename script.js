

var key = "8bd59f9530fd496f904104253260403"; 
var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var weatherResult = document.getElementById("weatherResult");
var historyList = document.getElementById("historyList");
var clearBtn = document.getElementById("clearBtn");

function fetchWeather(city) {

  fetch("https://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + city + "&aqi=no")
    .then(function(resp) {
      if (!resp.ok) {
        throw new Error("city not found");
      }
      return resp.json();
    })
    .then(function(data) {
      showWeather(data);
      saveCity(city);
    })
    .catch(function(err) {
      console.log(err);
      weatherResult.innerHTML = "<p style='color:red;'>" + err.message + "</p>";
    });
}

function showWeather(data) {
  weatherResult.innerHTML = "<div class='weather-card'>" +
    "<h2 class='location'>" + data.location.name + ", " + data.location.country + "</h2>" +
    "<div class='temp-block'>" +
    "<p class='temp'>" + data.current.temp_c + "&deg;C</p>" +
    "<img class='icon' src='https:" + data.current.condition.icon + "' />" +
    "</div>" +
    "<p class='condition'>" + data.current.condition.text + "</p>" +
    "<div class='details'>" +
    "<p class='humidity'>Humidity: " + data.current.humidity + "%</p>" +
    "<p class='wind'>Wind: " + data.current.wind_kph + " kph (" + data.current.wind_dir + ")</p>" +
    "</div>" +
    "</div>";

  
  document.body.className = "";
  var cond = data.current.condition.text.toLowerCase();
  if (cond.includes("rain")) {
    document.body.classList.add("rainy-bg");
  } else if (cond.includes("sunny") || cond.includes("clear")) {
    document.body.classList.add("sunny-bg");
  }
}

searchBtn.addEventListener("click", function() {
  var c = cityInput.value.trim();
  if (c == "") {
    alert("enter city");
    return;
  }
  fetchWeather(c);
});

function saveCity(city) {
  var arr = JSON.parse(localStorage.getItem("cities")) || [];
  if (arr.indexOf(city) === -1) {
    arr.push(city);
    localStorage.setItem("cities", JSON.stringify(arr));
  }
  loadHistory();
}

function loadHistory() {
  historyList.innerHTML = "";
  var arr = JSON.parse(localStorage.getItem("cities")) || [];
  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement("li");
    li.textContent = arr[i];
    li.addEventListener("click", function() {
      fetchWeather(this.textContent);
    });
    historyList.appendChild(li);
  }
}

function clearHistory() {
  localStorage.removeItem("cities");
  loadHistory();
}

window.addEventListener("load", loadHistory);
if (clearBtn) {
  clearBtn.addEventListener("click", clearHistory);
}