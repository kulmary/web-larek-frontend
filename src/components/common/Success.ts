import { Component } from "../base/Components";
import { ensureElement } from "../../utils/utils";
import { ISuccess } from "../../types";


export class Form<T> extends Component<ISuccess> {
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccess) {
    super(container);
    this._total = ensureElement<HTMLElement>('.order-success__description', container);
    this._button = ensureElement<HTMLButtonElement>('.button', container);
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set counter(value: number) {
    this.setText(this._button, `Списано ${value} синапсов`)
  }

  get button(): HTMLButtonElement {
    return this._button;
  }

  set button(element: HTMLButtonElement) {
    this._button = element;
  }
}