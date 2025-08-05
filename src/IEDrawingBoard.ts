import DrawingBoard from "./AbstractDrawingBoard";

class IEDrawingBoard extends DrawingBoard {
  private static instance: DrawingBoard;

  initialize() {}

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEDrawingBoard(document.querySelector("#canvas"));
    }
    return this.instance;
  }
}

export default IEDrawingBoard;
