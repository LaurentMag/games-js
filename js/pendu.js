"use strict";

const penduWord = document.querySelector(".pendu-result");
const displaySelectedLetter = document.querySelector(".pendu-displayLetter");
const body = document.querySelector("body");

const PENDU_SETTING = {
  oneOrTwoPlayer: 1,
  lifeCount: 6,
  //
  selectedLetter: "",
  // fetched txt as array
  txtToArray: [],
  //
  newGameWord: "",
  hiddenWord: [],
};

/*



*/

const toggleClass = () => {
  letterContainer.classList.toggle("hiddenLetter");
};

const letterContainer = document.querySelector(".pendu-displayLetter-container");

const test = document.querySelector(".hide-test");

test.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  toggleClass();
});

/*



*/

// =====================================================================================================================
// UTILITIES
// get a random index from an array
const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

const createHiddenWord = (wordAsArray) => {
  for (let i = 0; i < wordAsArray.length; i++) {
    PENDU_SETTING.hiddenWord.push("-");
  }
};

const sendHiddenWordToHtml = (toDisplay) => {
  penduWord.innerHTML = `${toDisplay.join(" ")}`;
};

const sendSelectLetterToHtml = (letter) => {
  displaySelectedLetter.innerHTML = `${letter}`;
};

// RESET GAME AFTER A WIN OR LOSE
const reset = () => {
  PENDU_SETTING.lifeCount = 6;
  // reset the PENDU_SETTING.hiddenWord array at each "start / restart"
  PENDU_SETTING.hiddenWord = [];
  getWord(PENDU_SETTING.txtToArray);
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================
// TRANSFORM FETCHED .TXT INTO ARRAY
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const toArray = (textParam) => {
  // set text into array
  // use regex to "split" with space (\s) coma (,) or next line (\n)
  // + mean : eventualy several
  return (PENDU_SETTING.txtToArray = textParam.split(/[\s,\n]+/));
};

// FETCH .TXT
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
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
    // then trigger the getWord for the very first time
    // as its async function can be declared after ( as const )
    .then(() => getWord(PENDU_SETTING.txtToArray));
};

// get a random new word when new game
// setup 1player
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const getWord = (array) => {
  if (PENDU_SETTING.oneOrTwoPlayer == 1) {
    // select a random word from the .txt turned as array
    PENDU_SETTING.newGameWord = array[randomIndex(array)];
    // create the hidden word to be displayed in the html
    createHiddenWord(PENDU_SETTING.newGameWord);
    // set the html display
    sendHiddenWordToHtml(PENDU_SETTING.hiddenWord);
  }
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================

// check if "letter" belong to the PENDU_SETTING.newGameWord
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const checkForLetter = (letter, currentGameWord, hiddenWord) => {
  for (const letterIndex in currentGameWord) {
    if (letter.toLowerCase() === currentGameWord.toLowerCase().charAt(letterIndex)) {
      // here === do not work !? 🤷‍♂️
      if (letterIndex == 0) {
        console.log("index 0");
        // set first letter un uppercase
        hiddenWord[letterIndex] = letter.toUpperCase();
      } else {
        hiddenWord[letterIndex] = letter.toLowerCase();
      }
      // HTML DISPLAY
      sendHiddenWordToHtml(hiddenWord);
    }
  }
  if (!hiddenWord.includes(letter)) {
    PENDU_SETTING.lifeCount -= 1;
  }

  console.log(PENDU_SETTING.lifeCount);
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const winConsCheck = () => {
  // WIN CONDITION AND ACTION
  if (PENDU_SETTING.hiddenWord.includes("-") === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");
    reset();
  }
  // LOST CONDITION AND ACTION
  if (PENDU_SETTING.lifeCount === 0) {
    console.log("PERDU");
    reset();
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const hangmanLogic = (letterFromInput) => {
  console.log("current word : ", PENDU_SETTING.newGameWord);
  console.log(letterFromInput);
  // check if the letter is in the selected word
  checkForLetter(letterFromInput, PENDU_SETTING.newGameWord, PENDU_SETTING.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================

// toggleClass();
body.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const regex = /[A-Za-z]/;

  // check if the pressed key is a letter and
  // only length of 1 ( otherwise can display "shift" / "command"... and other function keys)
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    PENDU_SETTING.selectedLetter = e.key;
    sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
  }

  // SEND TO HANGMANLOGIC THE LETTER IF ENTER & IF LETTER ISNT <empty.string>
  if (e.key === "Enter" && PENDU_SETTING.selectedLetter !== "") {
    toggleClass();
    hangmanLogic(PENDU_SETTING.selectedLetter);
    PENDU_SETTING.selectedLetter = "";
    sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);

    // SEND ERR MESS IF ENTER & LETTER IS <empty.string>
    // ( else if as need to check if can send first, otherwise will send err mess after each succesfull send)
  } else if (e.key === "Enter" && PENDU_SETTING.selectedLetter === "") {
    console.log("Type a Key");
  }

  // DELETED LETTER
  if (e.key == "Backspace") {
    toggleClass();
    PENDU_SETTING.selectedLetter = "";
    sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
  }
});

// =====================================================================================================================
// trigger fetch at start ( this will trigger the getWord for the first game)
fetchPenduTxt();
