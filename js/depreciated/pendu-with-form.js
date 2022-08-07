"use strict";

const form = document.querySelector(".form-pendu");
const input = document.querySelector("#penduLetterId");
const penduWord = document.querySelector(".pendu-result");

const body = document.querySelector("body");

body.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const regex = /[A-Za-z]/;

  // check if the pressed key is a letter and
  // only length of 1 ( otherwise can display "shift" / "command"... and other function keys)
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    // display the letter in the input field
    // e.target.value = e.key;

    console.log(e.key);
  }
  // if (e.key == "Backspace") {
  //   // letter can be "deleted"
  //   e.target.value = ""; // clear the display
  // }
});

const PENDU_SETTING = {
  oneOrTwoPlayer: 1,
  newGame: true,
  lifeCount: 6,
};

let txtToArray = [];
let newGameWord = "";
let hiddenWord = [];

// ==================================================================
// UTILITIES
// get a random index from an array
const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

const hideWord = (wordAsArray) => {
  for (let i = 0; i < wordAsArray.length; i++) {
    hiddenWord.push("-");
  }
};

const sendResultToHtml = (toDisplay) => {
  penduWord.innerHTML = `${toDisplay.join(" ")}`;
};

// =====================================================================================================================
// TRANSFORM FETCHED .TXT INTO ARRAY ---------------------
const toArray = (textParam) => {
  // set text into array
  // use regex to "split" with space (\s) coma (,) or next line (\n)
  // + mean : eventualy several
  return (txtToArray = textParam.split(/[\s,\n]+/));
};

// FETCH .TXT ---------------------
const fetchPenduTxt = () => {
  // when consoleLog(response) got a basic "object", and as its a text need to use the method .text()
  // if console response.text() directly it send a promise with <state> pending
  // it mean it need another .then to process the received promise ( correct ?)
  fetch("./pendu-mots.txt")
    .then((response) => response.text())
    .then((text) => {
      // trigger the transform into array
      toArray(text);
    })
    // then trigger the getWord
    // as its async function can be declared after ( as const )
    .then(() => getWord(txtToArray));
};

// get a random new word when new game
// setup 1player
const getWord = (array) => {
  // reset the hiddenWord array at each "start / restart"
  hiddenWord = [];
  if (PENDU_SETTING.newGame === true) {
    // set PENDU_SETTING.newGame to false to prevent get a new word as long as preview game isnt finished
    PENDU_SETTING.newGame = false;

    if (PENDU_SETTING.oneOrTwoPlayer == 1) {
      // select a random word from the .txt turned as array
      newGameWord = array[randomIndex(array)];
      // create the hidden word to be displayed in the html
      hideWord(newGameWord);
      // set the html display
      sendResultToHtml(hiddenWord);
    }
  }
};

// =====================================================================================================================

// check if "letter" belong to the newGameWord
const checkForLetter = (letter) => {
  for (const letterIndex in newGameWord) {
    if (letter.toLowerCase() === newGameWord.toLowerCase().charAt(letterIndex)) {
      //
      console.log("trouvé", letter, "at index : ", letterIndex);
      //
      if (letterIndex === 0) {
        // set first letter un uppercase
        hiddenWord[letterIndex] = letter.toUpperCase();
        sendResultToHtml(hiddenWord);
      } else {
        hiddenWord[letterIndex] = letter.toLowerCase();
        sendResultToHtml(hiddenWord);
      }
    }
  }
};

const winConsCheck = () => {
  if (hiddenWord.includes("-") === true) {
    PENDU_SETTING.lifeCount -= 1;

    if (PENDU_SETTING.lifeCount === 0) {
      console.log("PERDU");
      PENDU_SETTING.newGame = true;
      getWord(txtToArray);
    }
  } else {
    // no more "-" mean word found,
    // set newGame to true to restart the "getword"
    console.log(" VICTORY ");
    PENDU_SETTING.newGame = true;
    getWord(txtToArray);
  }
};

const hangmanLogic = (letterFromInput) => {
  console.log("current word : ", newGameWord);
  // check if the letter is in the selected word
  checkForLetter(letterFromInput);
  // at each letter input check for the winCons / lose
  winConsCheck();
};

// =====================================================================================================================
// ON KEYDOWN EVENT ---------------------
const preventDefaultInputDisplay = (e) => {
  // need to exclude "Enter" to be able to submit the form with it
  if (e.key !== "Enter") {
    // as its key down ( come before key up ), would let special character to display in the input.
    // the preventDefaut() will make the input key down behavior to be totaly ignored
    e.preventDefault();
    e.stopPropagation();
  }
};

// ON KEYUP EVENT ---------------------
// force input to display the pressed key and only "A" to "Z" character
const inputFilterForDisplay = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const regex = /[A-Za-z]/;

  // check if the pressed key is a letter and
  // only length of 1 ( otherwise can display "shift" / "command"... and other function keys)
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    // display the letter in the input field
    e.target.value = e.key;
  }
  if (e.key == "Backspace") {
    // letter can be "deleted"
    e.target.value = ""; // clear the display
  }
};

// FORM submit : get input key  ---------------------
const formManagement = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.target.penduLetterId.value !== "") {
    // trigger game logic with each letter submit
    hangmanLogic(e.target.penduLetterId.value);
    // clear input field after form submit
    setTimeout(() => {
      e.target.penduLetterId.value = "";
    }, 250);
    // if its not a letter
  } else {
    console.log("enter a letter");
  }
};

// =====================================================================================================================
// trigger fetch at start ( this will trigger the getWord for the first game)
fetchPenduTxt();
// generate listener :
// manage what to display in the input
input.addEventListener("keyup", inputFilterForDisplay);
// prevent any input display from typing
input.addEventListener("keydown", preventDefaultInputDisplay);
// for submit management
form.addEventListener("submit", formManagement);
