"use strict";

const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

//select elements
const elements = {
  menu: select(".game-menu"),
  activeGame: select(".game-board-container"),
  boardOveraly: select(".board-overlay"),
  choices: select(".choices"),
  scoreYou: select(".t-score-you"),
  scoreTies: select(".t-score-ties"),
  scoreCpu: select(".t-score-cpu"),
  boxYou: select(".you"),
  boxCpu: select(".cpu"),
  boxCpuTop: select(".cpu > .cpu-top"),
  boxTurn: select(".turn-display"),
  cells: selectAll(".board-cell"),
  modal: select(".modal"),
  modalHeading: select(".modal-heading"),
  modalMessage: select(".modal-messages"),
  overlay: select(".overlay"),
  quit: select(".quit"),
  next: select(".next"),
  cancel: select(".cancel"),
  delete: select(".delete"),
  save: select(".save"),
  restart: select(".restart"),
  wins: select("#wins > span"),
  losses: select("#losses > span"),
  tie: select("#tie > span"),
};

//board cell combinations
const rangeArray = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//modal state
let modalState = {
  message: "",
  heading: "",
};

//progress state
let progressState = {
  wins: 0,
  losses: 0,
  ties: 0,
};

//localstorage data
const savedScores = getSavedScores() || { wins: 0, losses: 0, ties: 0 };

if (savedScores) {
  progressState.wins = savedScores.wins;
  progressState.losses = savedScores.losses;
  progressState.ties = savedScores.ties;
} else {
  localStorage.setItem("scores", JSON.stringify(progressState));
}

// Game state
let gameState = {
  totalScore: { you: 0, oponent: 0, ties: 0 },
  you: "x",
  oponent: "o",
  currentPlayer: "x",
  gameMode: null, // "CPU" or "PLAYER"
  remainingCells: [...elements.cells],
  ramainingRange: [...rangeArray],
  winner: null,
  tied: false,
  playing: false,
};

// event mapping
const eventMappings = [
  { selector: "#choice-x", action: () => onPlayerChoice("x") },
  { selector: "#choice-o", action: () => onPlayerChoice("o") },
  { selector: ".next", action: nextRound },
  { selector: ".quit", action: onQuit },
  { selector: ".delete", action: onDelete },
  { selector: ".save", action: onSaveProgress },
  { selector: ".restart-btn", action: onStop },
  { selector: ".restart", action: onRestart },
  { selector: ".cancel", action: onCancel },
  { selector: ".btn--close-modal", action: closeModal },
  { selector: "#against-cpu", action: () => openNewGame("CPU") },
  { selector: "#against-player", action: () => openNewGame("PLAYER") },
];

eventMappings.forEach(({ selector, action }) => {
  const element = select(selector);
  if (element) {
    element.addEventListener("click", action);
  }
});

//events on cell
gameState.remainingCells.forEach((cell) => {
  cell.addEventListener("mouseenter", onPreviewEnter);
  cell.addEventListener("mouseout", onPreviewOut);
  cell.addEventListener("click", (e) => onCellClick(e));
});

//init
function initializeGame() {
  elements.modalHeading.classList.remove(`wins-${gameState.winner}`);

  elements.cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "active", "winner");
    cell.classList.add("empty");
  });
  select("#turn").style.visibility = "hidden";
  updateUI();
}

//open new game
function openNewGame(mode) {
  gameState.gameMode = mode;
  if (mode === "CPU") {
    elements.boxCpuTop.textContent = "CPU";
  } else {
    elements.boxCpuTop.textContent = "PLAYER 2";
  }

  gameState.playing = true;
  initializeGame();
  closeMenu();
  anableCells();
  if (gameState.gameMode === "CPU") {
    cpuShouldMove();
  }
  console.log(gameState);
}

//next round
function nextRound() {
  gameState = {
    ...gameState,
    currentPlayer: "x",
    remainingCells: [...elements.cells],
    ramainingRange: [...rangeArray],
    winner: null,
    tied: false,
    playing: false,
  };
  closeModal();
  openNewGame(gameState.gameMode);
}

//game over
function gameOver(result, index) {
  disableCells();

  elements.cells.forEach((cell) => {
    if (result === "winner" && rangeArray[index].includes(+cell.id)) {
      cell.classList.add("winner");
    }
  });
  setTimeout(openModal, 1000);
  console.log("Game over...");
}

// Switch player x/o
function togglePlayer() {
  gameState.currentPlayer = gameState.currentPlayer === "x" ? "o" : "x";
  updateUI();
  if (gameState.gameMode === "CPU") {
    cpuShouldMove();
  }
}

//check if game has winner / or is tied
function checkGameState() {
  checkForWin();
  checkForTie();
  updateUI();
}

function checkForWin() {
  let wins = gameState.ramainingRange.find(
    (el) => [...new Set(el)].length === 1
  );
  if (!wins) return;

  gameState.winner = wins[0];

  if (wins[0] === gameState.you) {
    gameState.totalScore.you++;
  } else {
    gameState.totalScore.oponent++;
  }
  const winningCombination = gameState.ramainingRange.indexOf(wins);

  gameOver("winner", winningCombination);
  gameState.playing = false;
}

function checkForTie() {
  if (!(gameState.remainingCells.length === 0 && !gameState.winner)) return;

  gameState.totalScore.ties++;
  gameState.tied = true;
  gameOver("tied");
  gameState.playing = false;
}

//reset game
function resetGame(btnName = "") {
  closeModal();
  initializeGame();
  gameState = {
    totalScore: { you: 0, oponent: 0, ties: 0 },
    you: "x",
    oponent: "o",
    currentPlayer: "x",
    gameMode: null,
    remainingCells: [...elements.cells],
    ramainingRange: [...rangeArray],
    winner: null,
    tied: false,
    playing: false,
  };
}

//================================/
//EVENT HANDLERS//
//===============================/
function onPlayerChoice(choice) {
  gameState.you = choice;
  gameState.oponent = choice === "x" ? "o" : "x";
  updateChoiceUI(gameState.you, gameState.oponent);
}

function onCellClick(e) {
  console.log("player makes move...");

  if (!e.target.matches(".board-cell") || e.target.textContent !== "") return;
  e.target.textContent = gameState.currentPlayer;
  removeUsedCell(e.currentTarget);

  checkGameState();
  if (gameState.playing) togglePlayer();
}

function onPreviewEnter(e) {
  if (!e.target.matches(".board-cell") || e.target.textContent !== "") return;
  const currentPlayerClass = gameState.currentPlayer;
  if (e.currentTarget.classList.contains("active")) return;

  e.currentTarget.classList.remove("empty");
  e.currentTarget.classList.add("preview", `${currentPlayerClass}`);
}

function onPreviewOut(e) {
  const currentPlayerClass = gameState.currentPlayer;
  if (e.currentTarget.classList.contains("active")) return;

  e.currentTarget.classList.add("empty");
  e.currentTarget.classList.remove("preview", `${currentPlayerClass}`);
}

function onQuit() {
  getModalContent(gameState.winner, gameState.tied, "quit");
  updateUI();
}

function onDelete() {
  resetGame();
  openMenu();
  updateUI();
  updateChoiceUI("x", "o");
}

function onSaveProgress() {
  const savedScores = getSavedScores();
  console.log(savedScores);

  if (savedScores) {
    progressState.wins += gameState.totalScore.you;
    progressState.losses += gameState.totalScore.oponent;
    progressState.ties += gameState.totalScore.ties;
    localStorage.setItem("scores", JSON.stringify(progressState));
  }
  resetGame();
  openMenu();
  updateUI();
  updateChoiceUI("x", "o");
}

function onStop() {
  getModalContent(gameState.winner, gameState.tied, "restart");
  gameState.playing = false;
  openModal();
}

function onRestart() {
  gameState = {
    ...gameState,
    currentPlayer: "x",
    remainingCells: [...elements.cells],
    ramainingRange: [...rangeArray],
    winner: null,
    tied: false,
    playing: false,
  };

  closeModal();
  openNewGame(gameState.gameMode);
}

function onCancel() {
  closeModal();
  gameState.playing = true;
  
  if (gameState.gameMode === "CPU" && gameState.playing) {
    cpuShouldMove();
  }
}

//================================/
//CPU ACTIONS/
//===============================/

function cpuMoves() {
  if (gameState.winner || gameState.tied) {
    console.log("Game already ended. CPU move canceled.");
    return;
  }
  if (!gameState.playing) return;

  console.log("Cpu is making a move...");
  let movePosition = cpuChosesIndex();
  let elToRemove = gameState.remainingCells.find(
    (cell) => +cell.id === movePosition
  );

  if (elToRemove) {
    elToRemove.classList.remove("empty");
    elToRemove.classList.add(gameState.oponent);
    removeUsedCell(elToRemove);
    checkGameState();
  }
  console.log("Here i am");

  if (gameState.playing) togglePlayer();
  console.log("toggled", gameState.currentPlayer);
}

function cpuChosesIndex() {
  if (gameState.remainingCells.length === 1) {
    console.log(+gameState.remainingCells[0].id);
    return +gameState.remainingCells[0].id;
  }
  //if cpu's move is first in game

  if (gameState.you === "o" && gameState.remainingCells.length === 9) {
    return 4;
  }

  //check if cpu can win in one move
  let mostRelevantArr = gameState.ramainingRange.filter(
    (el) => el.includes(gameState.oponent) && !el.includes(gameState.you)
  );
  let winningIndex = getIndexFromNestedArr(mostRelevantArr, "oponent");
  if (winningIndex || winningIndex === 0) return winningIndex;

  let possibleArrs = gameState.ramainingRange.filter(
    (el) => el.includes(gameState.you) && !el.includes(gameState.oponent)
  );

  //Check if the CPU can block the opponent's possible win
  let bloackingIndex = getIndexFromNestedArr(possibleArrs, "you");
  if (bloackingIndex || bloackingIndex === 0) return bloackingIndex;

  // try another optimal move
  const possibleOptimalMove = [...new Set(possibleArrs.flat())].filter(
    (value) => typeof value === "number"
  );

  if (possibleOptimalMove.length > 0) {
    let randomIndex1 = Math.floor(Math.random() * possibleOptimalMove.length);
    if (randomIndex1 || randomIndex1 === 0)
      return possibleOptimalMove[randomIndex1];
  }

  // last option
  if (possibleArrs.length === 0) {
    let arr = [...new Set(gameState.ramainingRange.flat())];
    let randomIndex2 = Math.floor(Math.random() * arr.length);
    if (randomIndex2 || randomIndex2 === 0) return arr[randomIndex2];
  }
}

function cpuShouldMove() {
  const timeToMove =
    gameState.currentPlayer === gameState.oponent && !gameState.winner;
  if (timeToMove) {
    select("#turn").style.visibility = "visible";
    disableCells();
    setTimeout(cpuMoves, 3000);
  } else {
    select("#turn").style.visibility = "hidden";
    anableCells();
  }
  return timeToMove;
}

//================================/
//MODAL AND MENU
//===============================/
function openModal() {
  if (gameState.winner || gameState.tied) {
    getModalContent(gameState.winner, gameState.tied);
  }

  elements.modal.classList.remove("hidden");
  elements.overlay.classList.remove("hidden");
}

function closeModal() {
  elements.modal.classList.add("hidden");
  elements.overlay.classList.add("hidden");
}

function openMenu() {
  elements.menu.classList.remove("hidden");
  elements.activeGame.classList.add("hidden");
  console.log(gameState.gameMode);
}

function closeMenu() {
  elements.menu.classList.add("hidden");
  elements.activeGame.classList.remove("hidden");
}

function getModalContent(winner, tied, btn = "") {
  if (btn === "restart") {
    adjustDisplaySettings(
      ["quit", "next", "delete", "save"],
      ["cancel", "restart"]
    );
    modalState.message = "";
    modalState.heading = "RESTART GAME?";
  }

  if ((winner || tied) && btn !== "quit") {
    adjustDisplaySettings(
      ["restart", "cancel", "delete", "save"],
      ["quit", "next"]
    );
  }

  if (winner) {
    modalState.message =
      winner === gameState.you ? "You won!" : "Oh no, you lost...";
    modalState.heading = `${winner} takes the round`;
    elements.modalHeading.classList.add(`wins-${gameState.winner}`);
  }

  if (tied) {
    modalState.message = "";
    modalState.heading = "ROUND TIED";
  }

  if (btn === "quit") {
    adjustDisplaySettings(
      ["quit", "next", "cancel", "restart"],
      ["delete", "save"]
    );
    modalState.message = "";
    modalState.heading = "Save Progress?";
  }

  updateUI();
}

//================================/
//UI UPDATE/
//===============================/

function updateUI() {
  elements.scoreYou.textContent = gameState.totalScore.you;
  elements.scoreTies.textContent = gameState.totalScore.ties;
  elements.scoreCpu.textContent = gameState.totalScore.oponent;
  elements.boxTurn.textContent = `${gameState.currentPlayer}'s Turn`;
  elements.wins.textContent = progressState.wins;
  elements.losses.textContent = progressState.losses;
  elements.tie.textContent = progressState.ties;
  elements.modalHeading.textContent = modalState.heading;
  elements.modalMessage.textContent = modalState.message;
}

function updateChoiceUI(choice, oponent) {
  elements.choices.classList.add(choice);
  elements.choices.classList.remove(oponent);
  select(`.icon-${choice}-after`).style.opacity = 0;
  select(`.icon-${choice}-before`).style.opacity = 1;
  select(`.icon-${oponent}-before`).style.opacity = 1;
  select(`.icon-${oponent}-after`).style.opacity = 1;
  elements.boxYou.classList.remove(oponent);
  if (!elements.boxYou.classList.contains(choice)) {
    elements.boxYou.classList.add(choice);
  }

  elements.boxCpu.classList.remove(choice);
  if (!elements.boxCpu.classList.contains(oponent)) {
    elements.boxCpu.classList.add(oponent);
  }
}

//================================/

//utility funtions
function removeUsedCell(boardCell) {
  boardCell.textContent = gameState.currentPlayer;
  boardCell.classList.remove("preview");
  boardCell.classList.add("active");
  boardCell.disabled = true;

  gameState.remainingCells = gameState.remainingCells.filter((cell) => {
    return cell.id !== boardCell.id;
  });

  gameState.ramainingRange = gameState.ramainingRange.map((innerArray) => {
    const arr = innerArray.map((el) =>
      el === +boardCell.id ? (el = gameState.currentPlayer) : el
    );

    return arr;
  });
}

function getIndexFromNestedArr(arr, val) {
  return arr
    .filter((el) => [...new Set(el)].length === 2)
    .flat()
    .find((value) => value !== gameState[val]);
}

function getSavedScores() {
  const scores = JSON.parse(localStorage.getItem("scores"));
  return scores;
}

//anable or disable cells

function disableCells() {
  elements.boardOveraly.style.display = "block";
}

function anableCells() {
  elements.boardOveraly.style.display = "none";
  elements.cells.forEach((cell) => {
    cell.disabled = false;
  });
}

//helper functions

function adjustDisplaySettings(elementsToHide, elementsToShow) {
  elementsToHide.forEach((element) => {
    if (elements[element]) elements[element].style.display = "none";
  });

  elementsToShow.forEach((element) => {
    if (elements[element]) elements[element].style.display = "inline-block";
  });
}
