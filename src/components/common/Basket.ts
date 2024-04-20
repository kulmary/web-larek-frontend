import { View } from "../base/Components";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IBasketView } from "../../types";


export class Basket extends View<IBasketView> {
    static template = ensureElement<HTMLTemplateElement>('#basket')
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(protected events: EventEmitter) {
        super(events, cloneTemplate(Basket.template));

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._button, true);
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}