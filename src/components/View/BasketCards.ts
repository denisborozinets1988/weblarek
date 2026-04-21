import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ICardActions } from "./CardBase";

export interface IBasketCardsView {
    totalAmount: Number;
}

export class BasketCards extends Component<IBasketCardsView> {
    private _cardsList: HTMLElement;
    private _totalAmountElement: HTMLElement;
    private _registerButton: HTMLButtonElement;

    constructor(
        container: HTMLElement, actions?: ICardActions
    ) {
        super(container);

        this._cardsList = ensureElement<HTMLElement>(".basket__list", container);
        this._totalAmountElement = ensureElement<HTMLElement>(".basket__price", container);
        this._registerButton = ensureElement<HTMLButtonElement>(".basket__button", container);

        if (actions?.onClick) {
            this._registerButton.addEventListener("click", actions.onClick);
        }
    }

    addCardInList(card: HTMLElement) {
        this._cardsList.append(card);
    }

    removeCardInList(card: HTMLElement) {
        this._cardsList.removeChild(card);
    }

    set totalAmount(value: Number) {
        this._totalAmountElement.textContent = `${value} синапсов`;
        if (!value) {
            this._registerButton.setAttribute("disabled", "true");
        }
    }
}