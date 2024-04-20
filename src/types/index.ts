export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBasket {
    total: number;
    items: string[];
}

export type PaymentWay = 'cash' | 'card';

export interface IOrder {
    payment: PaymentWay;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

export interface IOrderResult {
    id: string;
    total: number;
}

export interface ISuccess {
    onClick: (event: MouseEvent) => void;
}

export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    createOrderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
