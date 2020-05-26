// DECLARE GLOBAL VARIABLES
// ======================================================================

// constants
const ICONURL = "http://openweathermap.org/img/w/";
const CURRENT = "current";
const FIVEDAY = "fiveday";
const UVIDX = "uvidx";
const SEARCHED = "searched";
const PREVIOUSSEARCH = "previoussearch";

//changing
var arrSearchedCities = [];
var gblSearchPlace = ""


// API RELATED FUNCTIONS
// =================================================================

/**
* pulls information from the form and build the query URL
* @returns {string} URL for Weather API based on form inputs
*/
function buildQueryURL(typeData, lat, lon) {
    // queryURL is the url we'll use to query the API


    var queryURL = "";
    console.log("building url");

    if (typeData === CURRENT) {
        queryURL = "https://api.openweathermap.org/data/2.5/weather?";
    }
    else if (typeData === FIVEDAY) {
        queryURL = "https://api.openweathermap.org/data/2.5/forecast?"
    }
    else if (typeData === UVIDX) {
        queryURL = "http://api.openweathermap.org/data/2.5/uvi?";

    }
    //  var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = { "appid": "80ca5f4ce7fbbfba8a71f90fc0cd3305" };

    // Grab text the user typed into the search input, add to the queryParams object
    if (typeData === UVIDX) {
        queryParams.lat = lat;
        queryParams.lon = lon;
    }
    else {
        queryParams.q = gblSearchPlace;
    }
    //queryParams.q = $("#search-place").val().trim();


    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));

    return queryURL + $.param(queryParams);
}



/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} WeatherData - object containing Weather API Data
*/
function displayCurrentForecast(WeatherData) {

    console.log("\nCURRENT FORECAST\n---------------------------------");
    var cityLat = WeatherData.coord.lat;
    var cityLon = WeatherData.coord.lon;
    console.log("lat: " + cityLat + " - Lon: " + cityLon);

    console.log(WeatherData);
    console.log("------------------------------------");

    //get location
    var location = WeatherData.name;
    console.log("location: " + location);

    //get date
    var dateForecast = moment(WeatherData.dt * 1000);
    console.log("date forecast: " + dateForecast.format("L"));

    //write date to HTML
    $("#result-city").text(location + " (" + dateForecast.format("L") + ")  ");
    var altTxt = WeatherData.weather[0].description;
    $("#result-city").append('<img src=' + ICONURL + WeatherData.weather[0].icon + '.png alt="' + altTxt + '">');


    //Temperature: ##.## F
    var tempF = Math.round((WeatherData.main.temp - 273.15) * 1.8 + 32);
    console.log("temp kelvin - " + WeatherData.main.temp);
    console.log("Temp (F) °F: " + tempF);

    //write tempF to screen
    $("#temp-f").text("Temperature: " + tempF + " °F");


    // Humidity: ##%
    console.log("Humidity: " + WeatherData.main.humidity + " %");
    $("#result-humid").text("Humidity: " + WeatherData.main.humidity + " %");

    //Wind Speed: #.# MPH
    console.log("Wind Speed: " + WeatherData.wind.speed + " MPH");
    $("#wind-speed").text("Wind Speed: " + WeatherData.wind.speed + " MPH");

    console.log("icon id: " + WeatherData.weather[0].icon);
    //$("#result-humid").text("");

    getUVIndex(cityLat, cityLon);
    //UV Index: #.## <- number is colored
    //console.log("UX Index: " + WeatherData.)

}


/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} FiveDayData - object containing Weather API Data
*/
function displayFiveDay(FiveDayData) {

    console.log("\n FIVE-DAY FORECAST\n---------------------------------");

    var fivedayArr = [];

    console.log("\n");

    console.log(FiveDayData);
    console.log("------------------------------------");

    var fiveDay = [];
    var forecastArr = FiveDayData.list;


    //iterate over the array in the FiveDay Forecast
    //store the forecast that is at noon
    $.each(forecastArr, function (idx, dayHour) {
        // console.log( "Index #" + idx + ": " + dayHour );
        if (dayHour.dt_txt.indexOf("12:00:00") >= 0) {
            fiveDay.push(dayHour);
        }
    });

    //empty the div first
    $("#five-day-forecast").empty();

    //print the fiveDay arr to check its good
    for (var i = 0; i < fiveDay.length; i++) {
        console.log(fiveDay[i]);

        //Five Day

        var $divCol =  $("<div>").addClass("col mb-4");

        //Card Data
        var $divCard = $("<div>").addClass("card h-100 forecast card-body px-3");
        $divCol.append($divCard);

        // Date
        var dateFC = moment(fiveDay[i].dt * 1000);
        var $cardTitle = $("<h5>").addClass("card-title").text(dateFC.format("L"));
        $divCard.append($cardTitle);

        // Icon of Weather
        var altTxt = fiveDay[i].weather[0].description;
        console.log(altTxt);
        var $pimg = $("<p>").append('<img src=' + ICONURL + fiveDay[i].weather[0].icon + '.png alt="' + altTxt + '">');
        $divCard.append($pimg);

        // Temp: ##.## F
        var temp = Math.round((fiveDay[i].main.temp - 273.15) * 1.8 + 32)
        var $pTemp = $("<p>").text("Temp: " + temp + " °F");
        $divCard.append($pTemp);


        // Humidity: ##%
        var $pHumid = $("<p>").text("Humidity: " + fiveDay[i].main.humidity + "%");
        $divCard.append($pHumid);


        $("#five-day-forecast").append($divCol);
    }

}


//GET THE UV INDEX, AND ADD COLOR BASED ON SEVERITY
function getUVIndex(myLat, myLong) {

    console.log("get uv index")
    var uvURL = buildQueryURL(UVIDX, myLat, myLong);


    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);
        console.log("UV Index: " + response.value);

        var idxVal = response.value;

        //remove previous classes
        $("#uv-color").removeClass("uv-low uv-mod uv-high uv-veryhigh uv-extreme");

        //add correct class
        if (idxVal >= 11) {
            $("#uv-color").addClass("uv-extreme");
            $("#uv-color").text(idxVal);
        }
        else if (idxVal >= 8) {
            $("#uv-color").addClass("uv-veryhigh");
            $("#uv-color").text(idxVal);

        }
        else if (idxVal >= 6) {
            $("#uv-color").addClass("uv-high");
            $("#uv-color").text(idxVal);
        }
        else if (idxVal >= 3) {
            $("#uv-color").addClass("uv-mod");
            $("#uv-color").text(idxVal);
        }
        else if (idxVal >= 0) {
            $("#uv-color").addClass("uv-low");
            $("#uv-color").text(idxVal);
        }
    });

}

// call the APIs
function getAPIData() {

    var currentURL = buildQueryURL(CURRENT);
    var fivedayURL = buildQueryURL(FIVEDAY);


    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(displayCurrentForecast);


    $.ajax({
        url: fivedayURL,
        method: "GET"
    }).then(displayFiveDay);

}



// STORE / DISPLAY SEARCHED CITIES
// ========================================================================================

function renderSearchedList() {

    if (arrSearchedCities == null) {
        return;
    }

    //clear everything
    $("#list-searched-cities").empty();


    //display list
    for (var i = 0; i < arrSearchedCities.length; i++) {

        var $searchedItem = $("<a>").addClass("list-group-item list-group-item-action searchList");
        $searchedItem.attr({ "data-search": arrSearchedCities[i], href: "", input: "submit" });
        $searchedItem.text(arrSearchedCities[i]);

        //add searched itme to searched cities
        $("#list-searched-cities").append($searchedItem);

    }
}


function storeSearchedList() {
    localStorage.setItem(SEARCHED, JSON.stringify(arrSearchedCities));
}

function initSearchedList() {

    var storedSearched = JSON.parse(localStorage.getItem(SEARCHED));

    if (storedSearched) {
        arrSearchedCities = storedSearched;
        renderSearchedList();
    }
}



function getSearchListData(event) {
    event.preventDefault();

    console.log("HERE");

    gblSearchPlace = $(this).data("search");
    console.log($(this).data("search"));

    getAPIData();
}

function initDashboard(){

    initSearchedList();

    if(arrSearchedCities){
        gblSearchPlace = arrSearchedCities[0];
        getAPIData();
    }
    
}


$(document).ready(function () {


    $("#search-btn").on("click", function (event) {
        event.preventDefault();


        searchPlace = $("#search-place").val().trim();

        if (searchPlace) {

            gblSearchPlace = searchPlace;
            //add item to searchList
            if (arrSearchedCities.length > 9) {
                arrSearchedCities.pop();
                arrSearchedCities.unshift(gblSearchPlace);
            }
            else {
                arrSearchedCities.unshift(gblSearchPlace);
            }
        }
        else {
            console.log("ENTER SOMETHING!");
        }

        storeSearchedList();
        renderSearchedList();

        getAPIData();

        $("#search-place").val("");


    });

    initDashboard();


}); // DOCUMENT READY 


// Adding a click event listener to all elements with a class of ""
$(document).on("click", ".searchList", getSearchListData);   