import type DrawingBoard from "./AbstractDrawingBoard";
import type ChromeDrawingBoard from "./ChromeDrawingBoard";
import type IEDrawingBoard from "./IEDrawingBoard";

export abstract class DrawingBoardMenu {
  drawingBoard: DrawingBoard;
  protected constructor(drawingBoard: DrawingBoard) {
    this.drawingBoard = drawingBoard;
  }

  abstract initialize(): void;

  static getInstance(drawingBoard: DrawingBoard) {}
}

export class IEDrawingBoardMenu extends DrawingBoardMenu {
  static instance: IEDrawingBoardMenu;

  override initialize(): void {}

  static override getInstance(drawingBoard: IEDrawingBoard): IEDrawingBoardMenu {
    if (!this.instance) {
      this.instance = new IEDrawingBoardMenu(drawingBoard);
    }
    return this.instance;
  }
}

export class ChromeDrawingBoardMenu extends DrawingBoardMenu {
  static instance: ChromeDrawingBoardMenu;

  override initialize(): void {}

  static override getInstance(drawingBoard: ChromeDrawingBoard): ChromeDrawingBoardMenu {
    if (!this.instance) {
      this.instance = new ChromeDrawingBoardMenu(drawingBoard);
    }
    return this.instance;
  }
}
