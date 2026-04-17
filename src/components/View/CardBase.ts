import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICardBaseView {
    title: string;
    price: number | null;
}

export interface ICardActions {
    onClick(): void;
}

export abstract class CardBase<T> extends Component<T> {
    private _titleElement: HTMLElement;
    private _priceElement: HTMLElement;
    constructor(
        container: HTMLElement
    ) {
        super(container);

        this._titleElement = ensureElement<HTMLElement>(".card__title", container);
        this._priceElement = ensureElement<HTMLElement>(".card__price", container);
    }


    set title(value: string) {
        this._titleElement.textContent = value;
    }

    set price(value: number) {
        this._priceElement.textContent = String(value);
    }
}