# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура
Слои архитектуры образуют шаблон проектирования Model-View-Presenter.

## Базовые классы
**Component** - базовый класс для компонентов интерфейса. В конструкторе принимает container типа HTMLElement. 
Содержит 5 методов: 
- toggleClass (переключает класс элемента), 
- render (возвращает корневой DOM-элемент), 
- setText (устанавливает текстовое содержимое), 
- setImage (устанавливает изображение с альтернативным текстом), 
- setDisabled (меняет статус блокировки)

**View** - класс представления, наследуется от Component, но также имеет возможность эмиттить события. В конструкторе принимает container типа HTMLElement и событие типа IEvents

**EventEmitter** - брокер событий, реализующий паттер "Observer". Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.
Содержит 3 основных метода (описанных в интерфейсе IEvents):
- on (позволяет подписаться на событие )
- emit (инициализирует событие )
- trigger (вызывает функцию инициализирующую событие)
Также есть методы off(снимает слушатель с события), onAll (позволяет подписаться на все события), offAll(снимает слушатель со всех событий)

**api** - содержит в себе базовую логику отправки запросов. В конструкторе принимает базовый URL сервера и объект с заголовками запроса(опциональный).
Содержит 2 основых метода:
- get (позволяет получить данные с сервера: на входе получает endpoint, на который делает GET запрос и возвращает промис с объектом)
- post (позволяет отправить данные на сервер: на входе получает объект с данными и endpoint, на который отправляет эти данные. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.)

## Классы представления
**Card** - отвечает за отображение описания товара (содержит поля: название, изображение, описание, стоимость, категория). Наследуется от Component. Класс используется для отображение карточки товара в трех местах: в списке всех карточек, в модальном окне и в корзине товаров (генерируются на основе разных HTML шаблонов). В случае отображение в модальном окне и в корзине также присутствует кнопка для взаимодействия.
Генерирует событие: 
- card:select (при клике по карточке на главной странице)

**Page** - отвечает за отображение главной страницы (содержит счетчик товаров в корзине, каталог товаров, значок корзины, элемент блокировки скролла), наследуется от View.
Генерирует событие:
-basket:open (при клике на корзину)

**Modal** - отвечает за реализацию модального окна, наследуется от View. 

**Form** - отвечает за реализацию формы, наследуется от View. Обрабатывает события ввода данных, отвечает за отображение ошибок валидации и блокировку кнопок отправки.
Генерирует событие:
-:submit (при отправке формы)

**Basket** - отвечает за отображение корзины товаров. Наследуется от View. Содержит список товаров, общую стоимость и кнопку подтверждения покупки.

**Order** - отвечает за отображение формы заказа. Наследуется от Form. Содержит поле c адресом, переключатель способа оплаты и кнопку отправки.

**Contacts** - отвечает за отображение формы заказа. Наследуется от Form. Содержит поле c e-mail, поле с номером телефона и кнопку отправки.

**Success** - отвечает за отображение модального окна с подтверждением того, что заказ отправлен успешно. Наследуется от Component. Содержит поле с полной стоимость покупки.

## Модель данных
**AppData** - публикует события об изменения модели, отвечает за логику работы с данными и за их хранение (массив с каталогом товаров, текущий открытый товар, массив товаров в корзине и их стоимость, данный из формы заказа и их валидация).

## Сервисный класс WebLarekApi
Сервисный класс, наследуется от api, содержит методы getProductItem (позволяет получить информацию о товаре), getProductList (позволяет получить список товаров), orderProducts (позволяет отправить список товаров (заказ)).

## Presenter (список событий) 
- items:change - изменение массива товаров каталога
- preview:change - изменение товара в модальном окне
- basket:change - изменение списка товаров в корзине
- order:ready - поля в форме валидны
- formErrors:change - изменение ошибки валидации форм
- order:open - открытие модального окна с формой оформления заказа
- basket:open - открытие модального окна корзины
- card:select - открытие отдельного товара в модальном окне
- ^order\..*:change - изменение данных в форме с данными заказа (первый этап)
- ^contacts\..*:change - изменение полей ввода в форме с данными контактов (второй этап)
- contacts:submit - отправка формы контактных данных пользователя в модальном окне заказа
- order:submit - событие, генерируемое при отправке формы со способом платежа и адресом
- modal:open - открытие модального окна
- modal:close - закрытие модального окна

## Интерфейсы
```
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
```
