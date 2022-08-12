"use strict";

import {fetchPenduTxt} from "./pendu-fetch.js";
import {
  animAddClass,
  animfadeOutFadeIn,
  animToChangeHiddenLetter,
  intervalHideLettersAndNewGame,
  intervalShowElements,
} from "./pendu-animation.js";

// HTML ELEMENTS

const body = document.querySelector("body");
const lifeCountContainer = document.querySelector(".life-count--container");
const displaySelectedLetter = document.querySelector(".pendu-displayLetter");

const hiddenWordDisplayContainer = document.querySelector(".pendu-result-container");

let hiddenWordLetterList = [];
let lifeElementList = [];

const typedLetterContainer = document.querySelector(".pendu-displayLetter-container");

// =====================================================================================================================
// ==================================================    SETTINGS    ==================================================
// =====================================================================================================================
// animation delay (used for selected letter -for now-)
export const delay = 120;

export const GAME_SETTING = {
  defaultLifeCount: 6,
  fetchedWordsArray: [],
  hiddenLetter: "_",
  //
  oneOrTwoPlayer: 1,
  selectedWordToGuess: "",
  hiddenWord: [],
  selectedLetter: "",
  duringGameLife: 0,
};

const logInfo = () => {
  console.log("current word : ", GAME_SETTING.selectedWordToGuess);
  console.log("Letter sent : ", GAME_SETTING.selectedLetter);
  console.log("life count : ", GAME_SETTING.duringGameLife);
  console.log("-----------------------");
};

// =====================================================================================================================
// ==================================================    UTILITIES    ==================================================
// =====================================================================================================================
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
const createHiddenArray = (modelArray) => {
  for (let i = 0; i < modelArray.length; i++) {
    GAME_SETTING.hiddenWord.push(GAME_SETTING.hiddenLetter);
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
// ======================================    HTML ELEMENT CREATION / DELETION    ======================================
// =====================================================================================================================

/**
 * Generate a paragraph, append it to selected parent, and add class
 * @param letterToDisplay - the letter to display
 * @param whereToAppend - the parent element where to append the p created
 * @param classNameParam -  p class
 */
const htmlCreateElement = (letterToDisplay, whereToAppend, classNameParam) => {
  const pToCreate = document.createElement("p");
  whereToAppend.append(pToCreate);

  if (letterToDisplay !== "") {
    pToCreate.innerHTML = `${letterToDisplay}`;
  }
  // use array index to number letter class, will be used to know which letter need to be replaced
  pToCreate.className = classNameParam;
};

/**
 * Map through the GAME_SETTING.hiddenWord array. Then create a paragraph per letter
 */
const htmlCreateHiddenElements = () => {
  GAME_SETTING.hiddenWord.map((letter, index) => {
    htmlCreateElement(letter, hiddenWordDisplayContainer, `hidden-letter-${index} hiddenLetter`);
  });
};

const htmlCreateLifeCount = () => {
  for (let i = 0; i < GAME_SETTING.defaultLifeCount; i++) {
    htmlCreateElement("", lifeCountContainer, `bx bx-ghost life-${i}`);
  }
};

/**
 * Clear HTML display from the hiddenWord, Invidual p for each letter,
 */
const htmlCleanElements = (nodelist) => {
  // if the nodeList isnt empty there is something to delete
  if (nodelist.length !== 0) {
    nodelist.forEach((element) => element.remove());
  }
};

// =====================================================================================================================
// =============================================    NEW GAME CONDITIONS    =============================================
// =====================================================================================================================

// NEW GAME invoked after first fetch, and after a win or lose
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
  // reset life count
  intervalShowElements(lifeElementList);
  // reset life count value
  GAME_SETTING.duringGameLife = GAME_SETTING.defaultLifeCount;

  // reset the GAME_SETTING.hiddenWord array at each "start / restart"
  GAME_SETTING.hiddenWord = [];
  // Clean html display from preview word if needed
  htmlCleanElements(hiddenWordLetterList);

  // CHECK PLAYER COUNT
  // ______________________________________________________________
  if (GAME_SETTING.oneOrTwoPlayer == 1) {
    const arrayIndex = randomIndex(GAME_SETTING.fetchedWordsArray);
    // select a random word from the .txt turned as array
    GAME_SETTING.selectedWordToGuess = GAME_SETTING.fetchedWordsArray[arrayIndex].toUpperCase();
    // create the hidden word to be displayed in the html
    createHiddenArray(GAME_SETTING.selectedWordToGuess);
  }
  // ______________________________________________________________

  // create the html elements for the hidden display
  htmlCreateHiddenElements();
  // get the hidden world letter nodelist after html creation for further managment
  hiddenWordLetterList = document.querySelectorAll("[class^=hidden-letter-]");
  // remove hiddenletter class to show letters one by one
  intervalShowElements(hiddenWordLetterList);
};
// =====================================================================================================================
// =================================================    CHECK WORD    =================================================
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
    // check if the letter is in the wordToGuess
    if (letter === wordToGuess.charAt(letterIndex)) {
      // check if letter slot is empty ( if not the letter already was added )
      if (GAME_SETTING.hiddenWord[letterIndex] === GAME_SETTING.hiddenLetter) {
        // HTML DISPLAY
        animToChangeHiddenLetter(letter, letterIndex, hiddenWordLetterList);
        // also update the array ( use for win / lose / lose point check ) as the display is independant
        GAME_SETTING.hiddenWord[letterIndex] = letter;
      }
    }
  }
  // after the loop, if the proposed letter isnt in the hiddenWord mean its a wrong proposal, therefore lose a life
  if (hiddenWord.includes(letter) == false) {
    GAME_SETTING.duringGameLife -= 1;
    // life HTML anim
    animAddClass("hiddenLetter", lifeElementList[GAME_SETTING.duringGameLife]);
  }
  // DEBUG
  logInfo();
};
// =====================================================================================================================
// ===================================================    WINCONS    ===================================================
// =====================================================================================================================
// WIN OR LOOSE CHECK AND EFFECT : will be changed
const winConsCheck = () => {
  if (GAME_SETTING.hiddenWord.includes(GAME_SETTING.hiddenLetter) === false || GAME_SETTING.duringGameLife === 0) {
    // wait a second to start hide the word & another second to start another game
    setTimeout(() => {
      intervalHideLettersAndNewGame(hiddenWordLetterList, setupNewGame);
    }, 1000);
  }
  if (GAME_SETTING.hiddenWord.includes(GAME_SETTING.hiddenLetter) === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");
  }
  if (GAME_SETTING.duringGameLife === 0) {
    console.log("PERDU");
  }
};

// =====================================================================================================================
// =================================================    GAME LOGIC    =================================================
// =====================================================================================================================
/**
 * GameLogic invoked after each letter guess send
 * It checks if the letter is in the selected word, and then checks for the winCons / lose
 * @param letterFromInput - typed letter in the input field
 */
const gameLogic = (letterFromInput) => {
  // check if the letter is in the selected word
  checkForLetter(letterFromInput, GAME_SETTING.selectedWordToGuess, GAME_SETTING.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};

// =====================================================================================================================
// =================================================    INPUT CHECK    =================================================
// =====================================================================================================================

/**
 * input management invoked in body eventListener
 *
 * Check if its a letter, if so, send it to GameLogic. Else, request to type a letter.
 * Option to deleted typed letter, and handle animation display management
 *
 * @param e - event coming from keyup eventListener
 */
function handleKeyInput(e) {
  const regex = /[A-Za-z]/;
  // length of 1 otherwise can display "shift" / "command"... and other function keys as string
  // and with the regex only keep the first letter
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    animfadeOutFadeIn("hiddenLetter", typedLetterContainer);

    GAME_SETTING.selectedLetter = e.key.toUpperCase();
    // add timeout to add letter for fadeOut anim part to run first
    setTimeout(() => {
      sendSelectLetterToHtml(GAME_SETTING.selectedLetter);
    }, delay);
  }

  // ______________________________________________________________
  // when press enter to send the letter
  if (e.key === "Enter") {
    if (GAME_SETTING.selectedLetter === "") {
      // check if letter is empty first ( as after each "enter" the "selectedLetter" will be reset to <emptyString>)
      console.log("Type a Letter");
    }
    if (GAME_SETTING.selectedLetter !== "") {
      // send the letter to the gamelogic ( as the letter can only be [A-Z] because regex check)
      gameLogic(GAME_SETTING.selectedLetter);
      // play hide display animation
      animAddClass("hiddenLetter", typedLetterContainer);
    }
    // reset letter ( prevent enter spam and keep send the preview valid letter sent)
    GAME_SETTING.selectedLetter = "";
  }

  // ______________________________________________________________
  // DELETED LETTER
  if (e.key == "Backspace") {
    animAddClass("hiddenLetter", typedLetterContainer);
    GAME_SETTING.selectedLetter = "";
  }
}

// =====================================================================================================================
// ===============================================    INPUT LISTENER    ===============================================
// =====================================================================================================================
body.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.stopPropagation();

  handleKeyInput(e);
});

// trigger fetch at start ( this will also trigger the setupNewGame for the first game )
fetchPenduTxt();
// only need to create the life count display once as nothing is deleted but just hidden
htmlCreateLifeCount();
// get node list once created for futher usage
lifeElementList = document.querySelectorAll("[class*=bx-ghost]");

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

window.addEventListener("resize", returnedFunction);
