import SETTINGS from "./gameSettings.js";
import {
  fadeOutFadeInThenChangeLetter,
  showNodeListElemsIntervally,
  hideNotListElemsIntervallyAndInvokeCallback,
} from "./pendu-animation.js";
import {clearHtmlElements, createHiddenLettersElements} from "./htmlElementsHandling.js";
import {randomIndex, createHiddenArray} from "./utilities.js";

const logInfo = () => {
  console.log("current word : ", SETTINGS.wordToGuess);
  console.log("Letter sent : ", SETTINGS.selectedLetter);
  console.log("life count : ", SETTINGS.gameRemainingLife);
  console.log("-----------------------");
};

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
  showNodeListElemsIntervally(SETTINGS.lifeElementList);

  // reset life count value &&   // reset the GAME_SETTING.hiddenWord array at each "start / restart"
  SETTINGS.gameRemainingLife = SETTINGS.lifeCount;
  SETTINGS.hiddenWord = [];

  // Clean html display from preview word if needed
  clearHtmlElements(SETTINGS.hiddenWordLetterList);

  const arrayIndex = randomIndex(SETTINGS.fetchedStringAsArray);
  // select a random word from the .txt turned as array
  SETTINGS.wordToGuess = SETTINGS.fetchedStringAsArray[arrayIndex].toUpperCase();
  // create the hidden word to be displayed in the html
  createHiddenArray(SETTINGS.wordToGuess);

  // create the html elements for the hidden display
  createHiddenLettersElements();
  // get the hidden world letter nodelist after html creation for further managment
  SETTINGS.hiddenWordLetterList = document.querySelectorAll("[class^=obscured-letter-]");
  // remove hideLetter class to show letters one by one
  showNodeListElemsIntervally(SETTINGS.hiddenWordLetterList);
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
    // check if the letter is in the wordToGuess
    if (letter === wordToGuess.charAt(letterIndex)) {
      // check if letter slot is empty ( if not the letter already was added )
      if (SETTINGS.hiddenWord[letterIndex] === SETTINGS.hideLetter) {
        // HTML DISPLAY
        fadeOutFadeInThenChangeLetter(letter, letterIndex, SETTINGS.hiddenWordLetterList);
        // also update the array ( use for win / lose / lose point check ) as the display is independant
        SETTINGS.hiddenWord[letterIndex] = letter;
      }
    }
  }
  // after the loop, if the proposed letter isnt in the hiddenWord mean its a wrong proposal, therefore lose a life
  if (!hiddenWord.includes(letter)) {
    SETTINGS.gameRemainingLife -= 1;
    // life HTML anim
    const element = SETTINGS.lifeElementList[SETTINGS.gameRemainingLife];
    element.classList.add("letter-hidden");
  }
  // DEBUG
  logInfo();
};

// WIN OR LOOSE CHECK AND EFFECT : will be changed
const winConsCheck = () => {
  if (
    SETTINGS.hiddenWord.includes(SETTINGS.hideLetter) === false ||
    SETTINGS.gameRemainingLife === 0
  ) {
    // wait a second to start hide the word & another second to start another game
    setTimeout(() => {
      hideNotListElemsIntervallyAndInvokeCallback(SETTINGS.hiddenWordLetterList, setupNewGame);
    }, 1000);
  }
  //
  if (SETTINGS.hiddenWord.includes(SETTINGS.hideLetter) === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");
  }
  if (SETTINGS.gameRemainingLife === 0) {
    console.log("PERDU");
  }
};

/**
 * GameLogic invoked after each letter guess send
 * It checks if the letter is in the selected word, and then checks for the winCons / lose
 * @param letterFromInput - typed letter in the input field
 */
export const gameLogic = (letterFromInput) => {
  // check if the letter is in the selected word
  checkForLetter(letterFromInput, SETTINGS.wordToGuess, SETTINGS.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};
