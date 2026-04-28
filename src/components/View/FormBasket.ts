import { ensureElement } from "../../utils/utils";
import { Component, IView } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IFormBasketView extends IView<IFormBasketView> {
    totalAmount: Number;
    cards: HTMLElement[];
}

/**
 * Корзина товаров.
 */
export class FormBasket extends Component<IFormBasketView> {
    private _cardsList: HTMLElement;
    private _totalAmountElement: HTMLElement;
    private _orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._cardsList = ensureElement<HTMLElement>(".basket__list", container);
        this._totalAmountElement = ensureElement<HTMLElement>(".basket__price", container);
        this._orderButton = ensureElement<HTMLButtonElement>(".basket__button", container);
        this._orderButton.addEventListener("click", () => { events.emit("basket-button:click") });
    }

    /**
     * Добавить карточку товара в список карточек товаров.
     * @param card карточка товара.
     */
    set cards(cards: HTMLElement[]) {
        this._cardsList.innerHTML = "";
        this._cardsList.append(...cards);
    }

    /**
     * Общая стоимость.
     */
    set totalAmount(value: Number) {
        this._totalAmountElement.textContent = `${value} синапсов`;
        value ? this._orderButton.removeAttribute("disabled") : this._orderButton.setAttribute("disabled", "true");
    }
}