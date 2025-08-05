import IEDrawingBoard from "./IEDrawingBoard";
import AbstractFactory from "./AbstractFactory";
import ChromeDrawingBoard from "./ChromeDrawingBoard";

class ChromeDrawingBoardFactory extends AbstractFactory {
  static override createDrawingBoard() {
    return ChromeDrawingBoard.getInstance();
  }
}

class IEDrawingBoardFactory extends AbstractFactory {
  static override createDrawingBoard() {
    return IEDrawingBoard.getInstance();
  }
}

// 팩토리 메서드 패턴 사용
function main() {
  const drawingBoard = ChromeDrawingBoardFactory.createDrawingBoard();
  drawingBoard.initialize();
  drawingBoard.initializeMenu();
}

main();
