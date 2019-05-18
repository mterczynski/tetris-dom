"use strict";

import { figures } from "./figures.js";
import { renderer } from "./renderer.js";
import { canTranslateFigureByVector } from "./utils.js";

const boardWidth = 10;
const boardHeight = 15;

let score = 0;
let bestScore = 0;
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
  score = 0;
  renderer.renderScore(0);
  renderer.renderBestScore(0);
}

function getRandomFigure() {
  let figure = { ...figures[Math.floor(Math.random() * figures.length)] };

  return {
    shape: [...figure.shape],
    className: figure.className,
    y: figure.y,
    x: Math.floor(boardWidth / 2 - figure.shape[0].length / 2)
  };
}

function moveCurrentFigureByVectorIfPossible(vector, boardRows) {
  if (canTranslateFigureByVector(currentFigure, vector, boardRows)) {
    currentFigure = {
      ...currentFigure,
      x: currentFigure.x + vector.x,
      y: currentFigure.y + vector.y,
    }
  }
  renderer.render(boardRows, currentFigure);
}

function initKeyEventListener() {
  document.addEventListener("keypress", ({ key }) => {
    // todo - test arrows
    if (["ArrowLeft", "a", "A"].includes(key)) {
      moveCurrentFigureByVectorIfPossible({ x: -1, y: 0 }, boardRows);
    } else if (["ArrowRight", "d", "D"].includes(key)) {
      moveCurrentFigureByVectorIfPossible({ x: 1, y: 0 }, boardRows);
    } else if (["ArrowDown", "s", "S"].includes(key)) {
      // todo
    } else if (["ArrowUp", "w", "W"].includes(key)) {
      // todo
    }
  });
}

function tick() {
  if (canTranslateFigureByVector(currentFigure, { x: 0, y: 1 }, boardRows)) {
    currentFigure = {
      ...currentFigure,
      y: currentFigure.y + 1,
    };
  } else {
    // todo
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
