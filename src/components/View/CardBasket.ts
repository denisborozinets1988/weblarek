import { ensureElement } from "../../utils/utils";
import { CardBase, ICardBaseView } from "./CardBase";

export interface ICardBasketView extends ICardBaseView {
    number: number;
}

export class CardBasket extends CardBase<ICardBasketView> {
    private _numberElement: HTMLElement;
    private _removeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._numberElement = ensureElement<HTMLElement>(".basket__item-index", container);
        this._removeButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);
    }

    set number(value: number) {
        this._numberElement.textContent = String(value);
    }
}