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

type BtnType = "pen" | "circle" | "rectangle" | "eraser" | "back" | "forward" | "save" | "pipette" | "color";
export class ChromeDrawingBoardMenu extends DrawingBoardMenu {
  static instance: ChromeDrawingBoardMenu;

  override initialize(types: BtnType[]): void {
    types.forEach(this.drawButtonByType.bind(this));
  }

  drawButtonByType(type: BtnType) {
    switch (type) {
      case "back": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Back").build();
        btn.draw();
        return btn;
      }
      case "forward": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Forward").build();
        btn.draw();
        return btn;
      }

      case "color": {
        const btn = new DrawingBoardMenuInput.Builder(this, "Color").build();
        btn.draw();
        return btn;
      }

      case "pipette": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Pipette").build();
        btn.draw();
        return btn;
      }

      case "eraser": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Eraser").build();
        btn.draw();
        return btn;
      }

      case "pen": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Pen").build();
        btn.draw();
        return btn;
      }

      case "circle": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Circle").build();
        btn.draw();
        return btn;
      }

      case "rectangle": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Rectangle").build();
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
