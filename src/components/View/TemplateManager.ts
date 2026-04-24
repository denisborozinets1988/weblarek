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

    get basketTemplate() {
        return cloneTemplate(this._basketTemplate);
    }

    get cardBasketTemplate() {
        return cloneTemplate(this._cardBasketTemplate);
    }

    get cardCatalogTemplate() {
        return cloneTemplate(this._cardCatalogTemplate);
    }

    get cardPreviewTemplate() {
        return cloneTemplate(this._cardPreviewTemplate);
    }

    get orderTemplate() {
        return cloneTemplate(this._orderTemplate);
    }

    get contactsTemplate() {
        return cloneTemplate(this._contactsTemplate);
    }

    get successTemplate() {
        return cloneTemplate(this._successTemplate);
    }
}