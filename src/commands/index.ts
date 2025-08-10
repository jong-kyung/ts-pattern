import type { DrawingBoard } from "../DrawingBoard";
import type { DrawingBoardHistory } from "../DrawingBoardHistory";

// 커맨드 패턴, 다양한 명령을 하나의 객체로 통합
export abstract class Command {
  abstract execute(): void;
}
export class ForwardCommand extends Command {
  name = "forward";
  history: DrawingBoardHistory;

  constructor(history: DrawingBoardHistory) {
    super();
    this.history = history;
  }

  // Receiver 역할
  override execute(): void {
    this.history.redo(); // receiver에게 로직 전송
  }
}

export class BackCommand extends Command {
  name = "back";
  history: DrawingBoardHistory;

  constructor(history: DrawingBoardHistory) {
    super();
    this.history = history;
  }

  // Receiver 역할
  override execute(): void {
    this.history.undo(); // receiver에게 로직 전송
  }
}

export class PenSelectCommand extends Command {
  name = "penSelect";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    this.drawingBoard.menu.setActiveButton("pen");
  }
}

export class EraserSelectCommand extends Command {
  name = "eraserSelect";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    this.drawingBoard.menu.setActiveButton("eraser");
  }
}

export class CircleSelectCommand extends Command {
  name = "circleSelect";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    this.drawingBoard.menu.setActiveButton("circle");
  }
}

export class RectangleSelectCommand extends Command {
  name = "rectangleSelect";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    this.drawingBoard.menu.setActiveButton("rectangle");
  }
}

export class PipetteSelectCommand extends Command {
  name = "pipetteSelect";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    this.drawingBoard.menu.setActiveButton("pipette");
  }
}
