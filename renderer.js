export function Renderer(boardRows) {
  function clearBoard() {
    [...document.querySelectorAll('.tile')].forEach(tile =>
      tile.className = tile.className
        .split(' ')
        .filter(className => !className.startsWith('figure'))
        .join(' ')
    )
  }

  function drawBlocks() {
    boardRows.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        getHtmlTile({ x: tileIndex, y: rowIndex }).classList.add(tile.className);
      });
    })
  }

  this.render = () => {
    clearBoard();
    drawBlocks();
  }
}
