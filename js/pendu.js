"use strict";

import {fetchPenduTxt} from "./pendu-fetch.js";

// HTML ELEMENTS

const penduWord = document.querySelector(".pendu-result");
const displaySelectedLetter = document.querySelector(".pendu-displayLetter");
const body = document.querySelector("body");

const penduResultContainer = document.querySelector(".pendu-result-container");
const letterContainer = document.querySelector(".pendu-displayLetter-container");

// =====================================================================================================================
// animation delay (used for selected letter -for now-)
const delay = 120;

export const PENDU_SETTING = {
  defaultLifeCount: 6,
  // fetched txt as array
  txtToArray: [],
  //
  oneOrTwoPlayer: 1,
  newGameWord: "",
  hiddenWord: [],
  selectedLetter: "",
  duringGameLife: 0,
};

const logInfo = () => {
  console.log("current word : ", PENDU_SETTING.newGameWord);
  console.log(PENDU_SETTING.selectedLetter);
  console.log(PENDU_SETTING.duringGameLife);
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
    PENDU_SETTING.hiddenWord.push("_");
  }
};

/**
 * display the letter from input in the innerHtml
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
 * Map through the hiddenWord array.
 *
 * Create a paragraph per letter
 */
const createHiddenWordHTML = () => {
  PENDU_SETTING.hiddenWord.map((letter, index) => {
    createLetterElem(letter, index);
  });
};

/**
 * Clear HTML display from the hiddenWord, Invidual p for each letter,
 */
const cleanHiddenWordHTML = () => {
  // get nodeList with elements with class starting by...
  const lettersNodeList = document.querySelectorAll("[class^=hidden-letter-]");
  // if the nodeList isnt empty there is something to delete
  if (lettersNodeList.length !== 0) {
    lettersNodeList.forEach((element) => element.remove());
  }
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
      changeHiddenWordLetter(letter, letterIndex);
      // also update the array ( use for win / lose check ) as the display is independant
      PENDU_SETTING.hiddenWord[letterIndex] = letter;
    }
  }
  if (!hiddenWord.includes(letter)) {
    PENDU_SETTING.duringGameLife -= 1;
  }
  // DEBUG
  logInfo();
  console.log(PENDU_SETTING.hiddenWord);
};

// =====================================================================================================================
// =====================================================================================================================
// GAME LOGIC

// new game invoked after first fetch, and after a win or lose
/**
 * function to set / restart a new hangman game
 * - reset life count to default
 * - reset hiddenWord to an empty array ( bc how the array is created need empty it)
 * - clear the hiddenWord html display
 * - check if 1 or 2 players
 * - selected a random word
 * - create the hiddenWord array according to the selected word
 * - create the html display
 */
export const setupNewGame = () => {
  const wordListArray = PENDU_SETTING.txtToArray;

  PENDU_SETTING.duringGameLife = PENDU_SETTING.defaultLifeCount;
  // reset the PENDU_SETTING.hiddenWord array at each "start / restart"
  PENDU_SETTING.hiddenWord = [];
  // Clean html display from preview word if needed
  cleanHiddenWordHTML();

  if (PENDU_SETTING.oneOrTwoPlayer == 1) {
    // select a random word from the .txt turned as array
    // generate lowerCase word
    PENDU_SETTING.newGameWord = wordListArray[randomIndex(wordListArray)].toUpperCase();
    // create the hidden word to be displayed in the html
    createHiddenWordArray(PENDU_SETTING.newGameWord);
    // create html hiddenWord Display
    createHiddenWordHTML();
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
// WIN OR LOOSE CHECK AND EFFECT : will be changed
const winConsCheck = () => {
  if (PENDU_SETTING.hiddenWord.includes("_") === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");

    setTimeout(() => {
      setupNewGame();
    }, 1000);
  }
  if (PENDU_SETTING.lifeCount === 0) {
    console.log("PERDU");

    setTimeout(() => {
      setupNewGame();
    }, 1000);
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::
/**
 * GameLogic invoked after each letter guess send
 * It checks if the letter is in the selected word, and then checks for the winCons / lose
 * @param letterFromInput - typed letter in the input field
 */
const gameLogic = (letterFromInput) => {
  // check if the letter is in the selected word
  checkForLetter(letterFromInput, PENDU_SETTING.newGameWord, PENDU_SETTING.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};

// =====================================================================================================================
// =====================================================================================================================

/**
 * input management invoked in body eventListener
 *
 * Check if its a letter, if so, send it to GameLogic. Else, request to type a letter.
 * Option to deleted typed letter, and handle animation display management
 *
 * @param e - event coming from keyup eventListener
 */
function manageInput(e) {
  const regex = /[A-Za-z]/;
  //
  // length of 1 = otherwise can display "shift" / "command"... and other function keys as string
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    animfadeOutFadeIn();

    PENDU_SETTING.selectedLetter = e.key.toUpperCase();
    // add timeout to add letter for fadeOut anim part to run first
    setTimeout(() => {
      sendSelectLetterToHtml(PENDU_SETTING.selectedLetter);
    }, delay);
  }

  // ______________________________________________________________
  if (e.key === "Enter" && PENDU_SETTING.selectedLetter !== "") {
    // INVOKE GAME LOGIC WHEN "ENTER" and LETTER ISNT <empty.string>
    gameLogic(PENDU_SETTING.selectedLetter);
    // reset letter after "enter"
    animFadeOut();
    PENDU_SETTING.selectedLetter = "";
    //
  } else if (e.key === "Enter" && PENDU_SETTING.selectedLetter === "") {
    // SEND ERR MESS IF ENTER & LETTER IS <empty.string>
    // ( else if as need to check if can send first, otherwise will send err mess after each succesfull send as letter is reset)
    console.log("Type a Key");
  }

  // ______________________________________________________________
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
