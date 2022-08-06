"use strict";

// HTML ELEMENTS

const penduWord = document.querySelector(".pendu-result");
const displaySelectedLetter = document.querySelector(".pendu-displayLetter");
const body = document.querySelector("body");

const penduResultContainer = document.querySelector(".pendu-result-container");
const letterContainer = document.querySelector(".pendu-displayLetter-container");

// =====================================================================================================================
// animation delay (used for selected letter -for now-)
const delay = 120;

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

const logInfo = () => {
  console.log("current word : ", PENDU_SETTING.newGameWord);
  console.log(PENDU_SETTING.selectedLetter);
  console.log(PENDU_SETTING.lifeCount);
  console.log("-----------------------");
};

// =====================================================================================================================
// UTILITIES
/**
 * Return a random index from an Array
 * @param Array
 * @returns index ( number )
 */
const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

/**
 * Take create the hidden word (array) using the game selected word length
 * @param {*} the reference Array
 */
const createHiddenWordArray = (modelArray) => {
  for (let i = 0; i < modelArray.length; i++) {
    PENDU_SETTING.hiddenWord.push("-");
  }
};

/**
 * display the typed letter in the innerHtml
 * @param letter - letter coming from input
 */
const sendSelectLetterToHtml = (letter) => {
  displaySelectedLetter.innerHTML = `${letter}`;
};

// =====================================================================================================================
// ANIMATIONS

const animfadeOutFadeIn = () => {
  letterContainer.classList.add("hiddenLetter");
  setTimeout(() => {
    letterContainer.classList.remove("hiddenLetter");
  }, delay);
};

const animFadeOut = () => {
  letterContainer.classList.add("hiddenLetter");
};

// =====================================================================================================================
// CREATE / MANAGE RESULT ELEMENTS

/**
 * Generate a paragraph>, append it, and assign a class
 * @param letterToDisplay - which letter will be displayed in the created <p>
 * @param index - Array index used to number indiviual <p>, for unique class name
 */
const createLetterElem = (letterToDisplay, index) => {
  const hiddenWordLetter = document.createElement("p");
  penduResultContainer.append(hiddenWordLetter);
  hiddenWordLetter.innerHTML = `${letterToDisplay}`;
  // use array index to number letter class, will be used to know which letter need to be replaced
  hiddenWordLetter.className = `hidden-letter-${index}`;
};

/**
 * Map through the hiddenWord array and
 * Create a paragraph per letter
 */
const createHiddenWordHTML = () => {
  PENDU_SETTING.hiddenWord.map((letter, index) => {
    createLetterElem(letter, index);
  });
};

/**
 * Clear HTML display from the hiddenWord
 *
 * Invidual <p> for each letter,
 *
 * invoked at a game end
 */
const cleanHiddenWordHTML = () => {
  // get nodeList with elements with class starting by...
  const lettersNodeList = document.querySelectorAll("[class^=hidden-letter-]");
  lettersNodeList.forEach((element) => element.remove());
};

/**
 * Change a designated <p> innerHtml according to an array index,
 *
 * by selecting the element by his class
 * @param letterToChange - the letter that will be changed in the hidden word
 * @param index - the index of the letter in the word that is being guessed
 */
const changeHiddenWordLetter = (letterToChange, index) => {
  const whereToChange = document.querySelector(`.hidden-letter-${index}`);

  whereToChange.innerHTML = `${letterToChange}`;
};

// =====================================================================================================================
// =====================================================================================================================

/**
 * check if first word letter to set it in upperCase
 * @param index - Index of the letter
 * @param indexToUpper - what index will make the letter to be uppercase
 * @param letter - the letter to be converted to upper or lower case
 * @returns transformed letter
 */
const upperOrLowerCase = (index, indexToUpper, letter) => {
  let returnedLetter = "";
  //  === do not work !? 🤷‍♂️
  if (index == indexToUpper) {
    returnedLetter = letter.toUpperCase();
  } else {
    returnedLetter = letter.toLowerCase();
  }
  return returnedLetter;
};

/**
 * Checks if the letter is part of the word to guess,
 * - if it is, it replaces the underscore with the letter,
 * - if it's not, it decreases the life count
 * @param letter - the letter that the user has entered
 * @param wordToGuess - the word that the player is trying to guess
 * @param hiddenWord - the word to be guessed, but with all the letters hidden.
 */
const checkForLetter = (letter, wordToGuess, hiddenWord) => {
  for (const letterIndex in wordToGuess) {
    if (letter === wordToGuess.charAt(letterIndex)) {
      // HTML DISPLAY - letter & index as parameters
      changeHiddenWordLetter(upperOrLowerCase(letterIndex, 0, letter), letterIndex);
      // update the array as the display is now independant
      PENDU_SETTING.hiddenWord[letterIndex] = letter;
    }
  }
  if (!hiddenWord.includes(letter)) {
    PENDU_SETTING.lifeCount -= 1;
  }
  // DEBUG
  logInfo();
  console.log(PENDU_SETTING.hiddenWord);
};

// =====================================================================================================================
// =====================================================================================================================
// GAME LOGIC

/**
 * function to set a new hangman game
 * - check if 1 or 2 players
 * - selected a random word
 * - create the hiddenWord array according to the selected word
 * - create the html display
 * @param array - the array of words from the .txt file
 */
const setupNewGame = (array) => {
  if (PENDU_SETTING.oneOrTwoPlayer == 1) {
    // select a random word from the .txt turned as array
    // generate lowerCase word
    PENDU_SETTING.newGameWord = array[randomIndex(array)].toLowerCase();
    // create the hidden word to be displayed in the html
    createHiddenWordArray(PENDU_SETTING.newGameWord);
    // create html hiddenWord Display
    createHiddenWordHTML();
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
//
/**
 * Reset game parameter after a win or lose
 * - reset life count
 * - reset hiddenWord to an empty array ( bc how the array is created need empty it)
 * - clear the hiddenWord html display
 * - invoke setupNewGame
 */
const reset = () => {
  PENDU_SETTING.lifeCount = 6;
  // reset the PENDU_SETTING.hiddenWord array at each "start / restart"
  PENDU_SETTING.hiddenWord = [];
  // Clean html display from preview word
  cleanHiddenWordHTML();
  //
  setupNewGame(PENDU_SETTING.txtToArray);
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
/**
 * It checks if the hidden word is fully revealed
 *
 * or
 *
 * if the player has no more life left
 *
 * In both situation Reset the game
 */
const winConsCheck = () => {
  if (PENDU_SETTING.hiddenWord.includes("-") === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");
    reset();
  }
  if (PENDU_SETTING.lifeCount === 0) {
    console.log("PERDU");
    reset();
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
const gameLogic = (letterFromInput) => {
  // check if the letter is in the selected word
  checkForLetter(letterFromInput, PENDU_SETTING.newGameWord, PENDU_SETTING.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};

// =====================================================================================================================
// =====================================================================================================================

function manageInput(e) {
  const regex = /[A-Za-z]/;
  //
  // length of 1 = otherwise can display "shift" / "command"... and other function keys as string
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    animfadeOutFadeIn();

    PENDU_SETTING.selectedLetter = e.key.toLowerCase();

    // add timeout to add letter to let anim run first
    setTimeout(() => {
      sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
    }, delay);
  }

  // :::::::::::::::::::::::::::
  if (e.key === "Enter" && PENDU_SETTING.selectedLetter !== "") {
    // INVOKE GAME LOGIC WHEN "ENTER" and LETTER ISNT <empty.string>
    gameLogic(PENDU_SETTING.selectedLetter);
    // reset letter after "enter"
    animFadeOut();
    PENDU_SETTING.selectedLetter = "";
  } else if (e.key === "Enter" && PENDU_SETTING.selectedLetter === "") {
    // SEND ERR MESS IF ENTER & LETTER IS <empty.string>
    // ( else if as need to check if can send first, otherwise will send err mess after each succesfull send as letter is reset)
    console.log("Type a Key");
  }

  // :::::::::::::::::::::::::::
  // DELETED LETTER
  if (e.key == "Backspace") {
    animFadeOut();
    PENDU_SETTING.selectedLetter = "";
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
// KEY PRESS MANAGEMENT
body.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.stopPropagation();

  manageInput(e);
});

// =====================================================================================================================
// =====================================================================================================================
// ::::::::::::::::::::::::::::::::::::::::::::::::::::
/**
 * Take the fetched .txt ( string ) and convert it to an Array of individual words
 * @param textParam - The text to be converted to an array.
 * @returns the array
 */
const toArray = (textParam) => {
  // set text into array
  // use regex to "split" with space (\s) coma (,) or next line (\n)
  // + mean : eventualy several
  return (PENDU_SETTING.txtToArray = textParam.split(/[\s,\n]+/));
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
/**
 * FetchPenduTxt() fetches the text file,
 *
 * converts it to an array, and then setup the game ( invoke setupNewGame)
 */
const fetchPenduTxt = () => {
  // when consoleLog(response) got a basic "object", and as its a text need to use the method .text()
  // if console response.text() directly it send a promise with <state> pending
  // it mean it need another .then to process the received promise ( correct ?)
  fetch("./pendu-mots.txt")
    .then((response) => response.text())
    // trigger the transform into array
    .then((text) => toArray(text))
    // then trigger the setupNewGame for the first time
    // as its async function can be declared after ( as const )
    .then(() => setupNewGame(PENDU_SETTING.txtToArray));
};

// trigger fetch at start ( this will trigger the setupNewGame for the first game)
fetchPenduTxt();
// =====================================================================================================================
// =====================================================================================================================

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const returnedFunction = debounce(function () {
  // All the taxing stuff you do
}, 250);

// window.addEventListener('resize', returnedFunction);
