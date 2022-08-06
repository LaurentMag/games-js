"use strict";

const penduResultContainer = document.querySelector(".pendu-result-container");
const letterContainer = document.querySelector(".pendu-displayLetter-container");

// =====================================================================================================================
// UTILITIES

export const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

export const createHiddenWordArray = (wordAsArray) => {
  for (let i = 0; i < wordAsArray.length; i++) {
    PENDU_SETTING.hiddenWord.push("-");
  }
};

export const sendSelectLetterToHtml = (letter) => {
  displaySelectedLetter.innerHTML = `${letter}`;
};

// =====================================================================================================================
// ANIMATIONS

export const delay = 120;

export const animfadeOutFadeIn = () => {
  letterContainer.classList.add("hiddenLetter");
  setTimeout(() => {
    letterContainer.classList.remove("hiddenLetter");
  }, delay);
};

export const animFadeOut = () => {
  letterContainer.classList.add("hiddenLetter");
};

// =====================================================================================================================
// CREATE / MANAGE RESULT ELEMENTS

export const createLetterElem = (letterToDisplay, index) => {
  const hiddenWordLetter = document.createElement("p");
  penduResultContainer.append(hiddenWordLetter);
  hiddenWordLetter.innerHTML = `${letterToDisplay}`;
  hiddenWordLetter.className = `hidden-letter-${index}`;
};

export const createHiddenWordHTML = () => {
  PENDU_SETTING.hiddenWord.map((letter, index) => {
    createLetterElem(letter, index);
  });
};

export const cleanHiddenWordHTML = () => {
  // get nodeList with elements with class starting by...
  const previewLetters = document.querySelectorAll("[class^=hidden-letter-]");
  previewLetters.forEach((element) => element.remove());
};

export const changeHiddenWordLetter = (letterToChange, index) => {
  const whereToChange = document.querySelector(`.hidden-letter-${index}`);
  whereToChange.innerHTML = `${letterToChange}`;
};
