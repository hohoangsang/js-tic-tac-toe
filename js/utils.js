// Write a function to check status of tic-tac-toe game
// Ref: what is tic-tac-toe game: https://en.wikipedia.org/wiki/Tic-tac-toe
// In summary, tic-tac-toe game has 9 cells divided into 3 rows of 3 cells.
// Each cell can have 3 values: either X, O or empty.
// We say X is win if there are 3 'X' in either horizontal, vertical or diagonal row.
// The same to O.
// If 9 cells is full of values but no one win, then the game is ended.
//
// Given an array of 9 items: [a0, a1, ..., a7, a8] represent for the tic-tac-toe game cells value:
// |  a0  | a1  | a2  |
// |  a3  | a4  | a5  |
// |  a6  | a7  | a8  |
// Each item will receive either of 3 values: empty, X or O.
// Return an object includes two keys:
// - `status`: a string indicate status of the game. It can be one of the following values:
//    - 'X': if X is win
//    - `O`: if O is win
//    - 'END': if game is ended and no one win
//    - 'PLAYING': if no one is win and game is not ended yet.
//
// - `winPositions`:
//    - If X or O is win, return indexes of the 3 winning marks(X/O).
//    - Return empty array.
//
// Example:
// Input array: cellValues = ['X', 'O', 'O', '', 'X', '', '', 'O', 'X']; represent for
// |  X  | O  | O  |
// |     | X  |    |
// |     | O  | X  |
// -----
// ANSWER:
// {
//    status: 'X',
//    winPositions: [0, 4, 8],
// }
//

import { CELL_VALUE, GAME_STATUS } from "./constants.js";

// Input: an array of 9 items
// Output: an object as mentioned above

export function getCellValueList() {
  try {
    return (
      JSON.parse(localStorage.getItem("cell_value")) || [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]
    );
  } catch {
    return ["", "", "", "", "", "", "", "", ""];
  }
}

export function toggleTurn() {
  //get current turn
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;

  //toggle current turn and udpate DOM
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}

function checkGameWin(cellValues) {
  let valueWin = undefined;
  let position = [];

  const checkSetList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkSetIndex = checkSetList.findIndex((set) => {
    const first = cellValues[set[0]];
    const second = cellValues[set[1]];
    const third = cellValues[set[2]];

    return first !== "" && first === second && second === third;
  });

  if (checkSetIndex >= 0) {
    position = checkSetList[checkSetIndex];
    valueWin = cellValues[position[0]];
  }

  return {
    valueWin,
    position,
  };
}

function getLengthCellEmptyList(cellValues) {
  const emptyList = cellValues.filter((value) => value === "");
  return emptyList.length;
}

export function checkGameStatus(cellValues) {
  if (!Array.isArray(cellValues) || cellValues.length !== 9) {
    throw new Error("Invalid cell value!");
  }

  let statusGame = GAME_STATUS.PLAYING;
  let winPositions = [];
  let lengthEmptyList = getLengthCellEmptyList(cellValues);
  const { valueWin, position } = checkGameWin(cellValues);

  if (valueWin) {
    winPositions = position;
    statusGame =
      valueWin === CELL_VALUE.CROSS ? GAME_STATUS.X_WIN : GAME_STATUS.O_WIN;
    return {
      status: statusGame,
      winPositions,
    };
  }

  if (lengthEmptyList > 0) {
    statusGame = GAME_STATUS.PLAYING;
    return {
      status: statusGame,
      winPositions,
    };
  }

  if (lengthEmptyList === 0) {
    statusGame = GAME_STATUS.ENDED;
    return {
      status: statusGame,
      winPositions,
    };
  }
}
