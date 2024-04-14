import {GAME_SETTING} from "./gameSettings";
import {animAddClass, animThenChangeHTML} from "./pendu-animation.js";

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
        animThenChangeHTML(letter, letterIndex, hiddenWordLetterList);
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

// WIN OR LOOSE CHECK AND EFFECT : will be changed
const winConsCheck = () => {
  if (
    GAME_SETTING.hiddenWord.includes(GAME_SETTING.hiddenLetter) === false ||
    GAME_SETTING.duringGameLife === 0
  ) {
    // wait a second to start hide the word & another second to start another game
    setTimeout(() => {
      intervalHideLettersAndNewGame(hiddenWordLetterList, setupNewGame);
    }, 1000);
  }
  //
  if (GAME_SETTING.hiddenWord.includes(GAME_SETTING.hiddenLetter) === false) {
    // no more "-" mean word found,
    console.log(" VICTORY ");
  }
  if (GAME_SETTING.duringGameLife === 0) {
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
  checkForLetter(letterFromInput, GAME_SETTING.selectedWordToGuess, GAME_SETTING.hiddenWord);
  // at each letter input check for the winCons / lose
  winConsCheck();
};
