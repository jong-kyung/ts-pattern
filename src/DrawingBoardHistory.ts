import type DrawingBoard from "./AbstractDrawingBoard";
import type ChromeDrawingBoard from "./ChromeDrawingBoard";
import type IEDrawingBoard from "./IEDrawingBoard";

interface Cloneable {
  clone(): Cloneable;
}

class HistoryStack extends Array implements Cloneable {
  // 프로토타입의 핵심은 clone 메서드, 조건에 따라 깊은 복사 또는 얕은 복사를 구현
  clone(): Cloneable {
    return this.slice() as HistoryStack;
  }
}

export abstract class DrawingBoardHistory {
  drawingBoard: DrawingBoard;
  stack: HistoryStack;

  getStack() {
    return this.stack.clone();
  }

  protected constructor(drawingBoard: DrawingBoard) {
    this.drawingBoard = drawingBoard;
    // 프로토타입 패턴 (자바스크립트의 프로토타입과는 다름)
    this.stack = new HistoryStack();
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
