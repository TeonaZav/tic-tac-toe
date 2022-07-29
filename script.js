"use strict";
const menu = document.querySelector(".game-menu");
const activeGame = document.querySelector(".game-board-container");
const choices = document.querySelector(".choices");
const choiceX = document.querySelector("#choice-x");
const choiceO = document.querySelector("#choice-o");
const iconBeforeX = document.querySelector(".icon-x-before");
const iconBeforeO = document.querySelector(".icon-o-before");
const iconAfterX = document.querySelector(".icon-x-after");
const iconAfterO = document.querySelector(".icon-o-after");
const btnNewGameCPU = document.querySelector("#against-cpu");
const btnNewGamePlayer = document.querySelector("#against-player");
const youSc = document.querySelector(".t-score-you");
const tiesSc = document.querySelector(".t-score-ties");
const cpuSc = document.querySelector(".t-score-cpu");
const boxYou = document.querySelector(".you");
const boxCpu = document.querySelector(".cpu");
const c1 = document.querySelector(".r1cell1");
const c2 = document.querySelector(".r1cell2");
const c3 = document.querySelector(".r1cell3");
const c4 = document.querySelector(".r2cell1");
const c5 = document.querySelector(".r2cell2");
const c6 = document.querySelector(".r2cell3");
const c7 = document.querySelector(".r3cell1");
const c8 = document.querySelector(".r3cell2");
const c9 = document.querySelector(".r3cell3");
const boxTurn = document.querySelector(".turn-display");
const next = document.querySelector(".next");
const quit = document.querySelector(".quit");
const cancel = document.querySelector(".cancel");
const cells = document.querySelectorAll(".board-cell");
let scores,
  totalScoreYou,
  totalScoreOponent,
  totalScoreTies,
  totalTies,
  playing,
  game1,
  game2,
  randomCell,
  index,
  counterPlayer,
  counterOponent,
  whoseTurn,
  winnerCounter;
let cellsValueArray;
let currentScorePlayerO;
let currentScorePlayerX;
let player;
let origBoard;
let activePlayer;
let cpuPlayer;
let player1;
let player2;
const rangeArray = [
  [c1, c2, c3],
  [c4, c5, c6],
  [c7, c8, c9],
  [c1, c4, c7],
  [c2, c5, c8],
  [c3, c6, c9],
  [c1, c5, c9],
  [c3, c5, c7],
];
let arrCpuRandom1, arrCpuRandom2;
//***************************************************************//

function init() {
  choiceX.addEventListener("click", playerX);
  choiceO.addEventListener("click", playerO);
  playing = false;
  game1 = false;
  game2 = false;
  playerX();
  youSc.textContent = "0";
  tiesSc.textContent = "0";
  cpuSc.textContent = "0";
  totalScoreYou = 0;
  totalScoreOponent = 0;
  totalScoreTies = 0;
  activePlayer = "o";
  cpuPlayer = "x";
  player1 = "x";
  player2 = "o";
  btnNewGameCPU.addEventListener("click", openNewGameCpu);
  btnNewGamePlayer.addEventListener("click", openNewGamePlayer);
}
init();
//************************************************************************//
function playerX() {
  whoseTurn = 0;
  boxYou.style.backgroundColor = "#31c3bd";
  boxCpu.style.backgroundColor = "#f2b137";
  activePlayer = "x";
  player1 = "x";
  player2 = "o";
  cpuPlayer = "o";
  if (choices.classList.contains("o")) {
    choices.classList.remove("o");
  }
  choices.classList.add("x");
  iconAfterO.style.opacity = 1;
  iconAfterO.style.transition = "opacity 0.2s ease-in-out";
  iconAfterX.style.opacity = 0;
  boxTurn.textContent = `X TURN`;
}

function playerO() {
  whoseTurn = 1;
  activePlayer = "o";
  cpuPlayer = "x";
  player1 = "o";
  player2 = "x";
  boxYou.style.backgroundColor = "#f2b137";
  boxCpu.style.backgroundColor = "#31c3bd";
  if (choices.classList.contains("x")) {
    choices.classList.remove("x");
  }
  choices.classList.add("o");
  iconAfterX.style.opacity = 1;
  iconBeforeO.style.opacity = 1;
  iconAfterO.style.opacity = 0;
  iconAfterO.style.transition = "opacity 0.2s ease-in-out";
  boxTurn.textContent = `X TURN`;
}
//************************************************************************//
//***************************************************************//

function openNewGameCpu(e) {
  e.preventDefault();
  game1 = true;
  boxTurn.textContent = `X TURN`;
  if (activePlayer === "x") {
    document.querySelector(".you-top").textContent = "X (YOU)";
    document.querySelector(".cpu-top").textContent = "O (CPU)";
  } else {
    document.querySelector(".you-top").textContent = "O (YOU)";
    document.querySelector(".cpu-top").textContent = "X (CPU)";
  }
  //* 1 */

  if (!menu.classList.contains("hidden")) {
    menu.classList.add("hidden");
  }
  if (activeGame.classList.contains("hidden")) {
    activeGame.classList.remove("hidden");
  }
  counterPlayer = 0;
  counterOponent = 0;
  winnerCounter = 0;
  removeActive();
  removeWinner();
  if (!choices.classList.contains(`${activePlayer}`)) {
    choices.classList.add(`${activePlayer}`);
  }
  closeModal();
  playing = true;
  //* 2 */
  if (playing) {
    cellsValueArray = makeArray(cells);
    arrCpuRandom1 = [1, 3, 7, 9];
    arrCpuRandom2 = [2, 4, 5, 6];

    if (whoseTurn === 1) {
      cells.forEach((cell) => {
        cell.disabled = true;
      });
      setTimeout(moveCpu, 2000);
    } else if (whoseTurn === 0) {
      cellsValueArray.forEach((el) => {
        if (!document.getElementById(`${el}`).classList.contains("active")) {
          document.getElementById(`${el}`).disabled = false;
        }
      });
      cells.forEach((cell) => {
        cell.addEventListener("mouseover", mOverCell);
        cell.addEventListener("mouseout", mOutCell);
        cell.addEventListener("click", mClickCell);
      });
    }
    console.log(cellsValueArray);
  }
}
//***************************************************************//
function openNewGamePlayer() {
  cells.forEach((cell) => {
    cell.disabled = false;
  });
  game2 = true;
  boxTurn.textContent = `X TURN`;

  if (player1 === "x") {
    document.querySelector(".you-top").textContent = "x (p1)";
    document.querySelector(".cpu-top").textContent = "o (p2)";
  } else {
    document.querySelector(".you-top").textContent = "o (p1)";
    document.querySelector(".cpu-top").textContent = "x (p2)";
  }
  //* 1 */
  player = "x";
  choices.classList.add("x");
  console.log(activePlayer, player);
  if (!menu.classList.contains("hidden")) {
    menu.classList.add("hidden");
  }
  if (activeGame.classList.contains("hidden")) {
    activeGame.classList.remove("hidden");
  }
  currentScorePlayerO = 0;
  currentScorePlayerX = 0;
  winnerCounter = 0;
  removeActive();
  removeWinner();
  if (player === "x" && choices.classList.contains("o")) {
    choices.classList.remove("o");
  }
  closeModal();
  playing = true;
  //* 2 */
  if (playing) {
    cellsValueArray = makeArray(cells);
    cellsValueArray.forEach((el) => {
      if (!document.getElementById(`${el}`).classList.contains("active")) {
        document.getElementById(`${el}`).disabled = false;
      }
    });
    cells.forEach((cell) => {
      cell.addEventListener("mouseover", mOverCell);
      cell.addEventListener("mouseout", mOutCell);
      cell.addEventListener("click", playerClicksCell);
    });
  }
}
//***************************************************************//

function mClickCell(e) {
  e.preventDefault();
  if (playing === true) {
    index = Number(e.currentTarget.id);
    cellsValueArray.forEach((el) => {
      if (!document.getElementById(`${el}`).classList.contains("active")) {
        document.getElementById(`${el}`).disabled = false;
      }
    });

    cellsValueArray.splice(cellsValueArray.indexOf(index), 1);
    document.getElementById(index).disabled = true;

    if (e.currentTarget.classList.contains("preview"));
    {
      e.currentTarget.classList.remove("preview");
    }

    e.currentTarget.classList.add("active");
    counterPlayer = counterPlayer + 1;
    choices.classList.remove(`${activePlayer}`);
    checkGameOverActive();

    cells.forEach((cell) => {
      cell.disabled = true;
    });
    if (
      (whoseTurn === 1 && counterOponent >= 2) ||
      (whoseTurn === 0 && counterOponent >= 1)
    ) {
      randomCell = Number(randomAlg());
      if (!randomAlg() || !cellsValueArray.includes(randomCell)) {
        let random;
        for (let i = 0; i < arrCpuRandom2.length; i++) {
          random = Number(
            arrCpuRandom2[Math.floor(Math.random() * arrCpuRandom2.length)]
          );
          if (cellsValueArray.includes(random)) {
            randomCell = random;
            arrCpuRandom2.splice(arrCpuRandom2.indexOf(randomCell), 1);
          } else {
            randomCell =
              cellsValueArray[
                Math.floor(Math.random() * cellsValueArray.length)
              ];
          }
        }
        if (arrCpuRandom2.length === 0) {
          randomCell =
            cellsValueArray[Math.floor(Math.random() * cellsValueArray.length)];
        }
      }
    }

    boxTurn.textContent = `${cpuPlayer} TURN`;

    if (whoseTurn === 0) {
      checkGameOverTies();
    }

    setTimeout(moveCpu, 2000);

    console.log(cellsValueArray);
  }
}
//***************************************************************//
function moveCpu() {
  if (playing === true) {
    if (whoseTurn === 1 && counterOponent < 2) {
      randomCell =
        arrCpuRandom1[Math.floor(Math.random() * arrCpuRandom1.length)];
      console.log(randomCell);
      arrCpuRandom1.splice(arrCpuRandom1.indexOf(randomCell), 1);
      if (!cellsValueArray.includes(randomCell)) {
        let random;
        for (let i = 0; i < arrCpuRandom1.length; i++) {
          random = Number(
            arrCpuRandom1[Math.floor(Math.random() * arrCpuRandom1.length)]
          );
          if (cellsValueArray.includes(random)) {
            randomCell = random;
            arrCpuRandom1.splice(arrCpuRandom1.indexOf(randomCell), 1);
          } else {
            randomCell =
              cellsValueArray[
                Math.floor(Math.random() * cellsValueArray.length)
              ];
          }
        }
      }
    }
    console.log(randomCell);
    if (whoseTurn === 0 && counterOponent < 1) {
      randomCell = 5;
      if (!cellsValueArray.includes(randomCell)) {
        randomCell =
          arrCpuRandom1[Math.floor(Math.random() * arrCpuRandom1.length)];
        console.log(randomCell);
        arrCpuRandom1.splice(arrCpuRandom1.indexOf(randomCell), 1);
      }
      if (!cellsValueArray.includes(randomCell)) {
        let random;
        for (let i = 0; i < arrCpuRandom1.length; i++) {
          random = Number(
            arrCpuRandom1[Math.floor(Math.random() * arrCpuRandom1.length)]
          );
          if (cellsValueArray.includes(random)) {
            randomCell = random;
            arrCpuRandom1.splice(arrCpuRandom1.indexOf(randomCell), 1);
          } else {
            randomCell =
              cellsValueArray[
                Math.floor(Math.random() * cellsValueArray.length)
              ];
          }
        }
      }
    }

    console.log(randomCell);
    console.log(arrCpuRandom1, arrCpuRandom2);
    index = randomCell;
    if (randomCell) {
      if (choices.classList.contains(`${activePlayer}`)) {
        choices.classList.remove(`${activePlayer}`);
      }
      choices.classList.add(`${cpuPlayer}`);
      document.getElementById(`${randomCell}`).classList.remove("empty");
      document.getElementById(`${randomCell}`).classList.add("active");
      document.getElementById(`${randomCell}`).classList.add(`${cpuPlayer}`);
      counterOponent = counterOponent + 1;

      console.log(randomCell);
      cellsValueArray.splice(cellsValueArray.indexOf(randomCell), 1);

      choices.classList.remove(`${cpuPlayer}`);
      choices.classList.add(`${activePlayer}`);

      boxTurn.textContent = `${activePlayer} TURN`;
      checkGameOverCPU();
    }
    if (whoseTurn === 1) {
      checkGameOverTies();
    }
    cellsValueArray.forEach((el) => {
      if (!document.getElementById(`${el}`).classList.contains("active")) {
        document.getElementById(`${el}`).disabled = false;
      }
    });

    cells.forEach((cell) => {
      cell.addEventListener("mouseover", mOverCell);
      cell.addEventListener("mouseout", mOutCell);
      cell.addEventListener("click", mClickCell);
    });

    console.log(cellsValueArray);
  }
}
//***************************************************************//
function mOverCell(e) {
  e.preventDefault();
  if (choices.classList.contains("x") || choices.classList.contains("o")) {
    e.currentTarget.classList.remove("empty");
    if (!e.currentTarget.classList.contains("active")) {
      e.currentTarget.classList.add("preview");
      if (choices.classList.contains("o")) {
        e.currentTarget.classList.add("o");
      } else {
        e.currentTarget.classList.add("x");
      }
    }
  }
}
//***************************************************************//

function mOutCell(e) {
  e.preventDefault();
  if (
    e.currentTarget.classList.contains("preview") &&
    !e.currentTarget.classList.contains("active")
  ) {
    e.currentTarget.classList.remove("preview");
    if (choices.classList.contains("o")) {
      e.currentTarget.classList.remove("o");
    } else {
      e.currentTarget.classList.remove("x");
    }
    e.currentTarget.classList.add("empty");
  }
}

//************************* CHECK WINNER **********************//

function checkGameOverActive() {
  if (
    (activePlayer === "o" && counterPlayer >= 3) ||
    (activePlayer === "x" && counterPlayer >= 3)
  ) {
    detectWinner(activePlayer, activePlayer, cpuPlayer);
    next.addEventListener("click", openNewGameCpu);
  }
}

function checkGameOverCPU() {
  if (
    (cpuPlayer === "x" && counterOponent >= 3) ||
    (cpuPlayer === "o" && counterOponent >= 3)
  ) {
    detectWinner(cpuPlayer, activePlayer, cpuPlayer);
    next.addEventListener("click", openNewGameCpu);
  }
}
function checkGameOverTies() {
  if (cellsValueArray.length === 0 && winnerCounter === 0) {
    totalScoreTies = totalScoreTies + 1;
    console.log("tie");
    tiesSc.textContent = `${totalScoreTies}`;
    document.querySelector(".modal-messages").textContent = "";
    document.querySelector(".modal-heading").textContent = "round tied!";
    playing = false;
    setTimeout(openModal, 2000);

    if (game1) {
      next.addEventListener("click", openNewGameCpu);
    } else if (game2) {
      next.addEventListener("click", openNewGamePlayer);
    }
  }
}
//**************************  FIND WINNER  **************************//
function detectWinner(c, you, oponent) {
  console.log(cellsValueArray.length);
  let check;
  let ar;
  if (cellsValueArray.length >= 0) {
    for (let i = 0; i < rangeArray.length; i++) {
      for (let j = 0; j < rangeArray[i].length; j++) {
        ar = [];
        check = rangeArray[i].every((each) => each.classList.contains(c));
        rangeArray[i].every((each) => ar.push(each.id));
      }
      if (check === true) {
        cells.forEach((cell) => {
          cell.disabled = true;
        });
        if (c === you) {
          playing = false;
          winnerCounter = 1;
          if (game1 === true) {
            document.querySelector(".modal-messages").textContent = "you won!";
          } else if (game2 === true) {
            document.querySelector(".modal-messages").textContent =
              "Player 1 wins";
          }

          totalScoreYou = totalScoreYou + 1;
          youSc.textContent = `${totalScoreYou}`;
        } else if (c === oponent) {
          playing = false;
          winnerCounter = 1;
          if (game1 === true) {
            document.querySelector(".modal-messages").textContent =
              "Oh no, you lost...";
          } else if (game2 === true) {
            document.querySelector(".modal-messages").textContent =
              "Player 2 wins";
          }
          totalScoreOponent = totalScoreOponent + 1;
          cpuSc.textContent = `${totalScoreOponent}`;
        }
        document.querySelector(
          ".modal-heading"
        ).textContent = `${c} takes the round`;
        document.querySelector(".modal-heading").classList.add(`wins-${c}`);
        setTimeout(openModal, 2000);

        ar.forEach((el) => {
          document.getElementById(`${el}`).classList.add("winner");
        });
      }
    }
  }
  return c;
}
function checkWinner() {
  if (
    player === player1 &&
    (currentScorePlayerO >= 3 || currentScorePlayerX >= 3)
  ) {
    detectWinner(player1, player1, player2);
    next.addEventListener("click", openNewGamePlayer);
  } else if (
    player === player2 &&
    (currentScorePlayerO >= 3 || currentScorePlayerX >= 3)
  ) {
    detectWinner(player2, player1, player2);
    next.addEventListener("click", openNewGamePlayer);
  }
}

function randomAlg() {
  console.log(cellsValueArray.length);

  let id = probableWinner();
  if (!id) {
    id = blockOponent();
  }
  console.log(probableWinner());
  console.log(blockOponent());
  return id;
}

function probableWinner() {
  let check;
  let ar2;
  let empty;
  let id;
  if (cellsValueArray.length >= 0) {
    for (let i = 0; i < rangeArray.length; i++) {
      for (let j = 0; j < rangeArray[i].length; j++) {
        check = rangeArray[i].some((el) =>
          el.classList.contains(`${cpuPlayer}`)
        );

        if (check) {
          ar2 = [];
          rangeArray[i].forEach((el) => {
            if (el.classList.contains("o")) {
              ar2.push("o");
            } else if (el.classList.contains("x")) {
              ar2.push("x");
            } else if (el.classList.contains("empty")) {
              ar2.push("empty");
            }
          });
          if (
            containsDuplicates(
              ar2.filter(function (element) {
                return element === `${cpuPlayer}`;
              })
            ) &&
            !ar2.some((el) => el === `${activePlayer}`)
          ) {
            empty = rangeArray[i].filter((el) => {
              return el.classList.contains("empty");
            });
            id = empty[0].id;
            console.log(id);
            return id;
          }
        }
      }
    }
  }
}
function blockOponent() {
  let check;
  let ar2;
  let empty;
  let id;
  if (cellsValueArray.length >= 0) {
    for (let i = 0; i < rangeArray.length; i++) {
      for (let j = 0; j < rangeArray[i].length; j++) {
        check = rangeArray[i].some((el) =>
          el.classList.contains(`${activePlayer}`)
        );
        if (check) {
          ar2 = [];
          rangeArray[i].forEach((el) => {
            if (el.classList.contains("o")) {
              ar2.push("o");
            } else if (el.classList.contains("x")) {
              ar2.push("x");
            } else if (el.classList.contains("empty")) {
              ar2.push("empty");
            }
          });
          if (
            containsDuplicates(
              ar2.filter(function (element) {
                return element === `${activePlayer}`;
              })
            ) &&
            !ar2.some((el) => el === `${cpuPlayer}`)
          ) {
            empty = rangeArray[i].filter((el) => {
              return el.classList.contains("empty");
            });
            console.log(empty[0].id);
            id = empty[0].id;
            return id;
          }
        }
      }
    }
  }
}

//************************** MODAL WINDOW **********************//
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnRestart = document.querySelector(".restart-btn");
//open modal
const openModal = function () {
  // e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
//close modal
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnCloseModal.addEventListener("click", closeModal); //close modal window
overlay.addEventListener("click", closeModal); //close modal window
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
}); //Close modal window by pressing Esc key
btnRestart.addEventListener("click", cancelContinue);
function cancelContinue() {
  playing = false;
  openModal();
  document.querySelector(".modal-messages").textContent = "";

  document.querySelector(".modal-heading").textContent = "RESTART GAME?";
  cancel.addEventListener("click", cancelChanges);
  next.textContent = "YES, RESTART";
  cancel.style.display = "inline-block";
  quit.style.display = "none";
  if (game1) {
    next.addEventListener("click", openNewGameCpu);
  } else if (game2) {
    next.addEventListener("click", openNewGamePlayer);
  }
  console.log(playing);
}
//*********************************************************************//
function cancelChanges() {
  playing = true;
  closeModal();

  cancel.style.display = "none";
  quit.style.display = "inline-block";
  next.textContent = "next round";
  moveCpu();
  console.log(playing);
}
//************************  HELPER FUNCTIONS ***************************//
function containsDuplicates(array) {
  if (array.length !== new Set(array).size) {
    return true;
  }

  return false;
}
//********************//
function makeArray(list) {
  let arr = [];
  list.forEach((el) => {
    arr.push(Number(el.getAttribute("data-value")));
  });
  return arr;
}
//********************//
//switching the player
function switchPlayer() {
  player = player === "x" ? "o" : "x";
  if (player === "x") {
    boxTurn.textContent = `X TURN`;
  } else {
    boxTurn.textContent = `O TURN`;
  }
  console.log(player);
  choices.classList.toggle(`${player}`);
  cells.forEach((cell) => {
    cell.addEventListener("mouseover", mOverCell);
    cell.addEventListener("mouseout", mOutCell);
    cell.addEventListener("click", playerClicksCell);
  });
}

//********************//
function removeWinner() {
  if (document.querySelector(".modal-heading").classList.contains("wins-x")) {
    document.querySelector(".modal-heading").classList.remove("wins-x");
  } else if (
    document.querySelector(".modal-heading").classList.contains("wins-o")
  ) {
    document.querySelector(".modal-heading").classList.remove("wins-o");
  }
  document.querySelectorAll(".winner").forEach((el) => {
    el.classList.remove("winner");
  });
}
//********************//
function removeActive() {
  cells.forEach((cell) => {
    if (cell.classList.contains("active")) {
      cell.classList.remove("active");
      cell.classList.add("empty");
    }
    if (cell.classList.contains("o")) {
      cell.classList.remove("o");
    } else if (cell.classList.contains("x")) {
      cell.classList.remove("x");
    }
  });
}
