import { IBasketModel } from "../models/Basket";
import { IHeaderView } from "../view/Header";
import { IModalView } from "../view/Modal";

export class Presenter {
    constructor(
        private _headerView: IHeaderView,
        private _basketModel: IBasketModel,
        private _modalView: IModalView
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
}