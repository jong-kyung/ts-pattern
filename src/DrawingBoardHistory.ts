import type { ChromeDrawingBoard, DrawingBoard, IEDrawingBoard } from "./DrawingBoard";
import { SubscriptionManager } from "./Observer";

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

  protected constructor(drawingBoard: DrawingBoard) {
    this.drawingBoard = drawingBoard;
    // 프로토타입 패턴 (자바스크립트의 프로토타입과는 다름)
    this.stack = new HistoryStack();
    SubscriptionManager.getInstance().subscribe("saveComplete", {
      name: "history",
      publish: this.afterSaveComplete.bind(this),
    });
  }

  afterSaveComplete() {
    console.log("history: save complete");
  }

  cancelSaveCompleteAlarm() {
    SubscriptionManager.getInstance().unsubscribe("saveComplete", "history");
  }

  abstract undo(): void;
  abstract redo(): void;

  getStack() {
    return this.stack.clone();
  }

  setStack(stack: HistoryStack) {
    this.stack = stack.clone() as HistoryStack;
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
  override undo(): void {}
  override redo(): void {}
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

  override undo(): void {}
  override redo(): void {}
}
