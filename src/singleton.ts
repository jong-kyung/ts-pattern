// 생성 패턴 : 싱글톤 패턴
class DrawingBoard {
  private static instance: DrawingBoard;
  private constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element is required");
    }
  }

  initialize() {}
  initializeMenu() {}

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static getInstance() {
    if (!this.instance) {
      this.instance = new DrawingBoard(document.querySelector("#canvas"));
    }
    return this.instance;
  }
}

export default DrawingBoard;
