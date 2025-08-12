import type { DrawingBoardMenuBtn, DrawingBoardMenuInput, DrawingBoardMenuSaveBtn } from "./DrawingBoardMenuBtn";

export abstract class MenuDrawVisitor {
  abstract drawBtn(btn: DrawingBoardMenuBtn): HTMLButtonElement;
  abstract drawInput(input: DrawingBoardMenuInput): HTMLInputElement;
  abstract drawSaveBtn(btn: DrawingBoardMenuSaveBtn): HTMLButtonElement;
}

// Visitor 패턴 사용, 단일 책임 원칙을 지키기 위해 각 버튼의 그리기 로직을 분리
export class ChromeMenuDrawVisitor extends MenuDrawVisitor {
  override drawBtn(btn: DrawingBoardMenuBtn): HTMLButtonElement {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = btn.name;
    buttonElement.id = `${btn.type}-button`;
    if (btn.onClick) {
      buttonElement.addEventListener("click", btn.onClick.bind(btn));
    }
    btn.menu.dom.append(buttonElement);
    return buttonElement;
  }

  override drawInput(input: DrawingBoardMenuInput): HTMLInputElement {
    const inputElement = document.createElement("input");
    inputElement.type = "color";
    inputElement.title = input.name;
    inputElement.id = `${input.type}-input`;
    if (input.onChange) {
      inputElement.addEventListener("change", input.onChange.bind(input));
    }
    input.menu.colorBtn = inputElement;
    input.menu.dom.append(inputElement);
    return inputElement;
  }

  override drawSaveBtn(btn: DrawingBoardMenuSaveBtn): HTMLButtonElement {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = btn.name;
    buttonElement.id = `${btn.type}-button`;
    if (btn.onClick) {
      buttonElement.addEventListener("click", btn.onClick.bind(btn));
    }

    this.drawFilter(btn, "blur", btn.onClickBlur);
    this.drawFilter(btn, "invert", btn.onClickInvert);
    this.drawFilter(btn, "grayscale", btn.onClickGrayscale);
    return buttonElement;
  }

  private drawFilter(btn: DrawingBoardMenuSaveBtn, title: string, onChange: (e: Event) => void) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.title = title;
    input.addEventListener("change", onChange.bind(btn));
    btn.menu.dom.append(input);
  }
}
