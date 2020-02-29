// Assignment Code
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
    var password = generatePassword();
    var passwordText = document.querySelector("#password");

    passwordText.value = password;

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);

// GLOBAL VARIABLES
//=====================================================================
var theCriteria = {
    lowercaseArr: 'abcdefghijklmnopqrstuvwxyz',
    uppercaseArr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numericArr: '0123456789',
    specialArr: " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
};


// Generate password
function generatePassword() {

    var newPassLen = getPasswordLength();
    var critArr = getCriteria();
    var almostPass = getNonRandomString(newPassLen, critArr);
    var newPassword = shufflePassword(almostPass);
    var password = newPassword;

    return password;
}//

//Get password length
function getPasswordLength() {
    var minPassLength;
   // var maxPassLength;
    var valid = false;

    //get min
    while (!valid) {
        minPassLength = parseInt(prompt("Enter password length (min 8,max 128):"), 10);
        console.log(minPassLength);

        if (Number.isNaN(minPassLength)) {
            alert("Invalid Response");
            valid = false;
        }
        else if (minPassLength < 8 || minPassLength > 128) {
            alert(minPassLength + "  is an invalid number");
            console.log(minPassLength + "  is an invalid number");
            valid = false;
        }
        else if (minPassLength >= 8 || minPassLength <= 128) {
            valid = true;
        }
    }
    // }

    console.log(minPassLength + " = new password length");

    return minPassLength;
}



function getInput(crit) {
    var getInput;
    var valid = false;

    while (!valid) {

        getInput = prompt("Include " + crit + " characters?\n Enter y for yes, n for no:");
        if (getInput == null){
            alert("Invalid Response");
            valid = false;
        }
        else{
            getInput.toLowerCase();
            console.log(crit + ": " + getInput);
    
            if (getInput === "y") {
                valid = true;
                return true;
            }
    
            else if (getInput === "n") {
                valid = true;
                return false;
            }
    
            else{
                alert("Invalid Response");
                valid =  false;
            }
        }
       
    }
}

//get criteria
function getCriteria() {
    var criteriaArr = [];
    var meetCriteria = false;

    while (!meetCriteria) {

        if (getInput("lowercase")) {
            criteriaArr.push("lowercaseArr");
            meetCriteria = true;
        }

        if (getInput("UPPERCASE")) {
            criteriaArr.push("uppercaseArr");
            meetCriteria = true;
        }

        if (getInput("numeric")) {
            criteriaArr.push("numericArr");
            meetCriteria = true;
        }

        if (getInput("special")) {
            criteriaArr.push("specialArr");
            meetCrtieria = true;
        }

        if(!meetCriteria){
        alert("Must Choose on character criteria");
        }

    }//end while

    return criteriaArr;

}


//get random numbers for criteria length
function randombetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generate(max, thecount) {
    var r = [];
    var currsum = 0;
    for (var i = 0; i < thecount - 1; i++) {
        r[i] = randombetween(1, max - (thecount - i - 1) - currsum);
        currsum += r[i];
    }

    r[thecount - 1] = max - currsum;
    return r;
}

function getNonRandomString(passLen, theCritArr) {

    var stringLen = generate(passLen, theCritArr.length);

    var passwordstring = "";


    console.log("passlen: " + passLen);
    console.log("arr length: " + theCritArr.length);

    for (var k = 0; k < theCritArr.length;k++){

        console.log(stringLen[k]);
    }

    for (var i = 0; i < theCritArr.length; i++) {
        var j = 0;
        while (j < stringLen[i]) {
            var len = theCriteria[theCritArr[i]].length;
            var index = Math.floor(Math.random() * len);
            var aChar = theCriteria[theCritArr[i]].charAt(index);
            passwordstring += aChar;
            j++;
        }
    }

    console.log("=====GENERTATING PASSWORD========");
    console.log(passwordstring);

    // for (var i = 0; i < critArr.length; i++) {
    //     console.log(critArr[i]);
    //     console.log(

    //         theCriteria[critArr[i]].length ;
    // }

    return passwordstring;
}

function shufflePassword(oldPass){
    console.log("shuffling string to randomize password");
    var holdPass = oldPass.split("");
    var holdLen = holdPass.length;

    for(var i = holdLen - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i+1));
        var tmp = holdPass[i];
        holdPass[i] = holdPass[j];
        holdPass[j] = tmp;
    }

    

    console.log(holdPass.join(""));
    var newPass = holdPass.join("")
    return newPass;

}
