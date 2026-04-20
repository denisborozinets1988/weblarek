import { PRESENTER } from "../../main";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardBase, ICardActions, ICardBaseView } from "./CardBase";

export interface ICardCatalogView extends ICardBaseView {
    category: string;
    image: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog<T> extends CardBase<T> {
    protected _categoryElement: HTMLElement;
    protected _imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._categoryElement = ensureElement<HTMLElement>(".card__category", container);
        this._imageElement = ensureElement<HTMLImageElement>(".card__image", container);

        if (actions?.onClick) {
            this.container.addEventListener("click", actions.onClick);
        }
    }

    set category(value: string) {
        this._categoryElement.textContent = value;

        for (const key in categoryMap) {
            this._categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        }
    }

    set image(value: string) {
        this.setImage(this._imageElement, CDN_URL + value.replace(".svg", ".png"), this.title);
    }
}