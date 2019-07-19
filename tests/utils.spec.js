import { canFigureBeRotatedAsNewFigure, canTranslateFigureByVector, getBlockPositionsFromBoardRows, getBoardAfterPoppingRows, getFigureAfterRotation, getFigureBlockPositions, getFigureBlockPositionsInsideBoard, getFigureCenter, getFigureFromTypedBlockPositions, getFullRows, getHtmlTile, getRotatedBlockPositions, getSlammedFigure, getTypedBlockPositions, isFigurePartiallyAboveBoard } from "../js/utils";

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
      expect(blockPositions.length).toBe(4);
    });

    test("should return only these block positions that are above the board", () => {
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
    // given
    const figureBlockPositions = [
      { x: 1, y: -1 },
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];

    test('should return only these block positions of provided figure that are inside the board', () => {
      // given
      const boardHeight = 10;

      // when
      let blockPositions = getFigureBlockPositionsInsideBoard(figureBlockPositions, boardHeight);

      // then
      expect(blockPositions).toEqual(expect.arrayContaining([
        { x: 0, y: 0 }, { x: 1, y: 0 },
        { x: 1, y: 1 },
      ]));
      expect(blockPositions.length).toEqual(3);
    })

    test('shouldn\'t return positions of block that are below the board', () => {
      // given
      const boardHeight = 1;

      // when
      let blockPositions = getFigureBlockPositionsInsideBoard(figureBlockPositions, boardHeight);

      // then
      expect(blockPositions).toEqual(expect.arrayContaining([
        { x: 0, y: 0 }, { x: 1, y: 0 },
      ]));
      expect(blockPositions.length).toEqual(2);
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
    test('should return array of all block positions from board rows', () => {
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
      expect(blockPositions.length).toBe(5)
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

    test('should return true if figure can be translated by specified vector', () => {
      // given
      let vector = { x: 0, y: 1 };

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(true);
    });

    test('should return false if figure cannot be translated by specified vector due to fixed blocks blocking its way', () => {
      // given
      let vector = { x: 1, y: 0 };

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(false);
    });

    test('should return false if figure cannot be translated by specified vector due to touching board bottom', () => {
      // given
      let vector = { x: 0, y: 2 };

      // when
      let result = canTranslateFigureByVector(figure, vector, boardRows);

      // then
      expect(result).toBe(false);
    });

    test('should return false if figure cannot be translated by specified vector due to being partially outside board\'s left border', () => {
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

      test('when figure is fully inside board', () => {
        // given
        let vector = { x: 2, y: 0 }

        // when
        let result = canTranslateFigureByVector(figure, vector, boardRows);

        // then
        expect(result).toBe(false);
      })

      test('when figure is fully above board', () => {
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

      test('when figure is partially above board', () => {
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

    test('should return figure position after being slammed when board is empty', () => {
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

    test('should return figure position after being slammed when it lands on blocks', () => {
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

  test('getFullRows should return indexes of all full rows', () => {
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

  test('getBoardAfterPoppingRows', () => {
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
    test('should return true if figure is partially above board', () => {
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

    test('should return false if figure is not partially or fully above board', () => {
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
    test('should return position of figure\' center if it exists', () => {
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
      let center = getFigureCenter(figure);

      // then
      expect(center).toEqual({ x: 2, y: 3 })
    })

    test('should return null if figure is not rotable', () => {
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
      const center = getFigureCenter(figure);

      // then
      expect(center).toBe(null)
    })
  })

  test('getRotatedBlockPositions should return block positions rotated by 90 degrees clockwise', () => {
    // given
    const centerPosition = {
      x: 2,
      y: 3
    };

    const blockPositions = [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ];

    // when
    const rotatedBlockPositions = getRotatedBlockPositions(centerPosition, blockPositions);

    // then
    expect(rotatedBlockPositions).toEqual(expect.arrayContaining([
      { x: 3, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 },
      { x: 2, y: 4 },
    ]));
    expect(rotatedBlockPositions.length).toEqual(4);
  })

  describe('canFigureBeRotatedAsNewFigure', () => {
    // given
    const boardRows = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', 'x', '', ''],
      ['x', 'x', '', ''],
    ]

    const figureBase = {
      rotable: true,
      shape: [
        [1, 0, 0],
        [2, 1, 1],
      ]
    }

    test('should return true if figure can be rotated as new figure', () => {
      // given
      const newFigure = {
        ...figureBase,
        x: 0,
        y: 0,
      }

      // when
      const canBeRotated = canFigureBeRotatedAsNewFigure(newFigure, boardRows);

      // then
      expect(canBeRotated).toBe(true);
    })

    test('should return false if figure cannot be rotated due to overlapping placed blocks', () => {
      // given
      const newFigure = {
        ...figureBase,
        x: 0,
        y: 1,
      }

      // when
      const canBeRotated = canFigureBeRotatedAsNewFigure(newFigure, boardRows);

      // then
      expect(canBeRotated).toBe(false);
    })

    test('should return false if figure cannot be rotated due to being outside board\'s left border', () => {
      // given
      const newFigure = {
        ...figureBase,
        x: -1,
        y: 0,
      }

      // when
      const canBeRotated = canFigureBeRotatedAsNewFigure(newFigure, boardRows);

      // then
      expect(canBeRotated).toBe(false);
    })

    test('should return false if figure cannot be rotated due to being outside board\'s right border', () => {
      // given
      const newFigure = {
        ...figureBase,
        x: 2,
        y: 0,
      }

      // when
      const canBeRotated = canFigureBeRotatedAsNewFigure(newFigure, boardRows);

      // then
      expect(canBeRotated).toBe(false);
    })

    test('should return false if figure cannot be rotated due to being below the board', () => {
      // given
      const boardRows = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
      ]

      const newFigure = {
        ...figureBase,
        x: 0,
        y: 3,
      }

      // when
      const canBeRotated = canFigureBeRotatedAsNewFigure(newFigure, boardRows);

      // then
      expect(canBeRotated).toBe(false);
    })
  })

  describe('getFigureAfterRotation', () => {
    test('should return figure after rotation without checking if the figure is outside allowed boundaries', () => {
      // given
      const figure = {
        x: 0,
        y: 0,
        className: 'figure-z',
        shape: [
          [1, 1, 0],
          [0, 2, 1],
        ],
        rotable: true,
      };

      // when
      const result = getFigureAfterRotation(figure);

      // then
      expect(result).toEqual({
        x: 1,
        y: 0,
        className: 'figure-z',
        shape: [
          [0, 1],
          [2, 1],
          [1, 0],
        ],
        rotable: true,
      })
    })
  })

  describe('getTypedBlockPositions', () => {
    test('should return blockPositions with extra blockType attribute(with value 1 or 2)', () => {
      // given
      const blockPositions = [
        { x: 2, y: 0 },
        { x: 1, y: 1 }, { x: 2, y: 1 },
        { x: 1, y: 2 },
      ];

      const center = { x: 1, y: 1 };

      // when
      const result = getTypedBlockPositions(blockPositions, center);

      // then
      expect(result).toEqual([
        { x: 2, y: 0, blockType: 1 },
        { x: 1, y: 1, blockType: 2 }, { x: 2, y: 1, blockType: 1 },
        { x: 1, y: 2, blockType: 1 },
      ])
    })
  })

  describe('getFigureFromTypedBlockPositions', () => {
    test('should return figure from typedBlockPositions', () => {
      // given
      const typedBlockPositions = [
        { x: 2, y: 0, blockType: 1 },
        { x: 1, y: 1, blockType: 2 }, { x: 2, y: 1, blockType: 1 },
        { x: 1, y: 2, blockType: 1 },
      ];

      // when
      const result = getFigureFromTypedBlockPositions(typedBlockPositions);

      // then
      expect(result).toEqual({
        x: 1,
        y: 0,
        shape: [
          [0, 1],
          [2, 1],
          [1, 0],
        ]
      })
    })
  })
});
