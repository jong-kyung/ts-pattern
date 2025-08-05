import type DrawingBoard from "./AbstractDrawingBoard";
import ChromeDrawingBoard from "./ChromeDrawingBoard";
import { ChromeDrawingBoardHistory, IEDrawingBoardHistory } from "./DrawingBoardHistory";
import { ChromeDrawingBoardMenu, IEDrawingBoardMenu } from "./DrawingBoardMenu";
import IEDrawingBoard from "./IEDrawingBoard";

export abstract class AbstractFactory {
  static createDrawingBoard() {
    throw new Error("Method not implemented.");
  }
  static createDrawingBoardMenu(drawingBoard: DrawingBoard) {
    throw new Error("Method not implemented.");
  }

  static createDrawingBoardHistory(drawingBoard: DrawingBoard) {
    throw new Error("Method not implemented.");
  }
}

export class ChromeDrawingBoardFactory extends AbstractFactory {
  static override createDrawingBoard() {
    return ChromeDrawingBoard.getInstance();
  }

  static override createDrawingBoardMenu(drawingBoard: ChromeDrawingBoard) {
    return ChromeDrawingBoardMenu.getInstance(drawingBoard);
  }

  static override createDrawingBoardHistory(drawingBoard: ChromeDrawingBoard) {
    return ChromeDrawingBoardHistory.getInstance(drawingBoard);
  }
}

export class IEDrawingBoardFactory extends AbstractFactory {
  static override createDrawingBoard() {
    return IEDrawingBoard.getInstance();
  }

  static override createDrawingBoardMenu(drawingBoard: IEDrawingBoard) {
    return IEDrawingBoardMenu.getInstance(drawingBoard);
  }

  static override createDrawingBoardHistory(drawingBoard: IEDrawingBoard) {
    return IEDrawingBoardHistory.getInstance(drawingBoard);
  }
}
