import { ensureElement } from "../../utils/utils";
import { CardCatalog, ICardCatalogView } from "./CardCatalog";

export interface ICardPreviewView extends ICardCatalogView {
    description: string;
    buttonDisabled: boolean;
}

export class CardPreview extends CardCatalog<ICardPreviewView> {
    private _descriptionElement: HTMLElement;
    private _buyButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._descriptionElement = ensureElement<HTMLElement>(".card__text", container);
        this._buyButton = ensureElement<HTMLButtonElement>(".card__button", container);
    }

    set description(value: string) {
        this._descriptionElement.textContent = value;
    }

    set buttonDisabled(unavailable: boolean) {
        if (unavailable) {
            this._buyButton.textContent = "Недоступно";
            this._buyButton.setAttribute("disabled", "true");
        }
    }

    get content() {
        return this.container;
    }
}