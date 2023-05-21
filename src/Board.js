import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      initialBoard.push([]);
      for (let x = 0; x < ncols; x++) {
        initialBoard[y][x] = Math.random() < chanceLightStartsOn[y][x];
      }
    }
    return initialBoard;
  }

  function hasWon() {
    //check the board in state to determine whether the player has won.
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (board[y][x]) {
          return false;
        }
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      let boardCopy = [...oldBoard];

      //in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      // TODO: return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>"You won!"</div>;
  }

  // make table board
  const rows = board.map((r, i) => {
    return (
      <tr key={"row" + i} className="Board-row">
        {r.map((d, j) => {
          return (
            <Cell
              key={i + "-" + j}
              isLit={d}
              flipCellsAroundMe={() => flipCellsAround(`${i}-${j}`)}
            />
          );
        })}
      </tr>
    );
  });

  return (
    <section>
      <h1>Lights Out</h1>
      <table className="Board">
        <tbody className="Board-rows">{rows}</tbody>
      </table>
    </section>
  );
}

// default starting board
Board.defaultProps = {
  nrows: 4,
  ncols: 4,
  chanceLightStartsOn: [
    [".25", ".25", ".25", ".25"],
    [".25", ".25", ".25", ".25"],
    [".25", ".25", ".25", ".25"],
    [".25", ".25", ".25", ".25"],
  ],
};

export default Board;
