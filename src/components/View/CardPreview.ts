import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
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

export class CardPreview extends CardCatalog {
    private _descriptionElement: HTMLElement;
    private _buyButton: HTMLButtonElement;
    private _eventAdd: EventListener;
    private _eventRemove: EventListener;

    constructor(container: HTMLElement) {
        super(container);

        this._descriptionElement = ensureElement<HTMLElement>(".card__text", container);
        this._buyButton = ensureElement<HTMLButtonElement>(".card__button", container);

        this._eventAdd = () => {
            PRESENTER.addProductSelected();
            PRESENTER.closeModal();
        };
        this._eventRemove = () => {
            PRESENTER.removeProductSelected();
            PRESENTER.closeModal();
        }
    }

    set description(value: string) {
        this._descriptionElement.textContent = value;
    }

    set buttonStatus(status: CardPreviewButtonStatus) {
        switch (status) {
            case CardPreviewButtonStatus.CanAdd:
                this._buyButton.textContent = "Купить";
                this._buyButton.addEventListener("click", this._eventAdd);
                break;
            case CardPreviewButtonStatus.CanRemove:
                this._buyButton.textContent = "Удалить из корзины";
                this._buyButton.addEventListener("click", this._eventRemove);
                break;
            case CardPreviewButtonStatus.CanNot:
                this._buyButton.textContent = "Недоступно";
                this._buyButton.setAttribute("disabled", "true");
                break;
        }
    }
}