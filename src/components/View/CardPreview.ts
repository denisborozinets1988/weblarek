import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { CardCatalog, ICardCatalogBaseView } from "./CardCatalog";

export interface ICardPreviewView extends ICardCatalogBaseView<ICardPreviewView> {
    description: string;
    buttonDisabled: boolean;
}

export class CardPreview extends CardCatalog {
    private _descriptionElement: HTMLElement;
    private _buyButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._descriptionElement = ensureElement<HTMLElement>(".card__text", container);
        this._buyButton = ensureElement<HTMLButtonElement>(".card__button", container);
        this._buyButton.addEventListener("click", () => {
            PRESENTER.addProduct();
            this.buttonDisabled = true;
        });
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
}