//do all logic here
$(document).ready(function () {

    // HTML VARIABLES
    // ============================================================================================
    var scheduleList = $("#schedule-list");
    
    // MOMENT VARIABLES
    // ============================================================================================
    var objCurrentDay = moment();
    var displayDay = objCurrentDay.format("LLLL"); //Day of week, month name, day of month, year, time
    var currentDate = objCurrentDay.format("L");
    var currentMilHour = objCurrentDay.format("kk");
    var currentLocHour = objCurrentDay.format("hh a");
    var nextHour = parseInt(currentMilHour,10) + 1;

    
    console.log("objCurrentDay: " + objCurrentDay);
    console.log("displayDay: " + displayDay);
    console.log("currentDate: " + currentDate);
    console.log("currentMilHour: " + currentMilHour);
    console.log("currentLocHour: " + currentLocHour);
    console.log("nextHour: " + nextHour);

    
    //  STORING VARIABLES
    // ============================================================================================
    var hourlySchedule = {
        theDay: "",
        theHour: 0,
        theText: ""
    }
    var hourlyList = [];
    const HOURLIST = "hourlyList";


    //  CALL FUNCTIONS TO Initilize PAGE
    // ============================================================================================

    initSchedule();
    renderHTMLList(); // create the HTML elements needed
    initHourlyList(); // add any text that we need
    keepUpdating();
    //renderHTMLList();


    
    //  FUNCTIONS : Initliaze Scheduler  & update globals functions
    // ============================================================================================

    // update the day display
    function initSchedule() {
        $("#currentDay").text(displayDay);
    }

    // update the global variables
    function updateGlobals(){
        objCurrentDay = moment();
        displayDay = objCurrentDay.format("LLLL"); //Day of week, month name, day of month, year, time
        currentDate = objCurrentDay.format("L");
        currentMilHour = objCurrentDay.format("kk");
        currentLocHour = objCurrentDay.format("hh a");    
    }

    // FUNCTIONS: HTML RELATED
    // ============================================================================================

    // RENDER all the HTML Rows Needed
    function renderHTMLList() {

        for (var i = 0; i < 24; i++) {

            renderRow(i);
        }
        
        updateHTMLClass();
    }


    // render each HTML Row
    function renderRow(milTime) {

        // temp mom variable
        var tmpHour = moment().hour(milTime);
        var anId = "milTime" + milTime;

        //handle row
        var hourRow = $("<form>").addClass("row time-block");

        //handle hour col
        var colTime = $("<label>").addClass("col-2 pt-4 hour");
        colTime.attr("for", anId)
        colTime.text(tmpHour.format("h a"));

        //textarea form + attributes
        var colTextArea = $("<textarea>").addClass("col-8 form-control ");
        colTextArea.attr("id", anId);
        colTextArea.attr("data-miltime", milTime);

        //saveBtn
        var colSaveBtn = $("<button>").addClass("col-2 btn btn-block saveBtn").text("Save");
        colSaveBtn.attr("type", "button");
        colSaveBtn.attr("role", "button");
        // colSaveBtn.append(saveBtn);

        hourRow.append(colTime);
        hourRow.append(colTextArea);
        hourRow.append(colSaveBtn);


        scheduleList.append(hourRow);
    }

    // Add the Classes to Color the rows
    function updateHTMLClass(){

        // iterate acroos all textareas
        $("textarea").each(function(index){

          //get the milTime of that textarea
          var milIdx = $(this).data("miltime");
         // console.log(milIdx);            

          // update classes
          if(milIdx < currentMilHour){
              $(this).removeClass("present future");
              $(this).addClass("past");

              console.log("past: " + milIdx);

          }
          else if (milIdx == currentMilHour){
              $(this).removeClass("past future");
              $(this).addClass("present");

              console.log("adding present: " + milIdx); 
          }
          else if(milIdx > currentMilHour){
              $(this).removeClass("past present");
              $(this).addClass("future");

              console.log("adding future: "+ milIdx);
          }
      })
  }


    // FUNCTIONS: GET & STORE TEXT ENTERED
    // ============================================================================================

    // store the array holding text for each our
    function storeHourlyList(){
        localStorage.setItem(HOURLIST,JSON.stringify(hourlyList));
    }

    //check if theres an array of data stored, init it if so
    function initHourlyList(){
        
        var storedHourlyList = JSON.parse(localStorage.getItem(HOURLIST));

        if (storedHourlyList == null){
           return;
        }
        else{
            hourlyList = storedHourlyList;
            renderHourlyList();
        }

    }

    // render the Hourly List array to the HTML elements
    function renderHourlyList(){   

        if(hourlyList == null){
            return;
        }

        // iterate acroos all textareas
        $("textarea").each(function(index){

            //get the milTime of that textarea
            var milIdx = $(this).data("miltime");
            //console.log(milIdx);

            var txtDisplay = getTheText(milIdx);
            //console.log(txtDisplay);

            // print text to text field
            $(this).text(txtDisplay);
        })

    }

    // iterate through the array, find object where the Hour matches search hour, return that text
    function getTheText(searchTime){

        for (var i = 0; i < hourlyList.length; i++){

            if(hourlyList[i].theDay == currentDate){
                if(hourlyList[i].theHour === searchTime){
                    return hourlyList[i].theText;
                }
            }
            
        }
    }

    
     // FUNCTIONS: EVENTS
    // ============================================================================================


    // When the Save BTN is clicked, get it's sibling textarea, it's data-miltime attribute
    // create tmpScedhule , add it to our hourlyList array for storing
    $(".saveBtn").on("click", function (event) {

        // get the milTime of that hour
        // and get the from the textarea
        var schedMilTime = $(this).siblings("textarea").data("miltime");
        var schedText = $(this).siblings("textarea").val();


        // Create new object to hold data
        var tmpSchedule = Object.create(hourlySchedule);

        tmpSchedule.theDay = objCurrentDay.format("L");
        console.log(tmpSchedule.theDay)
        tmpSchedule.theHour = schedMilTime;
        console.log(tmpSchedule.theHour);

        tmpSchedule.theText = schedText;
        console.log(tmpSchedule.theText);

        //push new object into array of objects
        hourlyList.push(tmpSchedule);

        storeHourlyList();
    })

    // keep moment obj updated, update HTML if minute or hour changed
    function keepUpdating(){

        setInterval(function(){

            updateGlobals();
            initSchedule();

            if(parseInt(currentMilHour,10) >= nextHour){
                console.log("new hour")
                updateHTMLClass();
                nextHour = parseInt(currentMilHour,10) + 1;
            }

        },1000);
    }


}); // DOCUMENT READY END
