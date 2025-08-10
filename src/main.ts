import { ChromeDrawingBoardFactory } from "./DrawingBoardFactory";

// 팩토리 메서드 패턴 사용
function main() {
  const factory = ChromeDrawingBoardFactory;
  const drawingBoard = factory.createDrawingBoard();

  drawingBoard.initialize({
    menu: ["pen", "circle", "rectangle", "eraser", "back", "forward", "save", "pipette", "color"],
  });
}

main();
