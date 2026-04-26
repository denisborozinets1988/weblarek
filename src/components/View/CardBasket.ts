import { ensureElement } from "../../utils/utils";
import { CardBase, ICardActions, ICardBaseView } from "./CardBase";

export interface ICardBasketView extends ICardBaseView<ICardBasketView> {
    number: number;
}

/**
 * Карточка товара в корзине.
 */
export class CardBasket extends CardBase<ICardBasketView> {
    private _numberElement: HTMLElement;
    private _removeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this._numberElement = ensureElement<HTMLElement>(".basket__item-index", container);
        this._removeButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

        if (actions?.onClick) {
            this._removeButton.addEventListener("click", actions.onClick);
        }
    }

    /**
     * Порядковый номер товара в корзине.
     */
    set number(value: number) {
        this._numberElement.textContent = String(value);
    }
}