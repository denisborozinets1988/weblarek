import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardCatalog, ICardCatalogBaseView } from "./CardCatalog";

export interface ICardPreviewView extends ICardCatalogBaseView<ICardPreviewView> {
    description: string;
    buttonStatus: CardPreviewButtonStatus;
}

export enum CardPreviewButtonStatus {
    CanAdd,
    CanRemove,
    CanNot
}

/**
 * Подробная карточка товара при выборе из общего списка товаров.
 */
export class CardPreview extends CardCatalog {
    private _descriptionElement: HTMLElement;
    private _buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, event: IEvents) {
        super(container);

        this._descriptionElement = ensureElement<HTMLElement>(".card__text", container);
        this._buyButton = ensureElement<HTMLButtonElement>(".card__button", container);
        this._buyButton.addEventListener("click", () => { event.emit("preview:click") });
    }

    /**
     * Описание товара.
     */
    set description(value: string) {
        this._descriptionElement.textContent = value;
    }

    /**
     * Модификация кнопки в зависимости от условий.
     */
    set buttonStatus(status: CardPreviewButtonStatus) {
        switch (status) {
            case CardPreviewButtonStatus.CanAdd:
                this._buyButton.textContent = "Купить";
                this._buyButton.removeAttribute("disabled");
                break;
            case CardPreviewButtonStatus.CanRemove:
                this._buyButton.textContent = "Удалить из корзины";
                this._buyButton.removeAttribute("disabled");
                break;
            case CardPreviewButtonStatus.CanNot:
                this._buyButton.textContent = "Недоступно";
                this._buyButton.setAttribute("disabled", "true");
                break;
        }
    }
}