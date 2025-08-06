import type { DrawingBoardMenu } from "./DrawingBoardMenu";

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

  protected constructor(menu: DrawingBoardMenu, name: string) {
    this.menu = menu;
    this.name = name;
  }

  abstract draw(): void;
}

export class DrawingBoardMenuInput extends DrawingBoardMenuElement {
  private onChange?: () => void;
  private value?: string | number;

  private constructor(menu: DrawingBoardMenu, name: string, onChange?: () => void, value?: string | number) {
    super(menu, name);
    this.onChange = onChange;
    this.value = value;
  }

  draw() {
    const input = document.createElement("input");
    input.title = this.name;
    input.type = "color";

    if (this.onChange) {
      input.addEventListener("change", this.onChange.bind(this));
    }
    this.menu.dom.append(input);
  }

  // Builder 패턴
  static Builder = class DrawingBoardMenuInputBuilder extends DrawingBoardMenuElementBuilder {
    override btn: DrawingBoardMenuInput;
    constructor(menu: DrawingBoardMenu, name: string) {
      super();
      this.btn = new DrawingBoardMenuInput(menu, name);
    }

    setOnChange(onChange: () => void) {
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

  private constructor(menu: DrawingBoardMenu, name: string, onClick?: () => void, active?: boolean) {
    super(menu, name);
    this.onClick = onClick;
    this.active = active;
  }

  draw() {
    const button = document.createElement("button");
    button.textContent = this.name;
    if (this.onClick) {
      button.addEventListener("click", this.onClick.bind(this));
    }
    this.menu.dom.append(button);
  }

  // Builder 패턴
  static Builder = class DrawingBoardMenuBtnBuilder extends DrawingBoardMenuElementBuilder {
    override btn: DrawingBoardMenuBtn;
    constructor(menu: DrawingBoardMenu, name: string) {
      super();
      this.btn = new DrawingBoardMenuBtn(menu, name);
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
