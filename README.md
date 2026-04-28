# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct

Содержит информацию о товаре.

Поля интерфейса:  
`id: string` - идентификатор.  
`description: string` - описание.  
`image: string` - адрес изображения.  
`title: string` - заголовок.  
`category: string` - категория.  
`price: number | null` - цена (может быть null).  

#### Интерфейс IBuyer

Содержит информацию о покупателе.

Поля интерфейса:  
`payment: TPayment` - способ оплаты.  
`email: string` - электронная почта.  
`phone: string` - номер телефона.  
`address: string` - адрес.  

### Модели данных

#### Products

Хранит массив всех товаров и товар, выбранный для подробного отображения.

Поля класса:  
`_productsArray: IProduct[]` - массив всех товаров.  
`_productSelected: IProduct` - товар для подробного отображения.  

Методы класса:  
`set productsArray(value: IProduct[]): void` - сеттер для сохранения массива товаров.  
`get productsArray(): IProduct[]` - геттер для получения массива товаров из модели.  
`getProductByID(id: string): IProduct` - получение одного товара по его id.  
`set productSelected(value: IProduct)` - сеттер для сохранения товара для подробного отображения.  
`get productSelected(): IProduct` - геттер для получения товара для подробного отображения.

#### Basket

Хранение товаров, которые пользователь выбрал для покупки;

Поля класса:  
`_products: IProduct[]` - хранит массив товаров, выбранных покупателем для покупки.

Методы класса:  
`get products(): IProduct[]` - геттер для получения массива товаров, которые находятся в корзине;  
`addProduct(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины;  
`deleteProduct(id: string): void` - удаление товара по идентификатору в параметре из массива корзины;  
`clearProducts(): void` - очистка корзины;  
`getTotalAmount(): number` - получение стоимости всех товаров в корзине;  
`getTotalCount(): number` - получение количества товаров в корзине;  
`isProductInProducts(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Buyer

Данные покупателя, которые тот должен указать при оформлении заказа.

Поля класса:  
`_data: IBuyer` - данные о покупателе.  

Методы класса:  
`updateInformation(data: Partial<IBuyer>): void` - сохранение данных в модели. Возможность сохранить только одно значение, например, только адрес или только телефон, не удалив при этом значения других полей, которые уже могут храниться в классе.  
`getInformation(): IBuyer` - получение всех данных покупателя.  
`clearInformation(): void` - очистка данных покупателя.  
`validateInformation(): IErrorsBayer` - валидация данных.

### Слой коммуникации

#### Интерфейс IProductsResponse

Хранит информацию ответа метода "/product/" API.

Поля интерфейса:  
`total: number` - количество товаров в ответе.  
`items: IProduct[]` - товары.

#### Интерфейс IOrder extends IBuyer

Наследуется от IBuyer. Содержит информацию о заказе.

Поля интерфейса:  
`total: number` - общая сумма заказа.  
`items: string[]` - идентификаторы товаров заказа.

#### Интерфейс IOrderResponse

Хранит информацию ответа метода "/order" API.

Поля интерфейса:  
`id: string` - идентификатор подтверждённого заказа.  
`total: number` - общая сумма заказа.

### Слой представлений

Все классы отвечающие за отображение являются дочерними от класса Component.

#### TemplateManager

Находит и предоставляет найденные шаблоны в виде HTML элементов.

Поля класса:  
`_basketTemplate: HTMLTemplateElement` - шаблон корзины.  
`_cardBasketTemplate: HTMLTemplateElement` - шаблон карточки товара в корзине.  
`_cardCatalogTemplate: HTMLTemplateElement` - шаблон карточки товара в каталоге.  
`_cardPreviewTemplate: HTMLTemplateElement` - шаблон карточки подробного просмотра товара.  
`_orderTemplate: HTMLTemplateElement` - шаблон первого шага оформления заказа.  
`_contactsTemplate: HTMLTemplateElement` - шаблон второго шага оформления заказа.  
`_successTemplate: HTMLTemplateElement` - шаблон информации об успешном заказе.  

Методы класса: представляют собой get аксессоры идентичные полям по наименованию, но без префикса "_". Например _basketTemplate => get basketTemplate(). Аксессоры возвращают клон соответствующего шаблона с типом HTMLElement.

#### CardBase

Родительский класс для карточки корзины и каталога.

Поля класса:  
`_titleElement: HTMLElement` - элемент с наименованием товара.  
`_priceElement: HTMLElement` - элемент с ценой товара.  

Методы класса:  
`set title(value: string)` - установка наименования товара.  
`get title(): string` - получение наименования товара для "alt" в "img".  
`set price(value: number)` - установка текста с ценой.  

#### CardCatalog

Карточка из общего списка товаров. Дочерний класс от CardBase.

Поля класса:  
`_categoryElement: HTMLElement` - элемент категории товара.  
`_imageElement: HTMLImageElement` - элемент изображения товара.  

Методы класса:  
`set category(value: string)` - установка отображения категории товара.  
`set image(value: string)` - установка изображения товара.  

#### CardBasket

Карточка товара в корзине. Дочерний класс от CardBase.

Поля класса:  
`_numberElement: HTMLElement` - элемент порядкового номера карточки товара в корзине.  
`_removeButton: HTMLButtonElement` - кнопка удаления товара из корзины.  

Методы класса:  
`number` - установка порядкового номера карточки товара в корзине.  

#### CardPreview

Подробная карточка товара при выборе из общего списка товаров. Дочерний класс от CardCatalog.

Поля класса:  
`_descriptionElement: HTMLElement` - элемент с описанием товара.  
`_buyButton: HTMLButtonElement` - кнопка добавления/удаления товара из корзины.  

Методы класса:  
`set description(value: string)` - установка описания товара.  
`set buttonStatus(status: CardPreviewButtonStatus)` - установка статуса кнопки.  

#### FormBasket 

Корзина товаров.

Поля класса:  
`_cardsList: HTMLElement` - корневой элемент списка товаров.  
`_totalAmountElement: HTMLElement` - элемент общей стоимости товаров в корзине.  
`_orderButton: HTMLButtonElement` - кнопка начала оформления заказа.  

Методы класса:  
`set cards(cards: HTMLElement[])` - установить список карточек товаров.  
`set totalAmount(value: Number)` - установить общую стоимость товаров в корзине.  

#### FormBase 

Родительская форма для заполнения заказа.

Поля класса:  
`_acceptButton: HTMLButtonElement` - кнопка принятия шага заказа.  
`_orderBlock: HTMLElement` - корневой элемент в котором находятся поля заполнения заказа.  
`_errors: HTMLElement` - элемент с ошибками валидации заказа.  

Методы класса:  
`clearFields(): void` - переопределяемый метод очистки полей формы.  
`set errors(): void` - установка текста ошибки и доступности кнопки.  

#### FormOrder 

Оформление заказа. Шаг 1. Выбор типа оплаты и заполнение адреса. Дочерний от FormBase.

Поля класса:  
`_paymentButtonOffline: HTMLButtonElement` - кнопка выбора типа оплаты - оффлайн.  
`_paymentButtonOnline: HTMLButtonElement` - кнопка выбора типа оплаты - онлайн.  
`_addressInputElement: HTMLInputElement` - элемент ввода адреса.  

Методы класса:  
`clearFields(): void` - переопределяемый метод очистки полей формы.  

#### FormContacts 

Оформление заказа. Шаг 2. Заполнение почты и телефона. Дочерний от FormBase.

Поля класса:  
`_emailInputElement: HTMLInputElement` - элемент ввода почты.  
`_phoneInputElement: HTMLInputElement` - элемент ввода телефона.  

Методы класса:  
`clearFields(): void` - переопределяемый метод очистки полей формы.  

#### FormFinal 

Форма успешного оформления заказа.

Поля класса:  
`_successDescription: HTMLElement` - элемент с текстом об успешном заказе.  
`_okButton: HTMLButtonElement` - кнопка что всё хорошо.  

Методы класса:  
`set successDescription(orderAmount: number)` - установка текста об успешном заказе.  

#### Gallery 

Список всех товаров.

Методы класса:  
`set catalog(values: HTMLElement[])` - установить список всех товаров.  

#### Header 

Заголовок с кнопкой корзины и счётчиком товаров в ней.

Поля класса:  
`_counterElement: HTMLElement` - элемент счётчика товаров в корзине.  
`_basketButton: HTMLButtonElement` - кнопка открытия корзины.  

Методы класса:  
`set counter(value: number)` - установка счётчика товаров в корзине.  

#### Modal 

Модальное окно.

Поля класса:  
`_content: HTMLElement` - корневой элемент контента модального окна.  
`_buttonClose: HTMLButtonElement` - кнопка закрытия модального окна.  

Методы класса:  
`openModal(content: HTMLElement)` - открытие модального окна.  
`closeModal()` - закрытие модального окна.  
`set content(value: HTMLElement)` - установка контента модального окна.  

#### interface IView

Интерфейс любого представления.

Поля интерфейса:  
`render(data?: Partial<T>): HTMLElement` - рендер.  

#### interface ICardBaseView extends IView

Интерфейс базового класса карточки товара.

Поля интерфейса:  
`title: string` - наименование товара.  
`price: number | null` - цена товара.  

#### interface ICardActions

Интерфейс события карточки. Передаётся из презентера.  

Поля интерфейса:  
`onClick(): void` - событие нажатия.

#### interface ICardBasketView extends ICardBaseView

Интерфейс карточки товара в корзине.  

Поля интерфейса:  
`number: number` - порядковый номер карточки товара в корзине.  

#### interface ICardCatalogBaseView extends ICardBaseView

Интерфейс карточки товара базовый.

Поля интерфейса:  
`category: string` - категория товара.  
`image: string` - изображение товара.  

#### interface ICardCatalogView extends ICardCatalogBaseView

Служебный интерфейс карточки товара из общего списка.

#### interface ICardPreviewView extends ICardCatalogBaseView

Интерфейс карточки предпросмотра товара.

Поля интерфейса:  
`description: string` - описание товара.  
`buttonStatus: CardPreviewButtonStatus` - кнопка действия в карточке.  

#### interface ICardsBasketView extends IView

Интерфейс корзины.

Поля интерфейса:  
`totalAmount: Number` - общая стоимость товаров в корзине.  
`removeCardInList(card: HTMLElement): void` - удалить карточку товара из корзины.  
`addCardInList(card: HTMLElement): void` - добавить карточку товара в корзину.  

#### interface IFormBaseView

Базовый интерфейс формы заказа.

Поля интерфейса:  
`validateInformation(): void` - валидация заказа.  

#### interface IFormContacts

Интерфейс второго шага оформления заказа.

Поля интерфейса:  
`error: string` - поле ошибки, если вдруг post запрос будет неуспешным.  

#### interface IFormFinalView extends IFormBaseView

Интерфейс формы успешного оформления заказа.

Поля интерфейса:  
`successDescription: number` - описание успешного оформления заказа.  

#### interface IGalleryView extends IView

Интерфейс общего списка товаров.

Поля интерфейса:  
`catalog: HTMLElement[]` - список карточек товаров.  

#### interface IHeaderView
  
Интерфейс заголовка.
  
Поля интерфейса:  
`counter: number` - счётчик товаров в корзине.

#### interface ITemplateManager

Интерфейс менеджера шаблонов.

Поля интерфейса:  
`basketTemplate: HTMLElement` - корзина.  
`cardBasketTemplate: HTMLElement` - карточка корзины.  
`cardCatalogTemplate: HTMLElement` - карточка каталога.  
`cardPreviewTemplate: HTMLElement` - карточка предпросмотра.  
`orderTemplate: HTMLElement` - форма заказа. Шаг 1.  
`contactsTemplate: HTMLElement` - форма заказа. Шаг 2.  
`successTemplate: HTMLElement` - форма успешного заказа.  

#### interface IModalView

Интерфейс модального окна.

Поля интерфейса:  
`content: HTMLElement` - контент модального окна.  
`openModal(content?: HTMLElement): void` - открытие модального окна.  
`closeModal(): void` - закрытие модального окна.  

### Презентер

#### Presenter

Класс презентера.

Поля класса:  
`_communicator: ICommunicator` - коммуникатор.  
`_events: IEvents` - брокер события.  
`_templateManager: ITemplateManager` - менеджер шаблонов.  
`_headerView: IHeaderView` - заголовок страницы с кнопкой корзины и счётчиком.  
`_modalView: IModalView` - модальное окно.  
`_galleryView: IGalleryView` - представление списка товаров.  
`_cardPreviewView: ICardPreviewView` - представление карточки превью товара.  
`_formBasketView: IFormBasketView` - форма корзины.  
`_formOrder: IFormBaseView` - форма первого шага оформления заказа.  
`_formContacts: IFormBaseView` - форма второго шага оформления заказа.  
`_formFinal: IFormFinalView` - форма успешного оформления заказа.  
`_basketModel: IBasketModel` - модель данных корзины.  
`_productsModel: IProductsModel` - модель списка продуктов.  
`_buyerModel: IBuyerModel` - модель заказа.  

Методы класса:  
`initListeners()` - инициализация событий.  
`getBasketCards(): void` - получить список карточек товаров.  
`showHeaderCounter(): void` - обновить счётчик товаров в корзине.  
`loadGalleryCards(): void` - загрузить список товаров.  
`showCardPreview(productModel: IProduct): void` - открыть карточку с подробной информацией о товаре (превью товара).  
`addProductSelected(): void` - добавить выбранный продукт в корзину.  
`removeProductSelected(): void` - удалить выбранный продукт из корзины.  
`setOrderError(data: IValidationResult)` - установить ошибку валидации на форме.  
`validateOrderOnAction(validationType: ValidationType, callback?: Function)` - валидация формы при определённом событии (обновление поля заказа, нажатие на кнопку "Далее" и т.д.).  
`validateOrder(fields: IBuyerKeys[])` - валидация конкретных полей заказа.  
`getValidateInformationOrder(data: Partial<IBuyer>): IErrorsBayer` - заполнение, а потом проверка заполнения обязательных полей при оформлении заказа.  
`stepOrder(): void` - выполнить первый шаг оформления заказа. Вызывается после выбора типа платежа и заполнения адреса.  
`finalOrder(): void` - оформить заказ. Вызывается когда все поля заполнены. Отправка post запроса на сервер.  
`closeModal(): void` - закрыть модальное окно.  