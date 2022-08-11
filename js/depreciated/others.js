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
