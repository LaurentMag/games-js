import {gameLogic} from "./gameLogic.js";
import {typedLetterContainer} from "./htmlElements.js";
import {GAME_SETTING, delay} from "./gameSettings.js";
import {animAddClass, animfadeOutFadeIn} from "./pendu-animation.js";
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
