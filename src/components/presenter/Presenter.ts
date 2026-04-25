import { ICommunicator } from "../base/Communicator";
import { IBuyer, IErrorsBayer, IOrder, IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { IBasketModel } from "../models/Basket";
import { IBuyerModel } from "../models/Buyer";
import { IProductsModel } from "../models/Products";
import { IHeaderView } from "../view/Header";
import { IModalView } from "../view/Modal";
import { ITemplateManager } from "../view/TemplateManager";
import { IGalleryView } from "../view/Gallery";
import { CardsBasket, ICardsBasketView } from "../view/CardsBasket";
import { CardBasket, ICardBasketView } from "../view/CardBasket";
import { CardCatalog, ICardCatalogView } from "../view/CardCatalog";
import { CardPreview, CardPreviewButtonStatus, ICardPreviewView } from "../view/CardPreview";
import { IView } from "../base/Component";
import { FormContacts, IFormContacts } from "../view/FormContacts";
import { FormFinal } from "../view/FormFinal";
import { FormOrder } from "../view/FormOrder";

/**
 * Презентер.
 */
export class Presenter {
    private _formOrder?: IFormContacts;

    constructor(
        private _communicator: ICommunicator,
        private _events: IEvents,
        private _templateManager: ITemplateManager,
        private _headerView: IHeaderView,
        private _basketModel: IBasketModel,
        private _modalView: IModalView,
        private _galleryView: IGalleryView,
        private _productsModel: IProductsModel,
        private _buyerModel: IBuyerModel
    ) {
    }

    //#region КОРЗИНА.

    /**
     * Открыть корзину.
     */
    openBasket() {
        const cardsBasketView = new CardsBasket(this._templateManager.basketTemplate,
            {
                onClick: () => {
                    if (!this._basketModel.getTotalAmount()) {
                        return;
                    }
                    const form = new FormOrder(this._templateManager.orderTemplate) as IView<FormOrder>;
                    this._modalView.content = form.render();
                }
            }
        ) as ICardsBasketView;

        this._basketModel.products.forEach((element, index) => {
            const cardBasketView = new CardBasket(this._templateManager.cardBasketTemplate, {
                onClick: () => {
                    this._basketModel.deleteProduct(element.id);
                    cardsBasketView.removeCardInList(cardBasketView.render());
                    cardsBasketView.totalAmount = this._basketModel.getTotalAmount();
                    this._headerView.counter = this._basketModel.getTotalCount();
                }
            }) as ICardBasketView;

            cardsBasketView.addCardInList(cardBasketView.render({ number: index + 1, ...element }));
        });

        this._modalView.openModal(cardsBasketView.render({
            totalAmount: this._basketModel.getTotalAmount()
        }));
    }

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
                this._events.emit("catalog:changed");
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
        const cardPreview = new CardPreview(this._templateManager.cardPreviewTemplate) as ICardPreviewView;
        const { title, image, price, id, ...rest } = productModel;

        let buttonStatus: CardPreviewButtonStatus = price === null ? CardPreviewButtonStatus.CanNot : this._basketModel.isProductInProducts(id) ? CardPreviewButtonStatus.CanRemove : CardPreviewButtonStatus.CanAdd;

        this._modalView.openModal(cardPreview.render({
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
            this.showHeaderCounter();
        }
    }

    /**
     * Удалить выбранный продукт из корзины.
     */
    removeProductSelected() {
        const productSelected = this._productsModel.productSelected;
        if (productSelected && productSelected.price && this._basketModel.isProductInProducts(productSelected.id)) {
            this._basketModel.deleteProduct(productSelected.id);
            this.showHeaderCounter();
        }
    }

    //#endregion

    //#region ЗАКАЗ

    /**
     * Заполнение, а потом проверка заполнения обязательных полей при оформлении заказа.
     * @param data - Partial поля типа IBuyer для проверки.
     * @returns объект типа IErrorsBayer, внутри которого находится информация о проблемных полях.
     */
    getValidateInformationOrder(data: Partial<IBuyer>): IErrorsBayer {
        this._buyerModel.updateInformation(data);
        return this._buyerModel.validateInformation();
    }

    /**
     * Выполнить первый шаг оформления заказа. Вызывается после выбора типа платежа и заполнения адреса.
     */
    stepOrder() {
        const form = new FormContacts(this._templateManager.contactsTemplate);
        this._formOrder = form as IFormContacts;
        const formView = form as IView<FormContacts>;
        this._modalView.content = formView.render();
    }

    /**
     * Оформить заказ. Вызывается когда все поля заполнены.
     */
    finalOrder() {
        const validateInformation = this._buyerModel.validateInformation();
        if (Object.keys(validateInformation).length) {
            console.log("Не заполнены обязательные поля!");
            return;
        }

        //ТЕСТ. Попытка купить недоступный товар.
        //this._basketModel.addProduct(this._productsModel.productsArray[2]);

        const dataOrder: IOrder = {
            ...this._buyerModel.getInformation(),
            total: this._basketModel.getTotalAmount(),
            items: this._basketModel.products.map((x) => x.id),
        };

        this._communicator
            .postOrder(dataOrder)
            .then((res) => {
                const formFinal = new FormFinal(this._templateManager.successTemplate) as IView<FormFinal>;
                this._modalView.content = formFinal.render({ successDescription: res.total });
                this._buyerModel.clearInformation();
                this._basketModel.clearProducts();
                this.showHeaderCounter();
            })
            .catch((e) => {
                if (this._formOrder) {
                    this._formOrder.error = `Ой! Что-то пошло не так! Error: ${e}`;
                }
            });
    }

    //#endregion

    //#region МОДАЛКА

    /**
     * Закрыть модальное окно.
     */
    closeModal() {
        this._modalView.closeModal();
        if (this._productsModel.productSelected) {
            this._productsModel.productSelected = null;
        }
    }

    //#endregion
}