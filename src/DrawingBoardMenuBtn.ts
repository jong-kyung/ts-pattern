import type { BtnType, DrawingBoardMenu } from "./DrawingBoardMenu";

abstract class DrawingBoardMenuElementBuilder {
  btn!: DrawingBoardMenuElement;
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

  draw() {
    const btn = this.createButton();
    // 템플릿 메서드 패턴
    this.appendBeforeButton();
    this.appendToDom(btn);
  }

  abstract createButton(): HTMLElement;
  abstract appendBeforeButton(): void;
  abstract appendToDom(element: HTMLElement): void;
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

  createButton(): HTMLInputElement {
    const input = document.createElement("input");
    input.title = this.name;
    input.type = "color";
    input.id = `${this.type}-input`;
    if (this.onChange) {
      input.addEventListener("change", this.onChange.bind(this));
    }
    return input;
  }

  appendBeforeButton() {}

  appendToDom(input: HTMLInputElement) {
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
  protected onClick?: () => void;
  protected active?: boolean;

  protected constructor(menu: DrawingBoardMenu, name: string, type: BtnType, onClick?: () => void, active?: boolean) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  createButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = this.name;
    button.id = `${this.type}-button`;
    if (this.onClick) {
      button.addEventListener("click", this.onClick.bind(this));
    }
    return button;
  }

  appendBeforeButton() {}

  appendToDom(button: HTMLButtonElement) {
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

export class DrawingBoardMenuSaveBtn extends DrawingBoardMenuBtn {
  private onClickBlur!: (e: Event) => void;
  private onClickInvert!: (e: Event) => void;
  private onClickGrayscale!: (e: Event) => void;

  private constructor(menu: DrawingBoardMenu, name: string, type: BtnType, onClick?: () => void, active?: boolean) {
    super(menu, name, type);
    this.onClick = onClick;
    this.active = active;
  }

  override appendBeforeButton() {
    this.drawInput("blur", this.onClickBlur);
    this.drawInput("invert", this.onClickInvert);
    this.drawInput("grayscale", this.onClickGrayscale);
  }

  drawInput(title: string, onChange: (e: Event) => void) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.title = title;
    input.addEventListener("change", onChange.bind(this));
    this.menu.dom.append(input);
  }

  // Builder 패턴
  static override Builder = class DrawingBoardSaveMenuBtnBuilder extends DrawingBoardMenuElementBuilder {
    override btn: DrawingBoardMenuSaveBtn;
    constructor(menu: DrawingBoardMenu, name: string, type: BtnType) {
      super();
      this.btn = new DrawingBoardMenuSaveBtn(menu, name, type);
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
