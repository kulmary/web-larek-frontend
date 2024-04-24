import { Component } from "../base/Components";
import { ensureElement } from "../../utils/utils";
import { ISuccess,ISuccessAction } from "../../types";



export class Success extends Component<ISuccess> {
  protected _counter: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccessAction) {
    super(container);
    this._counter = ensureElement<HTMLElement>('.order-success__description', container);
    this._button = ensureElement<HTMLButtonElement>('.button', container);
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set counter(value: number) {
    this._counter.textContent= `Списано ${value} синапсов`;
  }

}