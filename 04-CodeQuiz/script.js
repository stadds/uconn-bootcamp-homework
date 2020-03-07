//Assignment Variables
var timeLeft = document.querySelector("#time-left");
var timeText = document.querySelector("#time-text");
var headDirections = document.querySelector("#head-directions");
var startBtn = document.querySelector("#startQuiz");
var mainDirections = document.querySelector("#main-directions");
var mainQuiz = document.querySelector("#main-quiz");
var mainQuestion = document.querySelector("#head-question");
var mainSections = document.getElementsByTagName("section");
//rad btns
var radBtnA = document.querySelector("#rad-btn-a");
var radBtnB = document.querySelector("#rad-btn-b");
var radBtnC = document.querySelector("#rad-btn-c");
var radBtnD = document.querySelector("#rad-btn-d");
//rad btn text
var choiceA = document.querySelector("#choice-a-text");
var choiceB = document.querySelector("#choice-b-text");
var choiceC = document.querySelector("#choice-c-text");
var choiceD = document.querySelector("#choice-d-text");
var directionsFooter = document.querySelector("#footer-directions");
var quizFooter = document.querySelector("#footer-quiz");
var numCorrect = document.querySelector("#cnt-correct");
var numWrong = document.querySelector("#cnt-wrong");
//store player button
var submitPlayerBtn = document.querySelector("#player-form");
var enteredInits = document.querySelector("#enter-inits");
// high score page
var endScore = document.querySelector("#total-score")
var playerList = document.querySelector("#highscore-list");
// var questionContent = document.querySelector("#question");

// Quiz array, holding object QUESTIONS!
var myQuiz = [
    {
        question: "Chooce the correct JavaScript syntax to change the content of the following HTML code. \n<p id='bless'>I bless the rains down in...</p>",
        options: {
            a: "document.getElement('bless').innerHTML='Africa!!';",
            b: "document.getElementById('bless').innerHTML='Africa!!';",
            c: "document.getId('bless').innerHTML='Africa!!';",
            d: "document.getElementById('bless').innerHTML=Africa!!;"
        },
        answer: "b"
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        options: {
            a: "<scripting>",
            b: "js",
            c: "<script>",
            d: "javascript"
        },
        answer: "c"
    },
    {
        question: "How do you create a function in JavaScript?",
        options: {
            a: "function:myFunction()",
            b: "function = myFunction()",
            c: "function.myFunction()",
            d: "function myFunction()"
        },
        answer: "d"
    },
    {
        question: "How do you write an IF statement in JavaScript?",
        options: {
            a: "if i == 5 then",
            b: "if i = 5",
            c: "if (i == 5)",
            d: "if i = 5 then"
        },
        answer: "c"
    },
    {
        question: "How does a FOR loop start?",
        options: {
            a: "for (var i = 0; i <= 5; i++)",
            b: "for (i <= 5; i++)",
            c: "for (i = 0; i <= 5)",
            d: "for i = 1 to 5"
        },
        answer: "a"
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        options: {
            a: "var colors = 'red', 'green', 'blue'",
            b: "var colors = ['red', 'green', 'blue']",
            c: "var colors = (1:'red', 2:'green', 3:'blue')",
            d: "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"
        },
        answer: "b"
    },
    {
        question: "How do you round the number 7.25, to the nearest integer?",
        options: {
            a: "rnd(7.25)",
            b: "round(7.25)",
            c: "Math.round(7.25)",
            d: "Math.rnd(7.25)"
        },
        answer: "c"
    },

];

var currentQuestion = 0;
const secondsStart = 60;
var secondsElapsed = secondsStart;


//scores
var currentScore = 0;
var cntCorrect = 0;
var cntWrong = 0;

//timer
var interval;

//player items
var players = [];

var player = {
    name: "",
    score: 0,

    getPlayer: function () {
        var playerStr = this.name + "  -  Score: " + this.score;
        return playerStr
    }
}

//init

init();

function init() {
    timeLeft.textContent = secondsStart;
}


// START QUIZ
function startQuiz() {
    // randomizeQuiz();
    console.log("start quiz clicked");

    toggleQuizPage();
    renderQuestion();
    startTimer();
}

// RENDER QUESTION
function renderQuestion() {

    console.log("rendering question");

    if (currentQuestion < myQuiz.length) {
        mainQuestion.textContent = myQuiz[currentQuestion].question;
        choiceA.textContent = myQuiz[currentQuestion].options["a"];
        choiceB.textContent = myQuiz[currentQuestion].options["b"];
        choiceC.textContent = myQuiz[currentQuestion].options["c"];
        choiceD.textContent = myQuiz[currentQuestion].options["d"];
    }
    else {
        console.log("NO MORE QUESTIONS!!");
        endQuiz();
    }
};

// PLAYER LIST FUNCTIONS
//==========================================================================
function renderPlayerList() {

    playerList.innerHTML = "";

    //sort players so best is first
    players.sort(function (a, b) {
        return b.score - a.score;
    });

    //Render a new li for each player and score
    for (var i = 0; i < players.length; i++) {

        var liPlayer = Object.create(player);
        liPlayer.name = players[i].name
        liPlayer.score = players[i].score;

        // console.log(liPlayer.getPlayer());


        var newPlayerLi = document.createElement("li");
        newPlayerLi.textContent = liPlayer.getPlayer();
        newPlayerLi.setAttribute("data-index", i);

        playerList.appendChild(newPlayerLi);
    }
};

// INITILAIZE PLAYER LIST
function initPlayerList() {

    var storedPlayerList = JSON.parse(localStorage.getItem("players"));

    if (storedPlayerList !== null) {
        players = storedPlayerList;
    }

    renderPlayerList();
}

// STORE PLAYER LIST
function storePlayerList() {
    localStorage.setItem("players", JSON.stringify(players));
};


// TIMER FUNCTIONS
// ====================================================

//set the timer
function setTime() {

    clearInterval(interval);
    secondsElapsed = secondsStart;
}

// start the timer
function startTimer() {

    setTime();

    if (secondsElapsed > 0) {

        interval = setInterval(function () {
            secondsElapsed--;

            renderTimer();
        }, 1000);
    }
}

// stop the timer
function stopTimer() {
    secondsElapsed = 0;
    setTime();
    renderTimer();
    //endQuiz();
}

// render the timer
function renderTimer() {
    timeLeft.textContent = secondsElapsed;

    if (secondsElapsed <= 0) {
        stopTimer();
        console.log("OUTTA TIME");
        endQuiz();
    }
    else if (secondsElapsed < 11){
        timeLeft.classList.add("final-countdown");
        timeText.classList.add("final-countdown");
    }
}

// MORE QUIZ FUNCTIONALITY
// ================================================================

// CHECK THAT ANSWER
function checkAnswer() {
    // console.log("CHECKED!");
    // console.log(this);
    // console.log("this.value: " + this.value);

    if (this.value === myQuiz[currentQuestion].answer) {
        console.log("CORRECT!");
        cntCorrect++;
        updateScoreTime("correct");
        this.classList.add("correct-answer");
    }
    else {
        console.log("WRONG");
        cntWrong++;
        updateScoreTime("wrong");
        this.classList.add("wrong-answer");
    }

    if (currentQuestion < myQuiz.length) {
        currentQuestion++;
        setTimeout(nextQuestion, 250);
    }
    else if (currentQuestion >= myQuiz.length) {
        setTimeout(endQuiz, 250);
    }

}


// Functions - Change the display
// =================================================================================================

// Show Quiz Section, hide everything else
function toggleQuizPage() {
    console.log("toggle quiz on");

    for (var i = 0; i < mainSections.length; i++) {


        if (mainSections[i].id == "main-quiz" || mainSections[i].id == "footer-quiz") {

            mainSections[i].classList.remove("d-none");
            console.log("SHOW: " + mainSections[i].id);
        }
        else {

            mainSections[i].classList.add("d-none");
            console.log("HIDE: " + mainSections[i].id);
        }
    }
}

// Showw Directions, hide everything else
function toggleDirectionsPage() {

    console.log("toggle directions on");

    for (var i = 0; i < mainSections.length; i++) {
        if (mainSections[i].id == "main-directions" || mainSections[i].id == "footer-main") {

            mainSections[i].classList.remove("d-none");
            //console.log("SHOW: " + mainSections[i].id);
        }
        else {

            mainSections[i].classList.add("d-none");
            //console.log("HIDE: " + mainSections[i].id);
        }
    }
}

// Show High Score section, hide everything else
function toggleHighScorePage() {

    //
    console.log("toggle scores on");

    for (var i = 0; i < mainSections.length; i++) {
        //console.log(mainSections[i].id);

        if (mainSections[i].id == "main-highscore" || mainSections[i].id == "footer-quiz") {

            mainSections[i].classList.remove("d-none");
           // console.log("SHOW: " + mainSections[i].id);
        }
        else {

            mainSections[i].classList.add("d-none");
           // console.log("HIDE: " + mainSections[i].id);
        }
    }

    initPlayerList();
}

// update Quiz Footer
function renderFooter() {
    numCorrect.textContent = cntCorrect;
    numWrong.textContent = cntWrong;
}


// CLEAR QUESTION'S ANSWER
function clearChoices() {
    var ele = document.getElementsByName("choices");

    for (var i = 0; i < ele.length; i++) {

        //set everything to false;
        ele[i].checked = false;
        ///console.log(ele[i]);

        //remove css styling for good&bad answers
        if (ele[i].classList.contains("correct-answer")) {
            ele[i].classList.remove("correct-answer");
        }
        else if (ele[i].classList.contains("wrong-answer")) {
            ele[i].classList.remove("wrong-answer");
        }
    }
}


function nextQuestion() {
    clearChoices();
    renderFooter();
    renderQuestion();

}

function endQuiz() {
    endScore.textContent = currentScore;
    stopTimer();

    timeLeft.classList.remove("final-countdown");
    timeText.classList.remove("final-countdown");

    toggleHighScorePage();

}

function updateScoreTime(answer) {
    
    console.log("old score: " + currentScore);

    if (answer == "correct") {
        currentScore += 5;
        console.log("new score: " + currentScore);
    }
    else if (answer == "wrong") {
        if(currentScore <= 0 || (currentScore - 2) <= 0){
            currentScore = 0;
            secondsElapsed -= 10;
            console.log("new score: " + currentScore);
            renderTimer();
        }
        else{
            currentScore -= 2
            secondsElapsed -= 20;
            console.log("new score: " + currentScore);
            renderTimer();
        }       
    }
}


//Event Listeners
startBtn.addEventListener("click", startQuiz);
radBtnA.addEventListener("click", checkAnswer);
radBtnB.addEventListener("click", checkAnswer);
radBtnC.addEventListener("click", checkAnswer);
radBtnD.addEventListener("click", checkAnswer);

$('#viewScores').click(function () { toggleHighScorePage(); return false; });

submitPlayerBtn.addEventListener("click", function (event) {
    event.preventDefault();

    var enteredText = enteredInits.value.trim();


    if (enteredText === "") {
        return;
    }
    var newPlayScore = Object.create(player);

    //add new player and score to list
    newPlayScore.name = enteredText;
    //console.log(newPlayScore.name);

    newPlayScore.score = currentScore;
    //console.log(newPlayScore.score);

    players.push(newPlayScore);

    enteredInits.value = "";
    storePlayerList();
    renderPlayerList();

})

$("#form-init").submit(function (event) {
    event.preventDefault();

    var enteredText = enteredInits.value.trim();


    if (enteredText === "") {
        return;
    }
    var newPlayScore = Object.create(player);

    //add new player and score to list
    newPlayScore.name = enteredText;
    //console.log(newPlayScore.name);

    newPlayScore.score = currentScore;
    //console.log(newPlayScore.score);

    players.push(newPlayScore);

    enteredInits.value = "";
    storePlayerList();
    renderPlayerList();

})


function blink() {
    $('.final-countdown').fadeOut(200).fadeIn(200, blink);
};