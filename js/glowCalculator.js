import { getFigureBlockPositions, getFigureBlockPositionsInsideBoard } from "./utils.js";

/**
 * Determines which borders should glow for each block
 * @param {Array} boardRows - The game board
 * @param {Object} currentFigure - The currently falling figure
 * @param {number} boardHeight - Height of the board
 * @returns {Map} Map of position keys to glow directions
 */
export function calculateGlowPositions(boardRows, currentFigure, boardHeight) {
  const glowMap = new Map();
  const boardWidth = boardRows[0].length;

  // Get falling figure positions
  const figurePositions = new Set(
    getFigureBlockPositionsInsideBoard(
      getFigureBlockPositions(currentFigure),
      boardHeight
    ).map(pos => `${pos.x},${pos.y}`)
  );

  // Check all placed blocks
  boardRows.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile) {
        const key = `${x},${y}`;
        const glows = [];

        // Check top
        if (y === 0 || !boardRows[y - 1][x]) {
          glows.push('top');
        }

        // Check bottom
        if (y === boardHeight - 1 || !boardRows[y + 1][x]) {
          glows.push('bottom');
        }

        // Check left
        if (x === 0 || !boardRows[y][x - 1]) {
          glows.push('left');
        }

        // Check right
        if (x === boardWidth - 1 || !boardRows[y][x + 1]) {
          glows.push('right');
        }

        if (glows.length > 0) {
          glowMap.set(key, glows);
        }
      }
    });
  });

  // Check falling figure blocks
  getFigureBlockPositionsInsideBoard(
    getFigureBlockPositions(currentFigure),
    boardHeight
  ).forEach(({ x, y }) => {
    const key = `${x},${y}`;
    const glows = [];

    // Check top - empty if no figure block above and no board block above
    const topKey = `${x},${y - 1}`;
    if ((y === 0 || (!figurePositions.has(topKey) && (y - 1 < 0 || !boardRows[y - 1]?.[x])))) {
      glows.push('top');
    }

    // Check bottom
    const bottomKey = `${x},${y + 1}`;
    if (y === boardHeight - 1 || (!figurePositions.has(bottomKey) && (y + 1 >= boardHeight || !boardRows[y + 1]?.[x]))) {
      glows.push('bottom');
    }

    // Check left
    const leftKey = `${x - 1},${y}`;
    if (x === 0 || (!figurePositions.has(leftKey) && (x - 1 < 0 || !boardRows[y]?.[x - 1]))) {
      glows.push('left');
    }

    // Check right
    const rightKey = `${x + 1},${y}`;
    if (x === boardWidth - 1 || (!figurePositions.has(rightKey) && (x + 1 >= boardWidth || !boardRows[y]?.[x + 1]))) {
      glows.push('right');
    }

    if (glows.length > 0) {
      glowMap.set(key, glows);
    }
  });

  return glowMap;
}
