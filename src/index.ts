import './scss/styles.scss';
import { WebLarekAPI } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { Modal } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { IProduct, OrderForm } from './types';
import { Card } from './components/Card';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalCardTemplate = ensureElement<HTMLElement>('#modal-container')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

// Модель данных приложения
const appData = new AppData(events);


// Глобальные контейнеры
const page = new Page(events, document.body,);
const modal = new Modal(events, modalCardTemplate);
const basket = new Basket(events);
const orderForm = new Order(events, cloneTemplate(orderTemplate));
const contactsForm = new Contacts(events, cloneTemplate(contactsTemplate));
const success = new Success(cloneTemplate(successTemplate));

events.on('modal:open', () => {
    page.locked = true;
})

events.on('modal:close', () => {
    page.locked = false;
})


events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});


events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        })
        return card.render(item)
    })
})

events.on('preview:change', (item: IProduct) => {

    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (appData.inBasket(item)) {
                appData.removeFromBasket(item)
                card.button = 'В Корзину';
            } else {
                appData.addIntoBasket(item)
                card.button = 'Удалить из корзины';
            }
            modal.close()
        }
    })
    card.button = appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину';
    modal.render({ content: card.render(item) })
})

events.on('basket:change', () => {
    page.counter = appData.basket.items.length
    basket.items = appData.basket.items.map((id,index) => {
        const item = appData.items.find((item) => item.id === id);
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeFromBasket(item)
        });
        item.index=index+1;
        return card.render(item);
    });
    basket.total = appData.basket.total;
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    }
    )
})



events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: [],
        })
    })
})


events.on(/^order\..*:change$/, (data: { field: keyof OrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
})


events.on('formErrors:change', (error: Partial<OrderForm>) => {

    const { payment, address, email, phone } = error;
    orderForm.valid = !payment && !address;
})


events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        })
    })
})


events.on(/^contacts\..*:change$/, (data: { field: keyof OrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
})


events.on('formErrors:change', (error: Partial<OrderForm>) => {

    const { email, phone } = error;
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
})


events.on('contacts:submit', () => {
    api.createOrderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });
            modal.render({
                content: success.render({ counter: result.total })
            });
            appData.clearBasket();
        })
        .catch(err => {
            console.error(err);
        });
})


api.getProductList().then(appData.setItems.bind(appData)).catch((err) => console.log(err))