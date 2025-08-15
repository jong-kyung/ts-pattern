// Bridge 패턴 : 추상화와 구현의 분리
abstract class DrawingBoardPlatform {}
abstract class DrawingBoard {
  public readonly platform: DrawingBoardPlatform;
  constructor(platform: DrawingBoardPlatform) {
    this.platform = platform;
  }
}

class PremiumDrawingBoard extends DrawingBoard {}
class BasicDrawingBoard extends DrawingBoard {}
class ExpertDrawingBoard extends DrawingBoard {}

class ChromeDrawingBoard extends DrawingBoardPlatform {}
class IEDrawingBoard extends DrawingBoardPlatform {}
class SafariDrawingBoard extends DrawingBoardPlatform {}

// 합성을 통해 다양한 플랫폼에서 동작하는 드로잉 보드 생성
new PremiumDrawingBoard(new ChromeDrawingBoard());
new PremiumDrawingBoard(new IEDrawingBoard());
new PremiumDrawingBoard(new SafariDrawingBoard());
