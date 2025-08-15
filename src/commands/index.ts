import type { DrawingBoard } from "../DrawingBoard";
import type { DrawingBoardHistory } from "../DrawingBoardHistory";

export class Invoker {
  private readonly command: { run(): void };

  constructor(command: { run(): void }) {
    this.command = command;
  }

  invoke() {
    this.command.run();
  }
}

// 어댑터 패턴
export class Adapter {
  private readonly command: Command;
  constructor(command: Command) {
    this.command = command;
  }
  run() {
    this.command.execute();
  }
}
// new Invoker(new Adapter(new BackCommand({} as any)));

// 커맨드 패턴, 다양한 명령을 하나의 객체로 통합
export abstract class Command {
  abstract name: string;
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

export const counter: { [key: string]: number } = {};

// 데코레이터 패턴
class CommandDecorator {
  command: Command;
  name: string;
  constructor(command: Command) {
    this.command = command;
    this.name = this.command.name;
  }
}
class ExecuteLogger extends CommandDecorator {
  execute() {
    console.log(this.command.name + " 명령을 실행합니다.");
    this.command.execute();
  }
  showLogger() {}
}
class ExecuteCounter extends CommandDecorator {
  execute() {
    this.command.execute();
    if (counter[this.command.name]) {
      counter[this.command.name]++;
    } else {
      counter[this.command.name] = 1;
    }
  }
  additional() {}
}

// mixin 패턴 :  클래스를 상속받아 기존 기능을 확장하는 패턴
function counterMixin(value: typeof BackCommand, context: ClassDecoratorContext) {
  return class extends value {
    override execute() {
      super.execute();
      if (counter[this.name]) {
        counter[this.name]++;
      } else {
        counter[this.name] = 1;
      }
    }
  };
}

function loggerMixin(value: typeof BackCommand, context: ClassDecoratorContext) {
  return class extends value {
    override execute() {
      super.execute();
      console.log(this.name + " 명령을 실행합니다.");
    }
  };
}

@counterMixin
@loggerMixin
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

new ExecuteCounter(new BackCommand({} as any));
new ExecuteLogger(new BackCommand({} as any));

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

export class SaveHistoryCommand extends Command {
  name = "saveHistory";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    this.drawingBoard.history.saveHistory();
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

export class SaveCommand extends Command {
  name = "save";
  drawingBoard: DrawingBoard;

  constructor(drawingBoard: DrawingBoard) {
    super();
    this.drawingBoard = drawingBoard;
  }

  override execute(): void {
    // Strategy Pattern
    this.drawingBoard.saveStrategy();
  }
}
