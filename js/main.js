"use strict";

import { figures } from "./figures.js";
import { renderer } from "./renderer.js";

const boardWidth = 10;
const boardHeight = 15;

let gameLoopIntervalId;

let boardRows = getNewBoardRows();
let currentFigure = getRandomFigure();

function getNewBoardRows() {
  return [...Array(boardHeight)].map(() => Array(boardWidth).fill(""));
}

function restartGame() {
  renderer.recreateBoard({ width: boardWidth, height: boardHeight });
  resetScores();
  currentFigure = getRandomFigure();
}

function resetScores() {
  // todo - update local variables
  renderer.renderScore(0);
  renderer.renderBestScore(0);
}

function getRandomFigure() {
  let figure = { ...figures[Math.floor(Math.random() * figures.length)] };

  return {
    shape: [...figure.shape],
    className: figure.className,
    y: 0,
    x: Math.floor(boardWidth / 2 - figure.shape[0].length / 2)
  };
}

function getFigureBlockPosition(figure) {
  // todo
}

function initKeyEventListener() {
  document.addEventListener("keypress", ({ key }) => {
    if (key === "ArrowLeft" || "a" || "A") {
      translateCurrentShapeIfPossible({ x: -1, y: 0 });
    } else if (key === "ArrowRight" || "d" || "D") {
      translateCurrentShapeIfPossible({ x: 1, y: 0 });
    } else if (key === "ArrowDown" || "s" || "S") {
      slamCurrentFigure();
    } else if (key === "ArrowUp" || "w" || "W") {
      rotateCurrentFigureIfPossible();
    }
  });
}

function translateCurrentShapeIfPossible(vector) {
  try {
    let newFigure = {
      ...currentFigure,
      x: currentFigure.x + vector.x,
      y: currentFigure.y + vector.y
    };

    let canTranslate = newFigure.shape
      .filter(block => block === 1)
      .every(block => true); // todo

    return true;
  } catch {
    return false;
  }
}

function rotateCurrentFigureIfPossible() {
  // todo
}

function slamCurrentFigure() {
  // todo
}

function tick() {
  if (!translateCurrentShapeIfPossible({ x: 0, y: 1 })) {
    // todo - lock figure, check for full row, check for loss, spawn new figure if not lost
  }
}

function gameLoop() {
  tick();
  renderer.render(boardRows, currentFigure);
}

export function main() {
  gameLoopIntervalId = setInterval(gameLoop, 500);
  initKeyEventListener();
  restartGame();
}
