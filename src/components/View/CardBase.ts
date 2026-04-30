
import { ensureElement } from "../../utils/utils";
import { Component, IView } from "../base/Component";

export interface ICardBaseView<T> extends IView<T> {
    title: string;
    price: number | null;
}

export interface ICardActions {
    onClick(): void;
}

/**
 * Родительский класс для карточки корзины и каталога.
 */
export abstract class CardBase<T> extends Component<T> {
    protected _titleElement: HTMLElement;
    private _priceElement: HTMLElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);

        this._titleElement = ensureElement<HTMLElement>(".card__title", container);
        this._priceElement = ensureElement<HTMLElement>(".card__price", container);
    }

    /**
     * Название товара.
     */
    set title(value: string) {
        this._titleElement.textContent = value;
    }

    /**
     * Цена товара.
     */
    set price(value: number) {
        this._priceElement.textContent = String(value ? `${value} синапсов` : "Бесценно");
    }
}