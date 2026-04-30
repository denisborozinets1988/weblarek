import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { CardBase, ICardActions, ICardBaseView } from "./CardBase";

export interface ICardCatalogBaseView<T> extends ICardBaseView<T> {
    category: string;
    image: string;
}

export interface ICardCatalogView extends ICardCatalogBaseView<ICardCatalogView> { }

type CategoryKey = keyof typeof categoryMap;

/**
 * Карточка из общего списка товаров.
 */
export class CardCatalog extends CardBase<ICardCatalogView> {
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

    /**
     * Категория товара.
     */
    set category(value: string) {
        this._categoryElement.textContent = value;

        for (const key in categoryMap) {
            this._categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        }
    }

    /**
     * Изображение товара.
     */
    set image(value: string) {
        this.setImage(this._imageElement, CDN_URL + value.replace(".svg", ".png"), this._titleElement.textContent);
    }
}