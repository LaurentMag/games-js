"use strict";

import SETTINGS from "../settings/gameParameters.js";

const hideLetterCssClass = "letter-hidden";
const intervalTime = 55;

export const fadeOutFadeInAnimation = (element) => {
  element.classList.add(hideLetterCssClass);

  setTimeout(() => {
    element.classList.remove(hideLetterCssClass);
  }, SETTINGS.animationDelay);
};

/**
 * Apply a fadeIn and fadeOut animation to the selected element,
 * then change the letter, after the fadeIn animation is done.
 * Making look like the letter is changing at the same time as the animation.
 * @param letter - letter that will be displayed
 * @param index - the index from hiddenWord array
 * @param nodeList - select which innerHtml element to change using nodelist[index]
 */
export const fadeOutFadeInThenChangeLetter = (letter, index, nodelist) => {
  // get selected the letter that need to be changed via nodeList[] & index
  fadeOutFadeInAnimation(nodelist[index]);
  // setTimeout to add the letter once the fadeIn animation is done
  setTimeout(() => {
    nodelist[index].innerHTML = `${letter}`;
  }, SETTINGS.animationDelay + 100);
};

/**
 * Intervally loops through the selected NodeList array.
 * Hide letter one by one (add hideLetterCssClass) once it reach the first letter, clears interval.
 * Then run endAnimCallBack()
 * @param nodelist - the list of letters to hide
 */
export const hideNotListElemsIntervallyAndInvokeCallback = (nodelist, endAnimCallBack) => {
  let i = nodelist.length - 1;
  //   let j = nodelist2.length - 1;
  const animInterval = setInterval(() => {
    nodelist[i].classList.add(hideLetterCssClass);

    if (i == 0) {
      // check when i == 0 ( reached the first letter ) to stop the interval with clearInterval..
      clearInterval(animInterval);
      // set the time out to restart a new game after the clearInterval ( as it mean all animations are done)
      setTimeout(() => {
        endAnimCallBack();
      }, 350);
    }
    i--;
  }, intervalTime);
};

/**
 * Interval loops through a nodeList "array".
 * Show letter one by one starting from the first one (remove hideLetterCssClass), clears interval at lastest letter.
 */
export const showNodeListElemsIntervally = (nodelist) => {
  let i = 0;
  const animInterval = setInterval(() => {
    nodelist[i].classList.remove(hideLetterCssClass);

    // check when i == nodelist.length - 1 ( reached the lastest letter ) to stop the interval with clearInterval..
    if (i === nodelist.length - 1) {
      clearInterval(animInterval);
    }
    i++;
  }, intervalTime);
};
