import DrawingBoard from "./AbstractDrawingBoard";

class ChromeDrawingBoard extends DrawingBoard {
  private static instance: DrawingBoard;

  initialize() {}
  initializeMenu() {}

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeDrawingBoard(document.querySelector("#canvas"));
    }
    return this.instance;
  }
}

export default ChromeDrawingBoard;
