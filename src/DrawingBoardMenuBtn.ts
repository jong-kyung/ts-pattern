interface Btn {
  name: string;
  type: string;
  onClick?: () => void;
  active: boolean;
}

interface Input {
  name: string;
  type: string;
  onChange?: () => void;
  value: string | number;
}

class DrawingBoardMenuBtn {
  private name: string;
  private type: string;
  private onClick?: () => void;
  private onChange?: () => void;
  private active?: boolean;
  private value?: string | number;

  private constructor(
    name: string,
    type: string,
    onClick?: () => void,
    onChange?: () => void,
    active?: boolean,
    value?: string | number
  ) {
    this.name = name;
    this.type = type;
    this.onClick = onClick;
    this.onChange = onChange;
    this.active = active;
    this.value = value;
  }

  // Builder 패턴
  static Builder = class DrawingBoardMenuBtnBuilder {
    btn: DrawingBoardMenuBtn;
    constructor(name: string, type: string) {
      this.btn = new DrawingBoardMenuBtn(name, type);
    }

    setName(name: string) {
      this.btn.name = name;
      return this;
    }

    setType(type: string) {
      this.btn.type = type;
      return this;
    }

    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }

    setOnChange(onChange: () => void) {
      this.btn.onChange = onChange;
      return this;
    }

    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }

    setValue(value: string | number) {
      this.btn.value = value;
      return this;
    }

    build() {
      return this.btn;
    }
  };
}

const backBtn = new DrawingBoardMenuBtn.Builder("Back", "button")
  .setOnClick(() => {})
  .setActive(false)
  .build();
