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
      .filter(block => block.y >= 0)
      .map(block => ({
        x: block.x,
        y: block.y,
      }));
  })
    .reduce((acc, nextRow) => acc.concat(nextRow), [])
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
