import type { ChromeDrawingBoard, DrawingBoardMode, IEDrawingBoard } from "./DrawingBoard";
import type { DrawingBoard } from "./DrawingBoard";

import {
  BackCommand,
  CircleSelectCommand,
  EraserSelectCommand,
  PenSelectCommand,
  PipetteSelectCommand,
  RectangleSelectCommand,
  SaveCommand,
  type Command,
} from "./commands";

import { DrawingBoardMenuBtn, DrawingBoardMenuInput, DrawingBoardMenuSaveBtn } from "./DrawingBoardMenuBtn";
import { SubscriptionManager } from "./Observer";

export abstract class DrawingBoardMenu {
  drawingBoard: DrawingBoard;
  dom: HTMLElement;
  colorBtn!: HTMLInputElement;

  protected constructor(drawingBoard: DrawingBoard, dom: HTMLElement) {
    this.drawingBoard = drawingBoard;
    this.dom = dom;
    SubscriptionManager.getInstance().subscribe("saveComplete", {
      name: "menu",
      publish: this.afterSaveComplete.bind(this),
    });
  }

  afterSaveComplete() {
    console.log("menu: save complete");
  }

  cancelSaveCompleteAlarm() {
    SubscriptionManager.getInstance().unsubscribe("saveComplete", "menu");
  }

  setActiveButton(type: DrawingBoardMode): void {
    document.querySelector(".active")?.classList.remove("active");
    document.querySelector(`#${type}-btn`)?.classList.add("active");
  }

  // Invoker 역할
  executeCommand(command: Command) {
    // Invoker 명령을 실행
    command.execute();
  }

  abstract initialize(types: BtnType[]): void;

  static getInstance(drawingBoard: DrawingBoard, dom: HTMLElement) {}
}

export class IEDrawingBoardMenu extends DrawingBoardMenu {
  static instance: IEDrawingBoardMenu;

  override initialize(types: BtnType[]): void {}

  override setActiveButton(type: DrawingBoardMode): void {}

  static override getInstance(drawingBoard: IEDrawingBoard, dom: HTMLElement): IEDrawingBoardMenu {
    if (!this.instance) {
      this.instance = new IEDrawingBoardMenu(drawingBoard, dom);
    }
    return this.instance;
  }
}

export type BtnType = "pen" | "circle" | "rectangle" | "eraser" | "back" | "forward" | "save" | "pipette" | "color";

export class ChromeDrawingBoardMenu extends DrawingBoardMenu {
  static instance: ChromeDrawingBoardMenu;

  override initialize(types: BtnType[]): void {
    types.forEach(this.drawButtonByType.bind(this));
    this.drawingBoard.setMode("pen");
  }

  onClickBack() {
    this.executeCommand(new BackCommand(this.drawingBoard.history));
  }

  onClickPen() {
    this.drawingBoard.setMode("pen");
  }

  onClickEraser() {
    this.drawingBoard.setMode("eraser");
  }

  onClickCircle() {
    this.drawingBoard.setMode("circle");
  }

  onClickRectangle() {
    this.drawingBoard.setMode("rectangle");
  }

  onClickPipette() {
    this.drawingBoard.setMode("pipette");
  }

  onSave() {
    this.executeCommand(new SaveCommand(this.drawingBoard));
  }

  drawButtonByType(type: BtnType) {
    switch (type) {
      case "back": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Back", type).setOnClick(this.onClickBack.bind(this)).build();
        btn.draw();
        return btn;
      }
      case "forward": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Forward", type).setOnClick(() => {}).build();
        btn.draw();
        return btn;
      }

      case "color": {
        const btn = new DrawingBoardMenuInput.Builder(this, "Color", type)
          .setOnChange((e: Event) => {
            if (e.target) {
              this.drawingBoard.setColor((e.target as HTMLInputElement).value);
            }
          })
          .build();
        btn.draw();
        return btn;
      }

      case "pipette": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Pipette", type)
          .setOnClick(this.onClickPipette.bind(this))
          .build();
        btn.draw();
        return btn;
      }

      case "eraser": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Eraser", type)
          .setOnClick(this.onClickEraser.bind(this))
          .build();
        btn.draw();
        return btn;
      }

      case "pen": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Pen", type).setOnClick(this.onClickPen.bind(this)).build();
        btn.draw();
        return btn;
      }

      case "circle": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Circle", type)
          .setOnClick(this.onClickCircle.bind(this))
          .build();
        btn.draw();
        return btn;
      }

      case "rectangle": {
        const btn = new DrawingBoardMenuBtn.Builder(this, "Rectangle", type).setOnClick(this.onClickRectangle).build();
        btn.draw();
        return btn;
      }

      case "save": {
        const btn = new DrawingBoardMenuSaveBtn.Builder(this, "Save", type)
          .setOnClick(this.onSave.bind(this))
          .setFilterListeners({
            blur: (e: Event) => {
              this.drawingBoard.saveSetting.blur = (e.target as HTMLInputElement)?.checked;
            },
            grayscale: (e: Event) => {
              this.drawingBoard.saveSetting.grayscale = (e.target as HTMLInputElement)?.checked;
            },
            invert: (e: Event) => {
              this.drawingBoard.saveSetting.invert = (e.target as HTMLInputElement)?.checked;
            },
          })
          .build();
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
