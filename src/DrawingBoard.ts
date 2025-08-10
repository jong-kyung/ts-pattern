import { BackCommand, ForwardCommand } from "./commands";
import { ChromeDrawingBoardFactory, IEDrawingBoardFactory, type AbstractFactory } from "./DrawingBoardFactory";
import type { ChromeDrawingBoardHistory, DrawingBoardHistory } from "./DrawingBoardHistory";
import type { BtnType, ChromeDrawingBoardMenu, DrawingBoardMenu } from "./DrawingBoardMenu";

export interface DrawingBoardOption {
  menu: BtnType[];
}

export type DrawingBoardMode = "pen" | "eraser" | "pipette" | "rectangle" | "circle";

export abstract class DrawingBoard {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  history!: DrawingBoardHistory;
  menu!: DrawingBoardMenu;
  mode!: DrawingBoardMode;

  protected constructor(canvas: HTMLElement | null, factory: typeof AbstractFactory) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element is required");
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
  }

  setMode(mode: DrawingBoardMode) {
    this.mode = mode;
  }

  abstract initialize(option: DrawingBoardOption): void;

  static getInstance() {}
}

export class ChromeDrawingBoard extends DrawingBoard {
  private static instance: DrawingBoard;
  override menu: ChromeDrawingBoardMenu;
  override history: ChromeDrawingBoardHistory;

  private constructor(canvas: HTMLElement | null, factory: typeof ChromeDrawingBoardFactory) {
    super(canvas, factory);
    this.menu = factory.createDrawingBoardMenu(this, document.querySelector("#menu")!);
    this.history = factory.createDrawingBoardHistory(this);
  }

  initialize(option: DrawingBoardOption) {
    this.menu.initialize(option.menu);
    this.history.initialize();
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.code === "keyZ" && e.ctrlKey && e.shiftKey) {
        this.menu.executeCommand(new ForwardCommand(this.history));
        return;
      }

      if (e.code === "keyZ" && e.ctrlKey) {
        this.menu.executeCommand(new BackCommand(this.history));
        return;
      }
    });
  }

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeDrawingBoard(document.querySelector("#canvas"), ChromeDrawingBoardFactory);
    }
    return this.instance;
  }
}

export class IEDrawingBoard extends DrawingBoard {
  private static instance: DrawingBoard;

  initialize() {}

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEDrawingBoard(document.querySelector("#canvas"), IEDrawingBoardFactory);
    }
    return this.instance;
  }
}
