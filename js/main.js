import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
} from "./selectors.js";
import { checkGameStatus, getCellValueList } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

// function toggleTurn() {
//   //get current turn
//   const currentTurnElement = getCurrentTurnElement();
//   if (!currentTurnElement) return;

//   //toggle current turn and udpate DOM
//   currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

//   currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
//   currentTurnElement.classList.add(currentTurn);
// }

function handleCellClick(cell, indexCellElement) {
  //tracking cellElement is clicked
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);

  if (isClicked || isGameEnded) return;

  //apply class of cell element and update DOM
  cell.classList.add(currentTurn);

  //check status of game
  const cellValue = getCellValueList();

  cellValue[indexCellElement] =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  localStorage.setItem("cell_value", JSON.stringify(cellValue));

  const { status, winPositions } = checkGameStatus(cellValue);

  const statusElement = getGameStatusElement();
  if (statusElement) {
    switch (status) {
      case GAME_STATUS.ENDED: {
        statusElement.textContent = GAME_STATUS.ENDED;
        isGameEnded = true;
        break;
      }
      case GAME_STATUS.X_WIN: {
        statusElement.textContent = "X WIN";
        isGameEnded = true;
        handleWinGame(winPositions);
        break;
      }
      case GAME_STATUS.O_WIN: {
        statusElement.textContent = "O WIN";
        isGameEnded = true;
        handleWinGame(winPositions);
        break;
      }

      default: {
        statusElement.textContent = GAME_STATUS.PLAYING;
        break;
      }
    }
  }

  //handle show replay button
  handleShowReplayButton(status);

  //toogle current turn
  toggleTurn();
}

function toggleTurn() {
  //get current turn
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;

  //toggle current turn and udpate DOM
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}

function handleWinGame(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length === 0) {
    throw new Error("Invalid win of position!");
  }

  winPositions.forEach((position) => {
    const cellElement = getCellElementAtIdx(position);
    if (cellElement) cellElement.classList.add(CELL_VALUE.WIN);
  });
}

function handleShowReplayButton(status) {
  const replayButton = document.getElementById("replayGame");
  if (replayButton) {
    switch (status) {
      case GAME_STATUS.ENDED:
      case GAME_STATUS.X_WIN:
      case GAME_STATUS.O_WIN: {
        replayButton.style.display = "block";
        replayButton.addEventListener("click", () => {
          handleResetGame(replayButton);
        });
        break;
      }
      default:
        //playing
        replayButton.style.display = "none";
        break;
    }
  }
}

function handleResetGame(replayButton) {
  //reset localstorage
  localStorage.setItem("cell_value", JSON.stringify(new Array(9).fill("")));

  //reset global temp variables
  isGameEnded = false;

  //reset game board
  const cellElementList = getCellElementList();
  if (!cellElementList) return;
  cellElementList.forEach((liElement) => {
    liElement.removeAttribute("class");
  });

  const statusElement = getGameStatusElement();
  if (statusElement) statusElement.textContent = "LOADING";

  //reset style of replay button
  replayButton.style.display = "none";
}

function initCellElementList() {
  const cellElementList = getCellElementList();
  if (!cellElementList) return;

  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      handleCellClick(cell, index);
    });
  });
}

(function () {
  localStorage.setItem("cell_value", JSON.stringify(cellValues));

  //bind click event for all li elements
  initCellElementList();
})();
