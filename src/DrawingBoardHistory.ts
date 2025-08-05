import type DrawingBoard from "./AbstractDrawingBoard";
import type ChromeDrawingBoard from "./ChromeDrawingBoard";
import type IEDrawingBoard from "./IEDrawingBoard";

export abstract class DrawingBoardHistory {
  drawingBoard: DrawingBoard;
  protected constructor(drawingBoard: DrawingBoard) {
    this.drawingBoard = drawingBoard;
  }

  abstract initialize(): void;

  static getInstance(drawingBoard: DrawingBoard) {}
}

export class IEDrawingBoardHistory extends DrawingBoardHistory {
  static instance: IEDrawingBoardHistory;

  override initialize(): void {}

  static override getInstance(drawingBoard: IEDrawingBoard): IEDrawingBoardHistory {
    if (!this.instance) {
      this.instance = new IEDrawingBoardHistory(drawingBoard);
    }
    return this.instance;
  }
}

export class ChromeDrawingBoardHistory extends DrawingBoardHistory {
  static instance: ChromeDrawingBoardHistory;

  override initialize(): void {}

  static override getInstance(drawingBoard: ChromeDrawingBoard): ChromeDrawingBoardHistory {
    if (!this.instance) {
      this.instance = new ChromeDrawingBoardHistory(drawingBoard);
    }
    return this.instance;
  }
}
