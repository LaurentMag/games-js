import {gameLogic} from "./gameLogic.js";
import {typedLetterContainer} from "./htmlElements.js";
import SETTINGS from "./gameSettings.js";
import {fadeOutFadeInAnimation} from "./pendu-animation.js";
import {sendSelectLetterToHtml} from "./utilities.js";

/**
 * input management invoked in body eventListener
 *
 * Check if its a letter, if so, send it to GameLogic. Else, request to type a letter.
 * Option to deleted typed letter, and handle animation display management
 *
 * @param e - event coming from keyup eventListener
 */
export function handleKeyInput(e) {
  const regex = /[A-Za-z]/;
  // length of 1 otherwise can display "shift" / "command"... and other function keys as string
  // and with the regex only keep the first letter
  if (e.key.length === 1 && e.key.match(regex) !== null) {
    fadeOutFadeInAnimation(typedLetterContainer);

    SETTINGS.selectedLetter = e.key.toUpperCase();
    // add timeout to add letter for fadeOut anim part to run first
    setTimeout(() => {
      sendSelectLetterToHtml(SETTINGS.selectedLetter);
    }, SETTINGS.animationDelay);
  }

  // when press enter to send the letter
  if (e.key === "Enter") {
    if (SETTINGS.selectedLetter === "") {
      // check if letter is empty first ( as after each "enter" the "selectedLetter" will be reset to <emptyString>)
      console.log("Type a Letter");
    }
    if (SETTINGS.selectedLetter !== "") {
      // send the letter to the gamelogic ( as the letter can only be [A-Z] because regex check)
      gameLogic(SETTINGS.selectedLetter);
      // play hide display animation
      typedLetterContainer.classList.add("letter-hidden");
    }
    // reset letter ( prevent enter spam and keep send the preview valid letter sent)
    SETTINGS.selectedLetter = "";
  }

  // DELETED LETTER
  if (e.key == "Backspace") {
    typedLetterContainer.classList.add("letter-hidden");
    SETTINGS.selectedLetter = "";
  }
}
