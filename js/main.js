import { TURN } from "./constants.js";
import {
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement,
} from "./selectors.js";

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
function toggleTurn() {
  //get current turn
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;

  //toggle current turn and udpate DOM
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}

function handleCellClick(cell, indexCellElement) {
  //tracking cellElement is clicked
  //   if (cell.hasAttribute("class")) return;

  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);

  if (isClicked) return;

  //apply class of cell element and update DOM
  cell.classList.add(currentTurn);

  toggleTurn();

  //TODO: check status of game
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
  //bind click event for all li elements
  initCellElementList();

  //bìn click event for replay button
})();
