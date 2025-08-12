import type { BtnType, DrawingBoardMenu } from "./DrawingBoardMenu";
import type { MenuDrawVisitor } from "./MenuDrawVisitor";

abstract class DrawingBoardMenuElementBuilder {
  btn!: DrawingBoardMenuElement;
  constructor() {}

  build() {
    return this.btn;
  }
}

export abstract class DrawingBoardMenuElement {
  public menu: DrawingBoardMenu;
  public name: string;
  public type: BtnType;

  protected constructor(menu: DrawingBoardMenu, name: string, type: BtnType) {
    this.menu = menu;
    this.name = name;
    this.type = type;
  }

  abstract accept(visitor: MenuDrawVisitor): HTMLElement;
}

export class DrawingBoardMenuInput extends DrawingBoardMenuElement {
  public onChange?: (e: Event) => void;
  public value?: string | number;

  private constructor(
    menu: DrawingBoardMenu,
    name: string,
    type: BtnType,
    onChange?: () => void,
    value?: string | number
  ) {
    super(menu, name, type);
    this.onChange = onChange;
    this.value = value;
  }

  override accept(visitor: MenuDrawVisitor): HTMLInputElement {
    return visitor.drawInput(this);
  }

  // Builder 패턴
  static Builder = class DrawingBoardMenuInputBuilder extends DrawingBoardMenuElementBuilder {
    override btn: DrawingBoardMenuInput;
    constructor(menu: DrawingBoardMenu, name: string, type: BtnType) {
      super();
      this.btn = new DrawingBoardMenuInput(menu, name, type);
    }

    setOnChange(onChange: (e: Event) => void) {
      this.btn.onChange = onChange;
      return this;
    }

    setValue(value: string | number) {
      this.btn.value = value;
      return this;
    }
  };
}
export class DrawingBoardMenuBtn extends DrawingBoardMenuElement {
  public onClick?: () => void;
  public active?: boolean;

  protected constructor(menu: DrawingBoardMenu, name: string, type: BtnType, onClick?: () => void, active?: boolean) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  override accept(visitor: MenuDrawVisitor): HTMLButtonElement {
    return visitor.drawBtn(this);
  }

  // Builder 패턴
  static Builder = class DrawingBoardMenuBtnBuilder extends DrawingBoardMenuElementBuilder {
    override btn: DrawingBoardMenuBtn;
    constructor(menu: DrawingBoardMenu, name: string, type: BtnType) {
      super();
      this.btn = new DrawingBoardMenuBtn(menu, name, type);
    }

    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }

    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }
  };
}

export class DrawingBoardMenuSaveBtn extends DrawingBoardMenuBtn {
  public onClickBlur!: (e: Event) => void;
  public onClickInvert!: (e: Event) => void;
  public onClickGrayscale!: (e: Event) => void;

  private constructor(menu: DrawingBoardMenu, name: string, type: BtnType, onClick?: () => void, active?: boolean) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  override accept(visitor: MenuDrawVisitor): HTMLButtonElement {
    return visitor.drawSaveBtn(this);
  }

  // Builder 패턴
  static override Builder = class DrawingBoardSaveMenuBtnBuilder extends DrawingBoardMenuElementBuilder {
    override btn: DrawingBoardMenuSaveBtn;
    constructor(menu: DrawingBoardMenu, name: string, type: BtnType) {
      super();
      this.btn = new DrawingBoardMenuSaveBtn(menu, name, type);
    }

    override build(): DrawingBoardMenuSaveBtn {
      return this.btn;
    }

    setFilterListeners(listeners: { [key in "blur" | "invert" | "grayscale"]: (e: Event) => void }) {
      this.btn.onClickBlur = listeners.blur;
      this.btn.onClickInvert = listeners.invert;
      this.btn.onClickGrayscale = listeners.grayscale;
      return this;
    }

    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }

    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }
  };
}
