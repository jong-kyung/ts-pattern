import { ChromeDrawingBoardFactory } from "./DrawingBoardFactory";

// 팩토리 메서드 패턴 사용
function main() {
  const drawingBoard = ChromeDrawingBoardFactory.createDrawingBoard();
  const drawingBoardMenu = ChromeDrawingBoardFactory.createDrawingBoardMenu(
    drawingBoard,
    document.querySelector("#menu")!
  );
  const drawingBoardHistory = ChromeDrawingBoardFactory.createDrawingBoardHistory(drawingBoard);

  drawingBoard.initialize();
  drawingBoardMenu.initialize(["pen", "circle", "rectangle", "eraser", "back", "forward", "save", "pipette", "color"]);
  drawingBoardHistory.initialize();
}

main();
