import { canTranslateFigureByVector, getBlockPositionsFromBoardRows, getBoardAfterPoppingRows, getFigureBlockPositions, getFigureBlockPositionsInsideBoard, getFigureCenter, getFullRows, getHtmlTile, getSlammedFigure, isFigurePartiallyAboveBoard } from "../js/utils";

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

    test("should return block positions that are above the board", () => {
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
        { y: -1, x: 0 },
        { y: -1, x: 1 },
        { y: 0, x: 1 },
        { y: 0, x: 2 },
      ]));
      expect(blockPositions.length).toBe(4);
    });
  });

  describe('getFigureBlockPositionsInsideBoard', () => {
    test('should return only those block positions of provided figure that are inside the board', () => {
      // given
      let figure = {
        x: 0,
        y: -1,
        shape: [
          [0, 1],
          [1, 1],
          [0, 1],
        ]
      }
      // when
      let blockPositions = getFigureBlockPositionsInsideBoard(figure)
      // then
      expect(blockPositions).toEqual(expect.arrayContaining([
        { x: 0, y: 0 }, { x: 1, y: 0 },
        { x: 1, y: 1 },
      ]));
      expect(blockPositions.length).toEqual(3);
    })
  })

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

      describe('when figure is fully inside board', () => {
        // given
        let vector = { x: 2, y: 0 }

        // when
        let result = canTranslateFigureByVector(figure, vector, boardRows);

        // then
        expect(result).toBe(false);
      })

      describe('when figure is fully above board', () => {
        // given
        let figure = {
          x: 2,
          y: -4,
          className: 'figure-pyramid',
          shape: [
            [0, 1],
            [1, 1],
            [0, 1],
          ],
        }

        let vector = { x: 1, y: 0 }

        // when
        let result = canTranslateFigureByVector(figure, vector, boardRows);

        // then
        expect(result).toBe(false);
      })

      describe('when figure is partially above board', () => {
        let figure = {
          x: 2,
          y: -2,
          className: 'figure-pyramid',
          shape: [
            [0, 1],
            [1, 1],
            [0, 1],
          ],
        }

        let vector = { x: 1, y: 0 }

        // when
        let result = canTranslateFigureByVector(figure, vector, boardRows);

        // then
        expect(result).toBe(false);
      })
    });
  });

  describe('.getSlammedFigure', () => {
    // given
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

    describe('should return figure position after being slammed when board is empty', () => {
      // given
      let boardRows = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]

      // when
      let slammedFigure = getSlammedFigure(figure, boardRows)

      // then
      expect(slammedFigure).toEqual({
        ...figure,
        y: 3
      });
    })

    describe('should return figure position after being slammed when it lands on blocks', () => {
      // given
      let boardRows = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['x', 'x', 'x'],
      ]

      // when
      let slammedFigure = getSlammedFigure(figure, boardRows)

      // then
      expect(slammedFigure).toEqual({
        ...figure,
        y: 2
      });
    })
  })

  describe('getFullRows should return indexes of all full rows', () => {
    // given
    let boardRows = [
      ['', '', '', 'x', ''],
      ['', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', '', 'x'],
      ['x', 'x', 'x', 'x', 'x'],
    ];

    // when
    let fullRowsIndexes = getFullRows(boardRows);

    // then
    expect(fullRowsIndexes).toEqual([2, 4]);
  })

  describe('getBoardAfterPoppingRows', () => {
    // given
    let boardRows = [
      ['', '', '', 'x', ''],
      ['', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', '', 'x'],
      ['x', 'x', 'x', 'x', 'x'],
    ];

    let indexesOfRowsToPop = [2, 4];

    // when
    let boardAfterPopping = getBoardAfterPoppingRows(indexesOfRowsToPop, boardRows);

    // expect
    let expectedBoard = [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', 'x', ''],
      ['', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', '', 'x'],
    ]

    expect(boardAfterPopping).toEqual(expectedBoard);
  })

  describe('isFigurePartiallyAboveBoard', () => {
    describe('should return true if figure is partially above board', () => {
      // given
      const figure = {
        x: 0,
        y: -1,
        shape: [
          [0, 1, 0],
          [1, 1, 1]
        ]
      }

      // when
      const result = isFigurePartiallyAboveBoard(figure);

      // then
      expect(result).toBe(true);
    })

    describe('should return false if figure is not partially or fully above board', () => {
      // given
      const figure = {
        x: 0,
        y: 0,
        shape: [
          [0, 1, 0],
          [1, 1, 1]
        ]
      }

      // when
      const result = isFigurePartiallyAboveBoard(figure);

      // then
      expect(result).toBe(false);
    })
  })

  describe('getFigureCenter', () => {
    describe('should return position of figure\' center if it exists', () => {
      // given
      const figure = {
        x: 2,
        y: 1,
        shape: [
          [1, 0],
          [1, 0],
          [2, 1],
        ],
        rotable: true,
      }

      // when
      let actualCenter = getFigureCenter(figure);

      // then
      expect(actualCenter).toEqual({ x: 2, y: 3 })
    })

    describe('should return null if figure is not rotable', () => {
      // given
      const figure = {
        x: 2,
        y: 1,
        shape: [
          [0, 0],
          [0, 0]
        ],
        rotable: false,
      }

      // when
      let actualCenter = getFigureCenter(figure);

      // then
      expect(actualCenter).toBe(null)
    })
  })
});
