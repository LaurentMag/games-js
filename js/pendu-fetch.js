"use strict";

import {PENDU_SETTING, setupNewGame} from "./pendu.js";

/**
 * Take the fetched .txt ( string ) and convert it to an Array of individual words
 * @param textParam - The text to be converted to an array.
 * @returns the array
 */
const toArray = (txtFetched) => {
  // set text into array
  // use regex to "split" with space (\s) coma (,) or next line (\n)
  // + mean : eventualy several
  return (PENDU_SETTING.txtToArray = txtFetched.split(/[\s,\n]+/));
};

/**
 * FetchPenduTxt() fetches the text file.
 *
 * Converts it to an array, and then setup the game ( invoke setupNewGame)
 */
export const fetchPenduTxt = () => {
  // when consoleLog(response) got a basic "object", and as its a text need to use the method .text()
  // if console response.text() directly it send a promise with <state> pending
  // it mean it need another .then to process the received promise ( correct ?)
  fetch("./pendu-mots.txt")
    .then((response) => response.text())
    // trigger the transform into array
    // use regex to "split" with space (\s) coma (,) or next line (\n) + mean : eventualy several
    .then((text) => toArray(text))
    // then trigger the setupNewGame for the first time
    // as its async function can be declared after ( as const )
    .then(() => setupNewGame());
};

//========================================================================================
//========================================================================================
// DEPRECIATED
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

// LOOP VERSION WITH SET_TIMEOUT
const HideLetterPerLetter = () => {
  // get the amount of letter
  let i = hiddenWordLetterList.length - 1;
  const letterFadeLoop = () => {
    // it will stop the "loop" once it reach the first letter
    if (i >= 0) {
      animFadeOut("hiddenLetter", hiddenWordLetterList[i]);
      i--;
      // set a timeout to add a delay to restart the "loop" once the above code is done
      setTimeout(letterFadeLoop, 100);
    }
  };
  // start the loop there.
  setTimeout(() => {
    letterFadeLoop();
  }, 1000);
};