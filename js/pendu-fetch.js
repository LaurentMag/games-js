"use strict";

import SETTINGS from "./gameSettings.js";
import {setupNewGame} from "./gameLogic.js";

/**
 * Take the fetched .txt ( string ) and convert it to an Array of individual words
 * @param textParam - The text to be converted to an array.
 * @returns the array
 */
const toArray = (txtFetched) => {
  // set text into array
  // use regex to "split" with space (\s) coma (,) or next line (\n)
  // + mean : eventualy several
  return (SETTINGS.fetchedWordsArray = txtFetched.split(/[\s,\n]+/));
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
