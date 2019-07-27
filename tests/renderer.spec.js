import { renderer } from "../js/renderer";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("renderer", () => {
  test('.renderScore(123) should render score "123"', () => {
    // given
    document.body.innerHTML = '<span id="score">321</span>';

    // when
    renderer.renderScore(123);

    // then
    expect(document.getElementById("score").innerHTML).toBe("123");
  });

  test('.renderBestScore(123) should render best score "123"', () => {
    // given
    document.body.innerHTML = '<span id="best-score">321</span>';

    // when
    renderer.renderBestScore(123);

    // then
    expect(document.getElementById("best-score").innerHTML).toBe("123");
  });

  test(".recreateBoardHtmlElement should clear old board and create new one", () => {
    // given
    const newBoardDimensions = { width: 3, height: 5 };

    document.body.innerHTML = `<div id="board">
      <div class="row">
        <div class="tile figure-pyramid"></div>
      </div>
    </div>`.replace(/>\s+</g, "><");

    // when
    renderer.recreateBoardHtmlElement(newBoardDimensions);

    // then
    const expectedBoard = document.createElement("div");
    expectedBoard.id = "board";
    expectedBoard.innerHTML = `${`<div class="row">${`<div class="tile"></div>`.repeat(
      3
    )}</div>`.repeat(5)}`;

    expect(document.getElementById("board").isEqualNode(expectedBoard)).toBe(
      true
    );
  });

  test(".renderBoardAndCurrentFigure(boardRows, currentFigure) should clear board, draw current figure and blocks from boardRows", () => {
    // given
    const boardRows = [
      [null, null, null],
      ["figure-square", null, null],
      ["figure-square", "figure-pyramid", "figure-pyramid"]
    ];

    const currentFigure = {
      className: "figure-z",
      shape: [
        [1, 1, 0],
        [0, 1, 1]
      ],
      y: -1,
      x: 0
    };

    document.body.innerHTML = `<div id="board">
      <div class="row">
        <div class="tile figure-l"></div>
        <div class="tile"></div>
        <div class="tile"></div>
      </div>

      <div class="row">
        <div class="tile figure-j"></div>
        <div class="tile figure-square"></div>
        <div class="tile figure-s"></div>
      </div>

      <div class="row">
        <div class="tile figure-z"></div>
        <div class="tile figure-line"></div>
        <div class="tile figure-pyramid"></div>
      </div>
    </div>`.replace(/>\s+</g, "><");

    // when
    renderer.renderBoardAndCurrentFigure(boardRows, currentFigure);

    // then
    const expectedBoard = document.createElement("div");
    expectedBoard.id = "board";
    expectedBoard.innerHTML = `
      <div class="row">
        <div class="tile"></div>
        <div class="tile figure-z"></div>
        <div class="tile figure-z"></div>
      </div>

      <div class="row">
        <div class="tile figure-square"></div>
        <div class="tile"></div>
        <div class="tile"></div>
      </div>

      <div class="row">
        <div class="tile figure-square"></div>
        <div class="tile figure-pyramid"></div>
        <div class="tile figure-pyramid"></div>
      </div>
    `.replace(/>\s+</g, "><").trim();

    expect(document.getElementById("board").isEqualNode(expectedBoard)).toBe(true);
  });
});
