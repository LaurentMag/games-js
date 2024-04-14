import SETTINGS from "./gameSettings.js";
import {lifeCountContainer, hiddenWordDisplayContainer} from "./htmlElements.js";

/**
 * Generate a paragraph, append it to selected parent, and add class
 * @param letterToDisplay - the letter to display
 * @param whereToAppend - the parent element where to append the p created
 * @param classNameParam -  p class
 */
const createHtmlParagraphe = (letterToDisplay, whereToAppend, classNameParam) => {
  const pToCreate = document.createElement("p");
  whereToAppend.append(pToCreate);

  if (letterToDisplay !== "") {
    pToCreate.innerHTML = `${letterToDisplay}`;
  }
  // use array index to number letter class, will be used to know which letter need to be replaced
  pToCreate.className = classNameParam;
};

/**
 * Map through the SETTINGS.hiddenWord array. Then create a paragraph per letter
 */
export const createHiddenLettersElements = () => {
  SETTINGS.hiddenWord.forEach((letter, index) => {
    createHtmlParagraphe(
      letter,
      hiddenWordDisplayContainer,
      `obscured-letter-${index} hideLetter`
    );
  });
};

export const createLifeCountElements = () => {
  for (let i = 0; i < SETTINGS.lifeCount; i++) {
    createHtmlParagraphe("", lifeCountContainer, `bx bx-ghost life-${i}`);
  }
};

/**
 * Clear HTML display from the hiddenWord, Invidual p for each letter,
 */
export const clearHtmlElements = (nodelist) => {
  // if the nodeList isnt empty there is something to delete
  if (nodelist.length !== 0) {
    nodelist.forEach((element) => element.remove());
  }
};
