import type DrawingBoard from "./AbstractDrawingBoard";
import type ChromeDrawingBoard from "./ChromeDrawingBoard";
import { DrawingBoardMenuBtn, DrawingBoardMenuInput } from "./DrawingBoardMenuBtn";

import type IEDrawingBoard from "./IEDrawingBoard";

export abstract class DrawingBoardMenu {
  drawingBoard: DrawingBoard;
  dom: HTMLElement;

  protected constructor(drawingBoard: DrawingBoard, dom: HTMLElement) {
    this.drawingBoard = drawingBoard;
    this.dom = dom;
  }

  abstract initialize(types: BtnType[]): void;

  static getInstance(drawingBoard: DrawingBoard, dom: HTMLElement) {}
}

export class IEDrawingBoardMenu extends DrawingBoardMenu {
  static instance: IEDrawingBoardMenu;

  override initialize(types: BtnType[]): void {}

  static override getInstance(drawingBoard: IEDrawingBoard, dom: HTMLElement): IEDrawingBoardMenu {
    if (!this.instance) {
      this.instance = new IEDrawingBoardMenu(drawingBoard, dom);
    }
    return this.instance;
  }
}

// 커맨드 패턴, 다양한 명령을 하나의 객체로 통합
abstract class Command {
  abstract execute(): void;
}
class BackCommand extends Command {
  name = "back";

  // Receiver 역할
  override execute(): void {}
}

type BtnType = "pen" | "circle" | "rectangle" | "eraser" | "back" | "forward" | "save" | "pipette" | "color";
export class ChromeDrawingBoardMenu extends DrawingBoardMenu {
  static instance: ChromeDrawingBoardMenu;

  override initialize(types: BtnType[]): void {
    types.forEach(this.drawButtonByType.bind(this));
    document.addEventListener("keyup", this.onClickBack);
  }

  // Invoker 역할
  executeCommand(command: BackCommand) {
    command.execute();
  }

  onClickBack() {
    this.executeCommand(new BackCommand());
  }

  onClickPen() {}

  drawButtonByType(type: BtnType) {
    switch (type) {
      case "back": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Back").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }
      case "forward": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Forward").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }

      case "color": {
        const btn = new DrawingBoardMenuInput.Builder(this, "Color").setOnChange(() => {}).build();
        btn.draw();
        return btn;
      }

      case "pipette": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Pipette").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }

      case "eraser": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Eraser").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }

      case "pen": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Pen").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }

      case "circle": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Circle").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }

      case "rectangle": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Rectangle").setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }
    }
  }
  static override getInstance(drawingBoard: ChromeDrawingBoard, dom: HTMLElement): ChromeDrawingBoardMenu {
    if (!this.instance) {
      this.instance = new ChromeDrawingBoardMenu(drawingBoard, dom);
    }
    return this.instance;
  }
}
