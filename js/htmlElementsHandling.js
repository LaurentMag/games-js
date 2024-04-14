import {GAME_SETTING} from "./gameSetting.js";

import {lifeCountContainer, hiddenWordDisplayContainer} from "./htmlElements.js";

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
export const htmlCreateHiddenElements = () => {
  GAME_SETTING.hiddenWord.map((letter, index) => {
    htmlCreateElement(
      letter,
      hiddenWordDisplayContainer,
      `hidden-letter-${index} hiddenLetter`
    );
  });
};

export const htmlCreateLifeCount = () => {
  for (let i = 0; i < GAME_SETTING.defaultLifeCount; i++) {
    htmlCreateElement("", lifeCountContainer, `bx bx-ghost life-${i}`);
  }
};

/**
 * Clear HTML display from the hiddenWord, Invidual p for each letter,
 */
export const htmlCleanElements = (nodelist) => {
  // if the nodeList isnt empty there is something to delete
  if (nodelist.length !== 0) {
    nodelist.forEach((element) => element.remove());
  }
};
