import { COMMUNICATOR } from "../../main";
import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IBasketModel } from "../models/Basket";
import { IProductsModel } from "../models/Products";
import { CardCatalog, ICardCatalogView } from "../view/CardCatalog";
import { Gallery, IGalleryView } from "../view/Gallery";
import { IHeaderView } from "../view/Header";
import { IModalView } from "../view/Modal";

export class Presenter {
    constructor(
        private _events: IEvents,
        private _cardBasketTemplate: HTMLTemplateElement,
        private _cardCatalogTemplate: HTMLTemplateElement,
        private _cardPreviewTemplate: HTMLTemplateElement,
        private _headerView: IHeaderView,
        private _basketModel: IBasketModel,
        private _modalView: IModalView,
        private _galleryView: Gallery,
        private _productsModel: IProductsModel
    ) {
    }

    openBasket() {
        this._modalView.openModal();
    }

    closeModal() {
        this._modalView.closeModal();
    }

    showHeaderCounter() {
        this._headerView.counter = this._basketModel.getTotalCount();
    }

    loadGalleryCards() {
        this._events.on("catalog:changed", () => {
            const cardsView = this._productsModel.productsArray.map((productModel) => {
                const cardView = new CardCatalog(cloneTemplate(this._cardCatalogTemplate), { onClick: () => this._events.emit("card:select", productModel) });
                return cardView.render(productModel);
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
}