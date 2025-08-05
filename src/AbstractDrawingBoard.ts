abstract class DrawingBoard {
  protected constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element is required");
    }
  }

  abstract initialize(): void;

  static getInstance() {}
}

export default DrawingBoard;
