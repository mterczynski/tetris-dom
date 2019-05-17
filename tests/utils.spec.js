import { getFigureBlockPositions, getHtmlTile } from "../js/utils";

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
});
