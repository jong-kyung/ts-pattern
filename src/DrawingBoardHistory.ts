import type { ChromeDrawingBoard, DrawingBoard, IEDrawingBoard } from "./DrawingBoard";
import { SubscriptionManager } from "./Observer";

// Iterator 패턴
class StackIterator {
  private index = 0;
  private readonly stack;
  constructor(stack: HistoryStack) {
    this.stack = stack;
  }

  next() {
    if (!this.done) {
      return this.stack[this.index++];
    }
  }

  get done() {
    return this.stack.length === this.index;
  }
}

interface Cloneable {
  clone(): Cloneable;
}

class HistoryStack extends Array implements Cloneable {
  // 프로토타입의 핵심은 clone 메서드, 조건에 따라 깊은 복사 또는 얕은 복사를 구현
  clone(): Cloneable {
    return this.slice() as HistoryStack;
  }
  override slice(start?: number, end?: number): HistoryStack {
    return super.slice(start, end) as HistoryStack;
  }
}

export abstract class DrawingBoardHistory {
  drawingBoard: DrawingBoard;
  stack: HistoryStack;
  index = -1;

  protected constructor(drawingBoard: DrawingBoard) {
    this.drawingBoard = drawingBoard;
    // 프로토타입 패턴 (자바스크립트의 프로토타입과는 다름)
    this.stack = new HistoryStack();
    SubscriptionManager.getInstance().subscribe("saveComplete", {
      name: "history",
      publish: this.afterSaveComplete.bind(this),
    });
  }

  // caretaker : 이전 스냅샷 혹은 현재 스냅샷을 저장
  saveHistory() {
    const snapshot = this.drawingBoard.makeSnapshot();
    if (this.index === this.stack.length - 1) {
      this.stack.push(snapshot);
      this.index++;
    } else {
      this.stack = this.stack.slice(0, this.index + 1);
      this.stack.push(snapshot);
      this.index++;
    }
    (document.querySelector("#back-button") as HTMLButtonElement).disabled = false;
    (document.querySelector("#forward-button") as HTMLButtonElement).disabled = true;
  }

  afterSaveComplete() {
    console.log("history: save complete");
  }

  cancelSaveCompleteAlarm() {
    SubscriptionManager.getInstance().unsubscribe("saveComplete", "history");
  }

  undoable() {
    return this.index > 0;
  }

  redoable() {
    return this.index < this.stack.length - 1;
  }

  undo(): void {
    if (this.undoable()) {
      this.index--;
      (document.querySelector("#forward-button") as HTMLButtonElement).disabled = false;
    } else {
      (document.querySelector("#back-button") as HTMLButtonElement).disabled = true;
      return;
    }
    this.drawingBoard.restore(this.stack[this.index]);
  }

  redo(): void {
    if (this.redoable()) {
      this.index++;
    } else {
      return;
    }

    if (!this.redoable()) {
      (document.querySelector("#forward-button") as HTMLButtonElement).disabled = true;
    }
    this.drawingBoard.restore(this.stack[this.index]);
  }

  getStack() {
    return this.stack.clone();
  }

  setStack(stack: HistoryStack) {
    this.stack = stack.clone() as HistoryStack;
  }

  initialize() {
    (document.querySelector("#back-button") as HTMLButtonElement).disabled = true;
    (document.querySelector("#forward-button") as HTMLButtonElement).disabled = true;
  }

  static getInstance(drawingBoard: DrawingBoard) {}
}

export class IEDrawingBoardHistory extends DrawingBoardHistory {
  static instance: IEDrawingBoardHistory;

  static override getInstance(drawingBoard: IEDrawingBoard): IEDrawingBoardHistory {
    if (!this.instance) {
      this.instance = new IEDrawingBoardHistory(drawingBoard);
    }
    return this.instance;
  }
}

export class ChromeDrawingBoardHistory extends DrawingBoardHistory {
  static instance: ChromeDrawingBoardHistory;

  static override getInstance(drawingBoard: ChromeDrawingBoard): ChromeDrawingBoardHistory {
    if (!this.instance) {
      this.instance = new ChromeDrawingBoardHistory(drawingBoard);
    }
    return this.instance;
  }
}
