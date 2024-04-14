// animation delay (used for selected letter -for now-)
const delay = 120;

const GAME_SETTING = {
  defaultLifeCount: 6,
  fetchedWordsArray: [],
  hiddenLetter: "_",
  //
  oneOrTwoPlayer: 1,
  selectedWordToGuess: "",
  hiddenWord: [],
  selectedLetter: "",
  duringGameLife: 0,
};

const logInfo = () => {
  console.log("current word : ", GAME_SETTING.selectedWordToGuess);
  console.log("Letter sent : ", GAME_SETTING.selectedLetter);
  console.log("life count : ", GAME_SETTING.duringGameLife);
  console.log("-----------------------");
};

export {logInfo, GAME_SETTING, delay};
