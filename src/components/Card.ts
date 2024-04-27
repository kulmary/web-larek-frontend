import { Component } from "./base/Components";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}



export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price?: HTMLElement;
    protected _category: HTMLElement;
    protected _index?: HTMLElement | null;
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = container.querySelector(`.card__image`);
        this._button = container.querySelector(`.card__button`);
        this._description = container.querySelector(`.card__description`);
        this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
        this._category = container.querySelector(`.card__category`);
        this._index = container.querySelector(`.basket__item-index`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }


    get price(): string {
        return this._price.textContent || '';
    }

    set price(value: string) {
        if (value) {
            this.setText(this._price, String(value)+' cинапсов')
        }
        else {
            this.setText(this._price, 'Бесценно')
        }
        if (this._button) {
            this._button.disabled = !value;
        }
    }


    get category(): string {
        return this._category.textContent || '';
    }

    set category(value: string) {
        this.setText(this._category, value)


       if (value == 'другое') {
            this._category?.classList?.add('card__category_other')
        } else if (value == 'софт-скил') {
            this._category?.classList?.add('card__category_soft')
        } else if (value == 'дополнительное') {
            this._category?.classList?.add('card__category_additional')
        } else if (value == 'кнопка') {
            this._category?.classList?.add('card__category_button')
        } else if (value == 'хард-скил') {
            this._category?.classList?.add('card__category_hard')
        }
   
    }


    set description(value: string | string[]) {

        this.setText(this._description, value);
    }

    get description(): string {
		return this._description.textContent || '';
	}

    set index(value: number) {
		this._index.textContent = String(value);
	}

    set button(value: string) {

        this.setText(this._button, value);
    }

}

