import { canTranslateFigureByVector, getBlockPositionsFromBoardRows, getFigureBlockPositions, getHtmlTile } from "../js/utils";

describe("utils", () => {
  describe(".getFigureBlockPositions", () => {
    test("should return block positions of provided figure", () => {
      // given
      let figure = {
        x: 2,
        y: 1,
        shape: [
          [0, 1],
          [1, 1],
          [0, 1],
        ],
      };

      // when
      let blockPositions = getFigureBlockPositions(figure);

      // then
      expect(blockPositions).toEqual(expect.arrayContaining([
        { y: 1, x: 3 },
        { y: 2, x: 2 }, { y: 2, x: 3 },
        { y: 3, x: 3 },
      ]));
    });

    test("shouldn't return block positions that are above the board", () => {
      // given
      let figure = {
        x: 0,
        y: -1,
        shape: [
          [1, 1, 0],
          [0, 1, 1]
        ]
      };

      // when
      let blockPositions = getFigureBlockPositions(figure);

      // then
      expect(blockPositions).toEqual(expect.arrayContaining([
        { y: 0, x: 1 },
        { y: 0, x: 2 },
      ]));
    });
  });

  describe(".getHtmlTile", () => {
    test("should return html tile with corresponding coordinates", () => {
      // given
      document.body.innerHTML = `
        <div id="board">
          <div class="row">
            <div class="tile"></div>
            <div class="tile"></div>
          </div>

          <div class="row">
            <div class="tile">expected</div>
            <div class="tile"></div>
          </div>
        </div>
      `

      // when
      let selectedTile = getHtmlTile({ x: 0, y: 1 });

      // then
      expect(selectedTile.innerHTML).toBe('expected');
    });
  });

  describe('.getBlockPositionsFromBoardRows', () => {
    describe('should return array of all block positions from board rows', () => {
      // given
      let boardRows = [
        ['', '', ''],
        ['', 'x', ''],
        ['x', '', 'x'],
        ['', 'x', 'x']
      ];

      // when
      let blockPositions = getBlockPositionsFromBoardRows(boardRows);

      // then
      expect(blockPositions).toEqual(expect.arrayContaining([
        { x: 1, y: 1 },
        { x: 0, y: 2 }, { x: 2, y: 2 },
        { x: 1, y: 3 }, { x: 2, y: 3 },
      ]));
    });
  });

  describe('.canTranslateFigureByVector', () => {
    // given
    let boardRows = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['x', '', '', 'x'],
      ['x', '', '', 'x'],
    ];

    let figure = {
      x: 1,
      y: 0,
      className: 'figure-pyramid',
      shape: [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
    }

    describe('should return true if figure can be translated by specified vector', () => {
      // given
      let vector = { x: 0, y: 1 };

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(true);
    });

    describe('should return false if figure cannot be translated by specified vector due to fixed blocks blocking its way', () => {
      // given
      let vector = { x: 1, y: 0 };

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(false);
    });

    describe('should return false if figure cannot be translated by specified vector due to touching board bottom', () => {
      // given
      let vector = { x: 0, y: 2 };

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(false);
    });

    describe('should return false if figure cannot be translated by specified vector due to being partially outside board\'s left border', () => {
      // given
      let boardRows = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', 'x'],
        ['x', '', '', 'x'],
      ];

      let vector = { x: -2, y: 0 }

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(false);
    });

    describe('should return false if figure cannot be translated by specified vector due to being partially outside board\'s right border', () => {
      // given
      let boardRows = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['x', '', '', ''],
        ['x', '', '', 'x'],
      ];

      let vector = { x: 2, y: 0 }

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(false);
    });
  });
});
