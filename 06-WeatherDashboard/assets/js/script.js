
$(document).ready(function () {


    const ICONURL = "http://openweathermap.org/img/w/";
    const CURRENT = "current";
    const FIVEDAY = "fiveday";
    const UVIDX = "uvidx";

    /**
 * pulls information from the form and build the query URL
 * @returns {string} URL for Weather API based on form inputs
 */
    function buildQueryURL(typeData,lat,lon) {
        // queryURL is the url we'll use to query the API

        var queryURL = "";
        console.log("building url");

        if(typeData === CURRENT){
            queryURL = "https://api.openweathermap.org/data/2.5/weather?";
        }
        else if (typeData === FIVEDAY){
            queryURL = "https://api.openweathermap.org/data/2.5/forecast?"
        }
        else if(typeData === UVIDX){
            queryURL = "http://api.openweathermap.org/data/2.5/uvi?";

        }
      //  var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

        // Begin building an object to contain our API call's query parameters
        // Set the API key
        var queryParams = { "appid": "80ca5f4ce7fbbfba8a71f90fc0cd3305" };

        // Grab text the user typed into the search input, add to the queryParams object
        if(typeData === UVIDX){
            queryParams.lat = lat;
            queryParams.lon = lon;
        }
        else{
            queryParams.q = $("#search-place").val().trim();
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

        var location = WeatherData.name;
        console.log("location: " + location);

        var dateForecast = moment(WeatherData.dt * 1000);
        console.log("date forecast: " + dateForecast.format("L"));
    

        //var $searchCity = $("<h2>").addClass("card-title");
        //$searchCity.text(WeatherData.name +" - "+ dateForecast.format("L")); 

        //$("#results-search").append($searchCity);

        //Temperature: ##.## F
        var tempF = Math.round( (WeatherData.main.temp - 273.15) * 1.8 + 32);
        console.log("temp kelvin - " + WeatherData.main.temp );
        console.log("Temp (F) °F: "+ tempF);

        // Humidity: ##%
        console.log("Humidity: " + WeatherData.main.humidity + " %");

        //Wind Speed: #.# MPH
        console.log("Wind Speed: " + WeatherData.wind.speed + " MPH");

        console.log("icon id: " + WeatherData.weather[0].icon);

        getUVIndex(cityLat,cityLon);
        //UV Index: #.## <- number is colored
        //console.log("UX Index: " + WeatherData.)

    }



    /**
     * takes API data (JSON/object) and turns it into elements on the page
     * @param {object} FiveDayData - object containing Weather API Data
    */
    function displayFiveDay(FiveDayData){

        console.log("\n FIVE-DAY FORECAST\n---------------------------------");

        var fivedayArr = [];
        
        console.log("\n");

        console.log(FiveDayData);
        console.log("------------------------------------");

        


        //Five Day

        //Card Data

        // Date

        // Icon of Weather

        // Temp: ##.## F

        // Humidity: ##%


    }

    function getUVIndex(myLat, myLong){

        console.log("get uv index")
        var uvURL = buildQueryURL(UVIDX, myLat,myLong);


        $.ajax({
            url: uvURL,
            method: "GET"
          }).then(function (response){

            console.log(response);


          });

    }

    function renderSearchedList(seaerched){

        var $searechedItem = $("<a>").addClass("list-group-item list-group-item-action");
        $searechedItem.attr({"data-search":seaerched,"data-toggle":"list",href:"''"});        
    
        //add searched itme to searched cities
        $("#list-searched-cities").prepend($searechedItem);
    }

    $("#search-btn").on("click", function(event){
        event.preventDefault();

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




    });





    



}); // DOCUMENT READY 