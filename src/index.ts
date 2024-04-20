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

const api=new WebLarekAPI(CDN_URL,API_URL);
const events = new EventEmitter();
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalCardTemplate=ensureElement<HTMLElement>('#modal-container')
const orderTemplate=ensureElement<HTMLTemplateElement>('#order')

// Модель данных приложения
const appData = new AppData(events);


// Глобальные контейнеры
const page = new Page( events,document.body,);
const modal = new Modal(events, modalCardTemplate);
const basket = new Basket(events);
const orderForm= new Order(events, cloneTemplate(orderTemplate));

