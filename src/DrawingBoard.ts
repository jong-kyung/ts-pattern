import { ChromeDrawingBoardFactory, IEDrawingBoardFactory, type AbstractFactory } from "./DrawingBoardFactory";
import type { ChromeDrawingBoardHistory, DrawingBoardHistory } from "./DrawingBoardHistory";
import type { BtnType, ChromeDrawingBoardMenu, DrawingBoardMenu } from "./DrawingBoardMenu";
import { CircleMode, EraserMode, PenMode, PipetteMode, RectangleMode, type Mode } from "./modes";

export interface DrawingBoardOption {
  menu: BtnType[];
}

export type DrawingBoardMode = "pen" | "eraser" | "pipette" | "rectangle" | "circle";

export abstract class DrawingBoard {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  history!: DrawingBoardHistory;
  menu!: DrawingBoardMenu;
  mode!: Mode;
  color: string;
  active: boolean;
  saveStrategy!: () => void;

  protected constructor(canvas: HTMLElement | null, factory: typeof AbstractFactory) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element is required");
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.color = "#000";
    this.active = false;
    this.setSaveStrategy("png");
  }

  setSaveStrategy(imageType: "png" | "jpg" | "webp" | "avif" | "gif" | "pdf") {
    switch (imageType) {
      case "png":
        // 부모에 대한 참조를 갖고 있지 않아야 strategy 패턴, 참조를 넣게되면 state 패턴으로 변질 될 수 있음
        this.saveStrategy = () => {
          const a = document.createElement("a");
          a.download = "drawing.png";
          const dataURL = this.canvas.toDataURL("image/png");
          let url = dataURL.replace(/^data:image\/png/, "data:application/octet-stream");
          a.href = url;
          a.click();
        };
        break;
      case "jpg":
        this.saveStrategy = () => {
          const a = document.createElement("a");
          a.download = "drawing.jpg";
          const dataURL = this.canvas.toDataURL("image/jpeg");
          let url = dataURL.replace(/^data:image\/jpeg/, "data:application/octet-stream");
          a.href = url;
          a.click();
        };
        break;
      case "webp":
        this.saveStrategy = () => {
          const a = document.createElement("a");
          a.download = "drawing.webp";
          const dataURL = this.canvas.toDataURL("image/webp");
          let url = dataURL.replace(/^data:image\/webp/, "data:application/octet-stream");
          a.href = url;
          a.click();
        };
        break;
    }
  }

  setMode(mode: DrawingBoardMode) {
    switch (mode) {
      case "pen":
        this.mode = new PenMode(this);
        break;
      case "eraser":
        this.mode = new EraserMode(this);
        break;
      case "pipette":
        this.mode = new PipetteMode(this);
        break;
      case "rectangle":
        this.mode = new RectangleMode(this);
        break;
      case "circle":
        this.mode = new CircleMode(this);
        break;
    }
  }

  setColor(color: string) {
    this.color = color;
  }

  changeColor(color: string) {
    this.setColor(color);
    if (this.menu.colorBtn) {
      this.menu.colorBtn.value = color;
    }
  }

  abstract initialize(option: DrawingBoardOption): void;
  abstract onMouseDown(e: MouseEvent): void;
  abstract onMouseMove(e: MouseEvent): void;
  abstract onMouseUp(e: MouseEvent): void;

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
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));

    this.canvas.addEventListener("mouseleave", this.onMouseUp.bind(this));
  }

  override onMouseDown(e: MouseEvent): void {
    this.mode.mousedown(e);
  }
  override onMouseMove(e: MouseEvent): void {
    this.mode.mousemove(e);
  }
  override onMouseUp(e: MouseEvent): void {
    this.mode.mouseup(e);
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

  override onMouseDown(e: MouseEvent): void {}
  override onMouseMove(e: MouseEvent): void {}
  override onMouseUp(e: MouseEvent): void {}

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEDrawingBoard(document.querySelector("#canvas"), IEDrawingBoardFactory);
    }
    return this.instance;
  }
}
