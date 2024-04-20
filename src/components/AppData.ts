import { IBasket, IOrder, IProduct, OrderForm, PaymentWay } from '../types';
import { IEvents } from './base/events';

export class AppData {
	items: IProduct[] = [];
	basket: IBasket = {
		items: [],
		total: 0,
	};
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: 'card',
		total: 0,
		items: [],
	};
	preview: IProduct = null;
	formErrors: Partial<Record<keyof OrderForm, string>> = {};

	constructor(protected events: IEvents) {}
	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:change');
	}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:change', this.items);
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this.events.emit('preview:change', this.preview);
	}

	inBasket(item: IProduct) {
		return this.basket.items.includes(item.id);
	}

	addIntoBasket(item: IProduct) {
		this.basket.items.push(item.id);
		this.basket.total += item.price;
		this.events.emit('basket:change', this.basket);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		this.basket.total -= item.price;
		this.events.emit('basket:change', this.basket);
	}

	setPaymentWay(way: PaymentWay) {
		this.order.payment = way;
	}

	setOrderField(field: keyof OrderForm, value: string) {
		if (field === 'payment') {
			this.setPaymentWay(value as PaymentWay);
		} else {
			this.order[field] = value;
		}

		if (this.order.payment && this.validateOrder()) {
			this.order.total = this.basket.total;
			this.order.items = this.basket.items;
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
