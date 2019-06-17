export function getHtmlTile(position) {
  return document.querySelector(`.row:nth-child(${position.y + 1}) .tile:nth-child(${position.x + 1})`);
}

export function getFigureBlockPositions({ x, y, shape }) {
  return shape.map((row, rowIndex) => {
    return row
      .map((block, blockIndex) => ({
        x: blockIndex + x,
        y: rowIndex + y,
        exists: block,
      }))
      .filter(block => block.exists)
      .map(block => ({
        x: block.x,
        y: block.y,
      }));
  })
    .reduce((acc, nextRow) => acc.concat(nextRow), [])
}

export function getFigureBlockPositionsInsideBoard(figure) {
  return getFigureBlockPositions(figure)
    .filter(block => block.y >= 0)
}

export function getBlockPositionsFromBoardRows(boardRows) {
  return getFigureBlockPositions({
    x: 0,
    y: 0,
    shape: boardRows
  });
}

export function canTranslateFigureByVector(figure, vector, boardRows) {
  let figureBlockPosition = getFigureBlockPositions(figure);
  let translatedFigureBlockPosition = figureBlockPosition.map(block => ({
    x: block.x + vector.x,
    y: block.y + vector.y,
  }));

  let boardBlockPositions = getBlockPositionsFromBoardRows(boardRows);

  if (translatedFigureBlockPosition.some(block =>
    block.y >= boardRows.length ||
    block.x < 0 ||
    block.x >= boardRows[0].length
  )) {
    return false;
  }

  return !boardBlockPositions.some(block => translatedFigureBlockPosition.find(
    translatedBlock => translatedBlock.x === block.x &&
      translatedBlock.y === block.y
  ));
}

export function getSlammedFigure(figure, boardRows) {
  let slammedFigure = {
    ...figure,
    shape: [...figure.shape],
  }

  while (canTranslateFigureByVector(slammedFigure, { x: 0, y: 1 }, boardRows)) {
    slammedFigure.y++;
  }

  return slammedFigure
}

export function getFullRows(boardRows) {
  return boardRows
    .map(row => row.every(tile => tile))
    .map((isFullFlag, flagIndex) => isFullFlag ? flagIndex: null)
    .filter(el => el !== null)
}

export function getBoardAfterPoppingRows(indexesOfRowsToPop, boardRows) {
  // return [
  //   ...Array(indexesOfRowsToPop).fill(Array(boardRows[0].length).fill('')),
  //   ...(indexesOfRowsToPop.map(rowIndex => boardRows))
  // ]
}
