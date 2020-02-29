// GLOBAL VARIABLES
//=====================================================================
var theCriteria = {
    lowercaseArr: 'abcdefghijklmnopqrstuvwxyz',
    uppercaseArr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numericArr: '0123456789',
    specialArr: " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
};

// Assignment Code
var generateBtn = $("generate"); //document.querySelector("#generate");
var exModal = $("#criModal"); //document.querySelector("#exampleModal");
var passLength = document.querySelector("#pass-len");
var createdCnt = 0;


// DELCARE FUNCTIONS
//=====================================================================

// Write password to the #password input
function writePassword(oLen, oArr) {
    console.log(oLen, oArr.length);
    var password = generatePassword(oLen, oArr);
    var passwordText = document.querySelector("#password");

    passwordText.value = password;

}

function generatePassword(aLen, anArr) {
    console.log(aLen, anArr.length);

    var almostPass = getNonRandomString(aLen, anArr);
    var newPassword = shufflePassword(almostPass);

    return newPassword;
}


// MAIN LOGIC CALLING
// ==========================================================================

$(document).ready(function () {


    //show the Password Criteria modal
    $("#generate").on("click", function () {

        console.log("show password criteria modal");

        $(exModal).modal('show');
    });


    //when Generate is clicked
    $("#getCharCrit").on("click", function () {

        console.log("Trying to submit");

        var checkedCount = 0;
        var tmpArr = [];
        var userLength = passLength.value;
        var form = $("#critForm");

        console.log(userLength);

        // count checkboxs checked for validation purposes
        $(":checkbox").each(function () {
            if (this.checked) {
                checkedCount++;
            }
        })

        // update checkbox required attr for validation purposes
        // If nothing is checked, add required attr so not allowed to proceed
        if (checkedCount == 0) {
            $(":checkbox").each(function () {
                this.required = true;
                tmpArr = []; //ensure array is empty if nothing checked
            })
        }

        //if something is checked, remove required tag, allow to submit
        else if (checkedCount > 0) {
            $(":checkbox").each(function () {
                this.required = false;
                if (this.checked) {
                    tmpArr.push($(this).data('text'));
                }
            })

        }

        //validate input - if bad
        if (form[0].checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }

        //if everythinglooks good, go go go!!
        else if (form[0].checkValidity()) {

            console.log("ALL GOOD. DO IT! DO IT! DO IT!");
            console.log(userLength);
            for (var k = 0; k < tmpArr.length; k++) {
                console.log("printing arr: " + tmpArr[k]);
            }

            writePassword(userLength,tmpArr);
            $(exModal).modal('hide');
        }

        form.addClass('was-validated');

    }); // CLICKED


});


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

//generate password string - not randomized
function getNonRandomString(passLen, theCritArr) {

    var stringLen = generate(passLen, theCritArr.length);

    var passwordstring = "";


    console.log("passlen: " + passLen);
    console.log("arr length: " + theCritArr.length);

    for (var k = 0; k < theCritArr.length; k++) {

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

    return passwordstring;
}

//randomize the string
function shufflePassword(oldPass) {
    console.log("shuffling string to randomize password");
    var holdPass = oldPass.split("");
    var holdLen = holdPass.length;

    for (var i = holdLen - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = holdPass[i];
        holdPass[i] = holdPass[j];
        holdPass[j] = tmp;
    }



    console.log(holdPass.join(""));
    var newPass = holdPass.join("")
    return newPass;

}