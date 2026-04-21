import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { Presenter } from "../presenter/Presenter";
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