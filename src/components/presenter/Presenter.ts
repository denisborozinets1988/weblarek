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
import { CardsBasket, ICardsBasketView } from "../view/CardsBasket";
import { CardBasket, ICardBasketView } from "../view/CardBasket";
import { CardCatalog, ICardCatalogView } from "../view/CardCatalog";
import { CardPreview, ICardPreviewView } from "../view/CardPreview";
import { IComponent, IView } from "../base/Component";
import { FormContacts } from "../view/FormContacts";
import { FormFinal } from "../view/FormFinal";
import { FormOrder } from "../view/FormOrder";

export class Presenter {
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

    openBasket() {
        const cardsBasketView = new CardsBasket(this._templateManager.basketTemplate,
            {
                onClick: () => {
                    if (!this._basketModel.getTotalAmount()) {
                        return;
                    }
                    const form = new FormOrder(this._templateManager.orderTemplate) as IComponent;
                    this._modalView.content = form.content;
                }
            }
        ) as ICardsBasketView;

        this._basketModel.products.forEach((element, index) => {
            const cardBasketView = new CardBasket(this._templateManager.cardBasketTemplate, {
                onClick: () => {
                    this._basketModel.deleteProduct(element.id);
                    cardsBasketView.removeCardInList(cardBasketView.content);
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
                console.error(e);
            });
    }

    showCardPreview(productModel: IProduct) {
        this._productsModel.productSelected = productModel;
        const cardPreview = new CardPreview(this._templateManager.cardPreviewTemplate) as ICardPreviewView;
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
        if (productSelected && productSelected.price && !this._basketModel.isProductInProducts(productSelected.id)) {
            this._basketModel.addProduct(productSelected);
            this.showHeaderCounter();
        }
    }

    stepOrder(data: Partial<IBuyer>) {
        this._buyerModel.updateInformation(data);
        const form = new FormContacts(this._templateManager.contactsTemplate) as IComponent;
        this._modalView.content = form.content;
    }

    finalOrder(data: Partial<IBuyer>) {
        this._buyerModel.updateInformation(data);
        const validationResult = this._buyerModel.validateInformation();
        if (Object.keys(validationResult).length) {
            console.log(`Ой! Что-то пошло не так! Error: ${validationResult}`);
            return;
        }

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
                this._basketModel.clearProducts();
                this.showHeaderCounter();
            })
            .catch((e) => {
                console.log(`Ой! Что-то пошло не так! Error: ${e}`);
                this.closeModal();
            });
    }
}