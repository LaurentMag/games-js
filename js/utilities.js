import SETTINGS from "./gameSettings.js";
import {displaySelectedLetter} from "./htmlElements.js";

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
    SETTINGS.hiddenWord.push(SETTINGS.hideLetter);
  }
};

/**
 * display the letter from input in the innerHtml
 * @param letter - letter coming from input
 */
const sendSelectLetterToHtml = (letter) => {
  displaySelectedLetter.innerHTML = `${letter}`;
};

export {randomIndex, createHiddenArray, sendSelectLetterToHtml};
