import { ensureElement } from "../../utils/utils";
import { Component, IView } from "../base/Component";
import { ICardActions } from "./CardBase";

export interface ICardsBasketView extends IView<ICardsBasketView> {
    totalAmount: Number;
    removeCardInList(card: HTMLElement): void;
    addCardInList(card: HTMLElement): void;
}

/**
 * Корзина товаров.
 */
export class CardsBasket extends Component<ICardsBasketView> {
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

    /**
     * Добавить карточку товара в список карточек товаров.
     * @param card карточка товара.
     */
    addCardInList(card: HTMLElement) {
        this._cardsList.append(card);
    }

    /**
     * Удалить карточку товара из списка карточек товаров.
     * @param card карточка товара.
     */
    removeCardInList(card: HTMLElement) {
        this._cardsList.removeChild(card);
    }

    /**
     * Общая стоимость.
     */
    set totalAmount(value: Number) {
        this._totalAmountElement.textContent = `${value} синапсов`;
        if (!value) {
            this._registerButton.setAttribute("disabled", "true");
        }
    }
}