import {
  CircleSelectCommand,
  Command,
  EraserSelectCommand,
  PenSelectCommand,
  PipetteSelectCommand,
  PremiumCommandProxy,
  RectangleSelectCommand,
  SaveHistoryCommand,
} from "../commands";
import type { DrawingBoard } from "../DrawingBoard";

const convertToHex = (color: number) => {
  if (color < 0) return 0;
  if (color > 255) return 255;
  const hex = color.toString(16);
  return `0${hex}`.slice(-2); // 2자리로 맞추기 위해 앞에 0을 붙임
};

const rgb2hex = (r: number, g: number, b: number): string => {
  return `#${convertToHex(r)}${convertToHex(g)}${convertToHex(b)}`;
};

// State Pattern 적용
export abstract class Mode {
  protected drawingBoard: DrawingBoard;
  constructor(drawingBoard: DrawingBoard) {
    this.drawingBoard = drawingBoard;
  }

  abstract mousedown(e: MouseEvent): void;
  abstract mousemove(e: MouseEvent): void;
  abstract mouseup(e: MouseEvent): void;
  invoke(command: Command) {
    command.execute();
  }
}

export class PenMode extends Mode {
  constructor(drawingBoard: DrawingBoard) {
    super(drawingBoard);
    drawingBoard.menu.executeCommand(new PenSelectCommand(drawingBoard));
  }

  override mousedown(e: MouseEvent): void {
    this.drawingBoard.active = true;
    this.drawingBoard.ctx.lineWidth = 1;
    this.drawingBoard.ctx.lineCap = "round";
    this.drawingBoard.ctx.strokeStyle = this.drawingBoard.color;
    this.drawingBoard.ctx.globalCompositeOperation = "source-over";
    this.drawingBoard.ctx.beginPath();
    this.drawingBoard.ctx.moveTo(e.offsetX, e.offsetY);
  }

  override mousemove(e: MouseEvent): void {
    if (!this.drawingBoard.active) return;
    this.drawingBoard.ctx.lineTo(e.offsetX, e.offsetY);
    this.drawingBoard.ctx.stroke();
    this.drawingBoard.ctx.moveTo(e.offsetX, e.offsetY);
  }

  override mouseup(e: MouseEvent): void {
    if (this.drawingBoard.active) {
      this.invoke(new SaveHistoryCommand(this.drawingBoard));
    }
    this.drawingBoard.active = false;
  }
}

export class EraserMode extends Mode {
  constructor(drawingBoard: DrawingBoard) {
    super(drawingBoard);
    drawingBoard.menu.executeCommand(new EraserSelectCommand(drawingBoard));
  }
  override mousedown(e: MouseEvent): void {
    this.drawingBoard.active = true;
    this.drawingBoard.ctx.lineWidth = 10;
    this.drawingBoard.ctx.lineCap = "round";
    this.drawingBoard.ctx.strokeStyle = "#000";
    this.drawingBoard.ctx.globalCompositeOperation = "destination-out";
    this.drawingBoard.ctx.beginPath();
    this.drawingBoard.ctx.moveTo(e.offsetX, e.offsetY);
  }

  override mousemove(e: MouseEvent): void {
    if (!this.drawingBoard.active) return;
    this.drawingBoard.ctx.lineTo(e.offsetX, e.offsetY);
    this.drawingBoard.ctx.stroke();
    this.drawingBoard.ctx.moveTo(e.offsetX, e.offsetY);
  }

  override mouseup(e: MouseEvent): void {
    if (this.drawingBoard.active) {
      this.invoke(new SaveHistoryCommand(this.drawingBoard));
    }
    this.drawingBoard.active = false;
  }
}

export class PipetteMode extends Mode {
  constructor(drawingBoard: DrawingBoard) {
    super(drawingBoard);
    drawingBoard.menu.executeCommand(new PipetteSelectCommand(drawingBoard));
  }

  override mousedown(e: MouseEvent): void {
    // Pipette mode mouse down logic
  }

  override mousemove(e: MouseEvent): void {
    const { data } = this.drawingBoard.ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
    // 투명도
    if (data[3] === 0) {
      this.drawingBoard.changeColor("#ffffff");
    } else {
      this.drawingBoard.changeColor(rgb2hex(data[0], data[1], data[2]));
    }
  }

  override mouseup(e: MouseEvent): void {
    this.drawingBoard.menu.executeCommand(new PenSelectCommand(this.drawingBoard));
  }
}

export class RectangleMode extends Mode {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  imageData?: ImageData;

  constructor(drawingBoard: DrawingBoard) {
    super(drawingBoard);
    drawingBoard.menu.executeCommand(new PremiumCommandProxy(new RectangleSelectCommand(drawingBoard)));
  }

  override mousedown(e: MouseEvent): void {
    this.drawingBoard.active = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.imageData = this.drawingBoard.ctx.getImageData(0, 0, 300, 300);
  }

  override mousemove(e: MouseEvent): void {
    this.endX = e.offsetX;
    this.endY = e.offsetY;

    // reset canvas
    if (this.imageData) {
      this.drawingBoard.ctx.putImageData(this.imageData, 0, 0);
    }
    this.drawingBoard.ctx.lineWidth = 1;
    this.drawingBoard.ctx.lineCap = "round";
    this.drawingBoard.ctx.strokeStyle = this.drawingBoard.color;
    this.drawingBoard.ctx.globalCompositeOperation = "source-over";
    const width = this.endX - this.startX!;
    const height = this.endY - this.startY!;
    this.drawingBoard.ctx.beginPath();
    this.drawingBoard.ctx.rect(this.startX!, this.startY!, width, height);
    this.drawingBoard.ctx.stroke();
  }

  override mouseup(e: MouseEvent): void {
    if (this.drawingBoard.active) {
      this.drawingBoard.ctx.lineWidth = 1;
      this.drawingBoard.ctx.lineCap = "round";
      this.drawingBoard.ctx.strokeStyle = this.drawingBoard.color;
      this.drawingBoard.ctx.globalCompositeOperation = "source-over";
      const width = this.endX! - this.startX!;
      const height = this.endY! - this.startY!;
      this.drawingBoard.ctx.beginPath();
      this.drawingBoard.ctx.rect(this.startX!, this.startY!, width, height);
      this.drawingBoard.ctx.stroke();

      this.invoke(new SaveHistoryCommand(this.drawingBoard));
      this.startX = undefined;
      this.startY = undefined;
      this.imageData = undefined;
    }
    this.drawingBoard.active = false;
  }
}

export class CircleMode extends Mode {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  imageData?: ImageData;

  constructor(drawingBoard: DrawingBoard) {
    super(drawingBoard);
    drawingBoard.menu.executeCommand(new PremiumCommandProxy(new CircleSelectCommand(drawingBoard)));
  }

  override mousedown(e: MouseEvent): void {
    this.drawingBoard.active = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.imageData = this.drawingBoard.ctx.getImageData(0, 0, 300, 300);
  }

  override mousemove(e: MouseEvent): void {
    this.endX = e.offsetX;
    this.endY = e.offsetY;

    // reset canvas
    if (this.imageData) {
      this.drawingBoard.ctx.putImageData(this.imageData, 0, 0);
    }
    this.drawingBoard.ctx.lineWidth = 1;
    this.drawingBoard.ctx.lineCap = "round";
    this.drawingBoard.ctx.strokeStyle = this.drawingBoard.color;
    this.drawingBoard.ctx.globalCompositeOperation = "source-over";
    const width = this.endX - this.startX!;
    const height = this.endY - this.startY!;
    const radius = Math.hypot(width, height);
    this.drawingBoard.ctx.beginPath();
    this.drawingBoard.ctx.arc(this.startX!, this.startY!, radius, 0, Math.PI * 2);
    this.drawingBoard.ctx.stroke();
  }

  override mouseup(e: MouseEvent): void {
    if (this.drawingBoard.active) {
      this.drawingBoard.ctx.lineWidth = 1;
      this.drawingBoard.ctx.lineCap = "round";
      this.drawingBoard.ctx.strokeStyle = this.drawingBoard.color;
      this.drawingBoard.ctx.globalCompositeOperation = "source-over";
      const width = this.endX! - this.startX!;
      const height = this.endY! - this.startY!;
      const radius = Math.hypot(width, height);
      this.drawingBoard.ctx.beginPath();
      this.drawingBoard.ctx.arc(this.startX!, this.startY!, radius, 0, Math.PI * 2);
      this.drawingBoard.ctx.stroke();

      this.invoke(new SaveHistoryCommand(this.drawingBoard));
      this.startX = undefined;
      this.startY = undefined;
      this.imageData = undefined;
    }
    this.drawingBoard.active = false;
  }
}
