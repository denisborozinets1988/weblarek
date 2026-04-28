import { ICommunicator } from "../base/Communicator";
import { IBuyer, IOrder, IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { IBasketModel } from "../models/Basket";
import { IBuyerModel } from "../models/Buyer";
import { IProductsModel } from "../models/Products";
import { IHeaderView } from "../view/Header";
import { IModalView } from "../view/Modal";
import { ITemplateManager } from "../view/TemplateManager";
import { IGalleryView } from "../view/Gallery";
import { IFormBasketView } from "../view/FormBasket";
import { CardBasket, ICardBasketView } from "../view/CardBasket";
import { CardCatalog, ICardCatalogView } from "../view/CardCatalog";
import { CardPreviewButtonStatus, ICardPreviewView } from "../view/CardPreview";
import { IFormFinalView } from "../view/FormFinal";
import { IFormBaseView, IValidationResult } from "../view/FormBase";

type IBuyerKeys = keyof IBuyer;

export enum ValidationType {
    PaymentAddress,
    EmailPhone,
    All
}

/**
 * Презентер.
 */
export class Presenter {
    constructor(
        private _communicator: ICommunicator,
        private _events: IEvents,
        private _templateManager: ITemplateManager,

        private _headerView: IHeaderView,
        private _modalView: IModalView,
        private _galleryView: IGalleryView,
        private _cardPreviewView: ICardPreviewView,

        private _formBasketView: IFormBasketView,
        private _formOrder: IFormBaseView,
        private _formContacts: IFormBaseView,
        private _formFinal: IFormFinalView,

        private _basketModel: IBasketModel,
        private _productsModel: IProductsModel,
        private _buyerModel: IBuyerModel
    ) {
        /* Корзина. */
        this._events.on("basket:open",
            () => {
                this._modalView.openModal(this._formBasketView.render(
                    {
                        totalAmount: this._basketModel.getTotalAmount()
                    }
                ));
            });
        this._events.on("basket:changed",
            () => {
                this._modalView.content = this._formBasketView.render({
                    cards: this.getBasketCards(),
                    totalAmount: this._basketModel.getTotalAmount()
                });
                this.showHeaderCounter();
            });
        this._events.on("basket-button:click",
            () => {
                if (!this._basketModel.getTotalAmount()) {
                    return;
                }
                this._modalView.content = this._formOrder.render();
                this.validateOrderOnAction(ValidationType.PaymentAddress);
            });
        this._events.on("basket-card:delete",
            (element: IProduct) => { this._basketModel.deleteProduct(element.id); });

        /* Изменение полей заказа. */
        this._events.on("payment:changed",
            (data: Partial<IBuyer>) => {
                this._buyerModel.updateInformation(data);
                this.validateOrderOnAction(ValidationType.PaymentAddress);
            });
        this._events.on("address:changed",
            (data: Partial<IBuyer>) => {
                this._buyerModel.updateInformation(data);
                this.validateOrderOnAction(ValidationType.PaymentAddress);
            });
        this._events.on("email:changed",
            (data: Partial<IBuyer>) => {
                this._buyerModel.updateInformation(data);
                this.validateOrderOnAction(ValidationType.EmailPhone);
            });
        this._events.on("phone:changed",
            (data: Partial<IBuyer>) => {
                this._buyerModel.updateInformation(data);
                this.validateOrderOnAction(ValidationType.EmailPhone);
            });

        /* Валидация и кнопки заказа. */
        this._events.on("order-validation:false",
            (data: IValidationResult) => { this.setOrderError(data); })
        this._events.on("order-validation:true",
            (data: IValidationResult) => { this.setOrderError(data); });
        this._events.on("order:accept",
            () => { this.validateOrderOnAction(ValidationType.PaymentAddress, () => this._events.emit("order:accepted")) });
        this._events.on("order:accepted",
            () => {
                this.stepOrder();
                this.validateOrderOnAction(ValidationType.EmailPhone);
            });
        this._events.on("order:submit",
            () => { this.validateOrderOnAction(ValidationType.All, () => this.finalOrder()) });
        this._events.on("order:clear",
            () => {
                this._formOrder.clearFields();
                this._formContacts.clearFields();
            });
        this._events.on("order:success",
            (data) => {
                this._modalView.content = this._formFinal.render(data);
            });

        /* Модальное окно */
        this._events.on("modal:close",
            () => { this.closeModal() });

        /* Карточка превью товара */
        this._events.on("preview-button:click",
            () => {
                const productSelected = this._productsModel.productSelected;
                if (!productSelected) {
                    return;
                }

                this._basketModel.isProductInProducts(productSelected.id) ?
                    this.removeProductSelected() : this.addProductSelected();

                this._events.emit("modal:close");
            });
    }

    //#region КОРЗИНА.

    getBasketCards() {
        const cards: HTMLElement[] = [];
        this._basketModel.products.forEach((element, index) => {
            const cardBasketView = new CardBasket(this._templateManager.cardBasketTemplate,
                { onClick: () => { this._events.emit("basket-card:delete", element); } }) as ICardBasketView;
            cards.push(cardBasketView.render({ number: index + 1, ...element }));
        });

        return cards;
    }

    /**
     * Обновить счётчик товаров в корзине.
     */
    showHeaderCounter() {
        this._headerView.counter = this._basketModel.getTotalCount();
    }

    //#endregion

    //#region СПИСОК ТОВАРОВ.

    /**
     * Загрузить список товаров.
     */
    loadGalleryCards() {
        this._events.on("catalog:changed", () => {
            const cardsView = this._productsModel.productsArray.map((productModel) => {
                const cardView = new CardCatalog(this._templateManager.cardCatalogTemplate, {
                    onClick: () => {
                        this.showCardPreview(productModel);
                    }
                }) as ICardCatalogView;

                const { title, image, ...rest } = productModel;
                return cardView.render(
                    /* Порядок важен для <img alt>. Сначала title, потом image. */
                    {
                        title: title,
                        image: image,
                        ...rest
                    }
                );
            });
            this._galleryView.render({ catalog: cardsView });
        });

        this._communicator
            .getProducts()
            .then((res) => {
                this._productsModel.productsArray = res;
            })
            .catch((e) => {
                console.error(`Произошла ошибка при загрузке списка товаров: ${e}`);
            });
    }

    //#endregion

    //#region ПРЕВЬЮ ТОВАРА.

    /**
     * Открыть карточку с подробной информацией о товаре (превью товара).
     * @param productModel модель с данными о товаре.
     */
    showCardPreview(productModel: IProduct) {
        this._productsModel.productSelected = productModel;
        const { title, image, price, id, ...rest } = productModel;

        let buttonStatus: CardPreviewButtonStatus = price === null ?
            CardPreviewButtonStatus.CanNot : this._basketModel.isProductInProducts(id) ?
                CardPreviewButtonStatus.CanRemove : CardPreviewButtonStatus.CanAdd;

        this._modalView.openModal(this._cardPreviewView.render({
            /* Порядок важен для <img alt>. Сначала title, потом image. */
            title: title,
            image: image,
            price: price,
            buttonStatus: buttonStatus,
            ...rest
        }));
    }

    /**
     * Добавить выбранный продукт в корзину.
     */
    addProductSelected() {
        const productSelected = this._productsModel.productSelected;
        if (productSelected && productSelected.price && !this._basketModel.isProductInProducts(productSelected.id)) {
            this._basketModel.addProduct(productSelected);
        }
    }

    /**
     * Удалить выбранный продукт из корзины.
     */
    removeProductSelected() {
        const productSelected = this._productsModel.productSelected;
        if (productSelected && productSelected.price && this._basketModel.isProductInProducts(productSelected.id)) {
            this._basketModel.deleteProduct(productSelected.id);
        }
    }

    //#endregion

    //#region ЗАКАЗ

    setOrderError(data: IValidationResult) {
        switch (data.validationType) {
            case ValidationType.PaymentAddress:
                this._formOrder.errors = data.validationResult;
                break;
            case ValidationType.EmailPhone:
                this._formContacts.errors = data.validationResult;
                break;
            default:
        }
    }

    validateOrder(fields: IBuyerKeys[]) {
        const resultValidation = this._buyerModel.validateInformation();
        const errors: string[] = [];

        fields.forEach((field) => {
            if (resultValidation[field] !== undefined) {
                errors.push(resultValidation[field]);
            }

        });

        return errors.length ? errors.join(" ") : "";
    }

    validateOrderOnAction(validationType: ValidationType, callback?: Function) {
        let fields: string[] = [];
        switch (validationType) {
            case ValidationType.PaymentAddress:
                fields = ["payment", "address"];
                break;
            case ValidationType.EmailPhone:
                fields = ["email", "phone"];
                break;
            case ValidationType.All:
                fields = ["payment", "address", "email", "phone"];
                break;
        }

        const validationResult = this.validateOrder(fields as IBuyerKeys[]);
        const validationAnswer = {
            validationResult: validationResult,
            validationType: validationType
        } as IValidationResult;

        if (validationResult === "") {
            if (callback) {
                callback();
            } else {
                this._events.emit("order-validation:true", validationAnswer);
            }
        } else {
            this._events.emit("order-validation:false", validationAnswer);
        }
    }

    /**
     * Выполнить первый шаг оформления заказа. Вызывается после выбора типа платежа и заполнения адреса.
     */
    stepOrder() {
        this._modalView.content = this._formContacts.render();
    }

    /**
     * Оформить заказ. Вызывается когда все поля заполнены. Отправка post запроса на сервер.
     */
    finalOrder() {
        const validateInformation = this._buyerModel.validateInformation();
        if (Object.keys(validateInformation).length) {
            this._formContacts.errors = "Не заполнены обязательные поля!";
            return;
        }

        /* ТЕСТ. Попытка купить недоступный товар. */
        //this._basketModel.addProduct(this._productsModel.productsArray[2]);

        const dataOrder: IOrder = {
            ...this._buyerModel.getInformation(),
            total: this._basketModel.getTotalAmount(),
            items: this._basketModel.products.map((x) => x.id),
        };

        this._communicator
            .postOrder(dataOrder)
            .then((res) => {
                this._buyerModel.clearInformation();
                this._basketModel.clearProducts();
                this._events.emit("order:success", { successDescription: res.total });
            })
            .catch((e) => {
                if (this._formContacts) {
                    this._formContacts.errors = `Ой! Что-то пошло не так! Error: ${e}`;
                }
            });
    }

    //#endregion

    //#region МОДАЛКА

    /**
     * Закрыть модалку.
     */
    closeModal() {
        this._modalView.closeModal();
        if (this._productsModel.productSelected) {
            this._productsModel.productSelected = null;
        }
    }

    //#endregion
}