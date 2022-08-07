"use strict";

import {delay, setupNewGame} from "./pendu.js";

export const animfadeOutFadeIn = (classToSwitch, element) => {
  if (!element.classList.contains(classToSwitch)) {
    element.classList.add(classToSwitch);
  }
  setTimeout(() => {
    element.classList.remove(classToSwitch);
  }, delay);
};

// ___________________________________________________________________
/**
 * Remove a class from an element.
 * @param classToAdd - The class that will be removed from the element.
 * @param element - The element that you want to remove the class from.
 */
const animRemoveClass = (classToAdd, element) => {
  if (element.classList.contains(classToAdd) === true) {
    element.classList.remove(classToAdd);
  }
};

// ___________________________________________________________________
/**
 * Add a class to an element.
 * @param classToAdd - The class that will be added to the element.
 * @param element - The element that you want to add the class to.
 */
export const animAddClass = (classToAdd, element) => {
  if (element.classList.contains(classToAdd) === false) {
    element.classList.add(classToAdd);
  }
};

// ___________________________________________________________________
/**
 * Invoke animfadeOutFadeIn() & change letter
 * @param letter - the letter that needs to be changed
 * @param index - the index of the hiddenWord letter nodeList where to operate the change
 * @param nodeList - select the element from nodeList via index
 */
export const animAndChangeHiddenWordLetter = (letter, index, nodelist) => {
  // get selected the letter that need to be changed via nodeList[] & index
  animfadeOutFadeIn("hiddenLetter", nodelist[index]);
  // setTimeout to add the letter once the fadeIn animation is done
  setTimeout(() => {
    nodelist[index].innerHTML = `${letter}`;
  }, delay + 100);
};

// ___________________________________________________________________

/**
 * Interval loops through the selected NodeList array.
 * Calls the animAddClass function on each letter. When it reach the lastest letter, it clears the interval and starts a
 * new game
 * @param nodelist - the list of letters to hide
 * @param nodelist2 - Not used, do not add another NodeList
 */
export const intervalHideLettersAndNewGame = (nodelist, nodelist2) => {
  let i = nodelist.length - 1;
  //   let j = nodelist2.length - 1;
  const animInterval = setInterval(() => {
    animAddClass("hiddenLetter", nodelist[i]);
    // animAddClass("hiddenLetter", nodelist2[j]);
    // check when i == 0 ( reached the first letter ) to stop the interval with clearInterval..
    if (i == 0) {
      clearInterval(animInterval);

      // set the time out to restart a new game after the clearInterval ( as it mean all animations are done)
      setTimeout(() => {
        setupNewGame();
      }, 350);
    }
    i--;
    // j--;
  }, 55);
};

// ___________________________________________________________________
/**
 * Interval loops through the hiddenWordLetterList array.
 * Allow to display letter one by one, once the hideLetterArray is created
 */
export const intervalShowLetters = (nodelist) => {
  let i = 0;
  const animInterval = setInterval(() => {
    animRemoveClass("hiddenLetter", nodelist[i]);
    // check when i == nodelist.length - 1 ( reached the lastest letter ) to stop the interval with clearInterval..
    if (i === nodelist.length - 1) {
      clearInterval(animInterval);
    }
    i++;
  }, 55);
};
