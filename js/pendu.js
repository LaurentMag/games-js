"use strict";

import {fetchPenduTxt} from "./pendu-fetch.js";

import {body} from "./htmlElements.js";

import {GAME_SETTING} from "./gameSettings.js";

import {handleKeyInput} from "./inputHandling.js";

import {
  htmlCreateHiddenElements,
  htmlCreateLifeCount,
  htmlCleanElements,
} from "./htmlElementsHandling.js";

import {randomIndex, createHiddenArray} from "./utilities.js";

import {intervalHideLettersAndNewGame, intervalShowElements} from "./pendu-animation.js";

let hiddenWordLetterList = [];
let lifeElementList = [];

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
  if (GAME_SETTING.oneOrTwoPlayer === 1) {
    const arrayIndex = randomIndex(GAME_SETTING.fetchedWordsArray);
    // select a random word from the .txt turned as array
    GAME_SETTING.selectedWordToGuess =
      GAME_SETTING.fetchedWordsArray[arrayIndex].toUpperCase();
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
