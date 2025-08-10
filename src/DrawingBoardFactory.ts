import { ChromeDrawingBoard, IEDrawingBoard, type DrawingBoard } from "./DrawingBoard";

import { ChromeDrawingBoardHistory, IEDrawingBoardHistory } from "./DrawingBoardHistory";
import { ChromeDrawingBoardMenu, IEDrawingBoardMenu } from "./DrawingBoardMenu";

export abstract class AbstractFactory {
  static createDrawingBoard() {
    throw new Error("Method not implemented.");
  }
  static createDrawingBoardMenu(drawingBoard: DrawingBoard, dom: HTMLElement) {
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

  static override createDrawingBoardMenu(drawingBoard: ChromeDrawingBoard, dom: HTMLElement) {
    return ChromeDrawingBoardMenu.getInstance(drawingBoard, dom);
  }

  static override createDrawingBoardHistory(drawingBoard: ChromeDrawingBoard) {
    return ChromeDrawingBoardHistory.getInstance(drawingBoard);
  }
}

export class IEDrawingBoardFactory extends AbstractFactory {
  static override createDrawingBoard() {
    return IEDrawingBoard.getInstance();
  }

  static override createDrawingBoardMenu(drawingBoard: IEDrawingBoard, dom: HTMLElement) {
    return IEDrawingBoardMenu.getInstance(drawingBoard, dom);
  }

  static override createDrawingBoardHistory(drawingBoard: IEDrawingBoard) {
    return IEDrawingBoardHistory.getInstance(drawingBoard);
  }
}
