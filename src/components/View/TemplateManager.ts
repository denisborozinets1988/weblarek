import { cloneTemplate, ensureElementByID } from "../../utils/utils";

export interface ITemplateManager {
    basketTemplate: HTMLElement;
    cardBasketTemplate: HTMLElement;
    cardCatalogTemplate: HTMLElement;
    cardPreviewTemplate: HTMLElement;
    orderTemplate: HTMLElement;
    contactsTemplate: HTMLElement;
    successTemplate: HTMLElement;
}

/**
 * Менеджер шаблонов.
 */
export class TemplateManager implements ITemplateManager {
    private _basketTemplate: HTMLTemplateElement;
    private _cardBasketTemplate: HTMLTemplateElement;
    private _cardCatalogTemplate: HTMLTemplateElement;
    private _cardPreviewTemplate: HTMLTemplateElement;
    private _orderTemplate: HTMLTemplateElement;
    private _contactsTemplate: HTMLTemplateElement;
    private _successTemplate: HTMLTemplateElement;

    constructor() {
        this._cardCatalogTemplate = ensureElementByID("card-catalog");
        this._cardPreviewTemplate = ensureElementByID("card-preview");
        this._cardBasketTemplate = ensureElementByID("card-basket");
        this._basketTemplate = ensureElementByID("basket");
        this._orderTemplate = ensureElementByID("order");
        this._contactsTemplate = ensureElementByID("contacts");
        this._successTemplate = ensureElementByID("success");
    }

    /**
     * Получить по шаблону корзину. Контент для модального окна.
     */
    get basketTemplate() {
        return cloneTemplate(this._basketTemplate);
    }

    /**
     * Получить по шаблону карточку товара в корзине. Это элемент в списке товраов basketTemplate.
     */
    get cardBasketTemplate() {
        return cloneTemplate(this._cardBasketTemplate);
    }

    /**
     * Получить по шаблону карточку товара в общем списке товаров. Это элемент в списке товраов Gallery.
     */
    get cardCatalogTemplate() {
        return cloneTemplate(this._cardCatalogTemplate);
    }

    /**
     * Получить по шаблону карточку товара с подробной информацией. Вызывается при нажатии на товар из Gallery.
     */
    get cardPreviewTemplate() {
        return cloneTemplate(this._cardPreviewTemplate);
    }

    /**
     * Получить по шаблону первый шаг оформления заказа - заполнение типа оплаты и адреса. Это контент для модалки.
     */
    get orderTemplate() {
        return cloneTemplate(this._orderTemplate);
    }

    /**
     * Получить по шаблону второй (он же финальный) шаг оформления заказа - заполнение почты и телефона. Это контент для модалки.
     */
    get contactsTemplate() {
        return cloneTemplate(this._contactsTemplate);
    }

    /**
     * Получить по шаблону блок с информацией об успешной оплате заказа. Это контент для модалки.
     */
    get successTemplate() {
        return cloneTemplate(this._successTemplate);
    }
}