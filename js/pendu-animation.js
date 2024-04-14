"use strict";

import {setupNewGame} from "./pendu.js";
import {delay} from "./gameSettings.js";

export const animfadeOutFadeIn = (classToSwitch, element) => {
  if (!element.classList.contains(classToSwitch)) {
    element.classList.add(classToSwitch);
  }
  setTimeout(() => {
    element.classList.remove(classToSwitch);
  }, delay);
};

// __________________________________ __________________________________ __________________________________
// __________________________________ __________________________________ __________________________________
/**
 * Remove a class from an element.
 * @param cssClass - The class that will be removed from the element.
 * @param element - The html element that you want to remove the class from.
 */
const animRemoveClass = (cssClass, element) => {
  if (element.classList.contains(cssClass) === true) {
    element.classList.remove(cssClass);
  }
};

// __________________________________ __________________________________ __________________________________
// __________________________________ __________________________________ __________________________________
/**
 * Add a class to an element.
 * @param cssClass - The class that will be added to the element.
 * @param element - The html element that you want to add the class to.
 */
export const animAddClass = (cssClass, element) => {
  if (element.classList.contains(cssClass) === false) {
    element.classList.add(cssClass);
  }
};

// __________________________________ __________________________________ __________________________________
// __________________________________ __________________________________ __________________________________
/**
 * Invoke animfadeOutFadeIn() & change the HTML element innerHTML to display the letter
 * @param letter - letter that will be displayed
 * @param index - the index from hiddenWord array
 * @param nodeList - select which innerHtml element to change using nodelist[index]
 */
export const animThenChangeHTML = (letter, index, nodelist) => {
  // get selected the letter that need to be changed via nodeList[] & index
  animfadeOutFadeIn("hiddenLetter", nodelist[index]);
  // setTimeout to add the letter once the fadeIn animation is done
  setTimeout(() => {
    nodelist[index].innerHTML = `${letter}`;
  }, delay + 100);
};

// __________________________________ __________________________________ __________________________________
// __________________________________ __________________________________ __________________________________

/**
 * Interval loops through the selected NodeList array.
 * Calls the animAddClass function on each letter to hide, once it reach the first letter, clears interval.
 * Then run functionAtAnimEnd()
 * @param nodelist - the list of letters to hide
 */
export const intervalHideLettersAndNewGame = (nodelist, functionAtAnimEnd) => {
  let i = nodelist.length - 1;
  //   let j = nodelist2.length - 1;
  const animInterval = setInterval(() => {
    animAddClass("hiddenLetter", nodelist[i]);
    // check when i == 0 ( reached the first letter ) to stop the interval with clearInterval..
    if (i == 0) {
      clearInterval(animInterval);
      // set the time out to restart a new game after the clearInterval ( as it mean all animations are done)
      setTimeout(() => {
        functionAtAnimEnd();
      }, 350);
    }
    i--;
  }, 55);
};

// __________________________________ __________________________________ __________________________________
// __________________________________ __________________________________ __________________________________
/**
 * Interval loops through a nodeList "array".
 * Show letter one by one starting from the first one
 */
export const intervalShowElements = (nodelist) => {
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
