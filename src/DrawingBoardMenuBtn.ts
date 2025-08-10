import type { BtnType, DrawingBoardMenu } from "./DrawingBoardMenu";

abstract class DrawingBoardMenuElementBuilder {
  btn!: DrawingBoardMenuBtn;
  constructor() {}

  build() {
    return this.btn;
  }
}

export abstract class DrawingBoardMenuElement {
  protected menu: DrawingBoardMenu;
  protected name: string;
  protected type: BtnType;

  protected constructor(menu: DrawingBoardMenu, name: string, type: BtnType) {
    this.menu = menu;
    this.name = name;
    this.type = type;
  }

  abstract draw(): void;
}

export class DrawingBoardMenuInput extends DrawingBoardMenuElement {
  private onChange?: (e: Event) => void;
  private value?: string | number;

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

  draw() {
    const input = document.createElement("input");
    input.title = this.name;
    input.type = "color";
    input.id = `${this.type}-input`;
    if (this.onChange) {
      input.addEventListener("change", this.onChange.bind(this));
    }
    this.menu.colorBtn = input;
    this.menu.dom.append(input);
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
  private onClick?: () => void;
  private active?: boolean;

  private constructor(menu: DrawingBoardMenu, name: string, type: BtnType, onClick?: () => void, active?: boolean) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  draw() {
    const button = document.createElement("button");
    button.textContent = this.name;
    button.id = `${this.type}-button`;
    if (this.onClick) {
      button.addEventListener("click", this.onClick.bind(this));
    }
    this.menu.dom.append(button);
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
