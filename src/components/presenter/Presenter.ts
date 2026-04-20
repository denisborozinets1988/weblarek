import { COMMUNICATOR } from "../../main";
import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IBasketModel } from "../models/Basket";
import { IBuyerModel } from "../models/Buyer";
import { IProductsModel } from "../models/Products";
import { BasketCards } from "../view/BasketCards";
import { CardBasket } from "../view/CardBasket";
import { CardCatalog, ICardCatalogView } from "../view/CardCatalog";
import { CardPreview } from "../view/CardPreview";
import { Gallery, IGalleryView } from "../view/Gallery";
import { IHeaderView } from "../view/Header";
import { IModalView } from "../view/Modal";

export class Presenter {
    constructor(
        private _events: IEvents,
        private _basketTemplate: HTMLTemplateElement,
        private _cardBasketTemplate: HTMLTemplateElement,
        private _cardCatalogTemplate: HTMLTemplateElement,
        private _cardPreviewTemplate: HTMLTemplateElement,
        private _headerView: IHeaderView,
        private _basketModel: IBasketModel,
        private _modalView: IModalView,
        private _galleryView: Gallery,
        private _productsModel: IProductsModel,
        private _buyerModel: IBuyerModel
    ) {
    }

    openBasket() {
        const basketCardsView = new BasketCards(cloneTemplate(this._basketTemplate));
        this._basketModel.products.forEach((element, index) => {
            const cardBasketView = new CardBasket(cloneTemplate(this._cardBasketTemplate));
            basketCardsView.addCardInList(cardBasketView.render({ number: index + 1, ...element }));
        });

        this._modalView.openModal(basketCardsView.render({
            totalAmount: this._basketModel.getTotalAmount()
        }));
    }

    closeModal() {
        this._modalView.closeModal();
        if (this._productsModel.productSelected) {
            this._productsModel.productSelected = null;
        }
    }

    showHeaderCounter() {
        this._headerView.counter = this._basketModel.getTotalCount();
    }

    loadGalleryCards() {
        this._events.on("catalog:changed", () => {
            const cardsView = this._productsModel.productsArray.map((productModel) => {
                const cardView = new CardCatalog(cloneTemplate(this._cardCatalogTemplate), {
                    onClick: () => {
                        this._events.emit("card:select", productModel);
                    }
                });

                this._events.on("card:select", (productModelEvent: IProduct) => {
                    if (productModelEvent.id === productModel.id) {
                        this.showCardPreview(productModelEvent);
                    }
                });

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

        COMMUNICATOR
            .getProducts()
            .then((res) => {
                this._productsModel.productsArray = res;
                this._events.emit("catalog:changed");
            })
            .catch((e) => {
                console.error(e);
            });
    }

    showCardPreview(productModel: IProduct) {
        this._productsModel.productSelected = productModel;
        const cardPreview = new CardPreview(cloneTemplate(this._cardPreviewTemplate));
        const { title, image, price, id, ...rest } = productModel;

        this._modalView.openModal(cardPreview.render({
            /* Порядок важен для <img alt>. Сначала title, потом image. */
            title: title,
            image: image,
            price: price,
            buttonDisabled: price === null || this._basketModel.isProductInProducts(id),
            ...rest
        }));
    }

    addProduct() {
        const productSelected = this._productsModel.productSelected;
        //Проверю также price для безопасности, ведь недоступность кнопки можно снять в интерфейсе.
        if (productSelected && productSelected.price && !this._basketModel.isProductInProducts(productSelected.id)) {
            this._basketModel.addProduct(productSelected);
            this.showHeaderCounter();
        }
    }
}