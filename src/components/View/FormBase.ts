import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IFormBaseView {
    validateInformation(): void;
}

/**
 * Родительская форма для заполнения заказа.
 */
export abstract class FormBase<T> extends Component<T> {
    protected _acceptButton: HTMLButtonElement;
    protected _orderBlock: HTMLElement;
    protected _errors: HTMLElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);

        const modalActions = ensureElement<HTMLElement>(".modal__actions", container);
        this._orderBlock = ensureElement<HTMLElement>(".order", container);
        this._acceptButton = ensureElement<HTMLButtonElement>(".button", modalActions);
        this._errors = ensureElement<HTMLElement>(".form__errors", modalActions);
    }

    /**
     * Установка доступности кнопки принятия.
     */
    protected buttonAccessibility() {
        this.validateForm() ? this._acceptButton.removeAttribute("disabled") : this._acceptButton.setAttribute("disabled", "true");
    }

    /**
     * Переопределяемая валидация шага заполнения заказа.
     * @returns факт наличия ошибок. true если ошибок нет, иначе false.
     */
    protected validateForm(): boolean {
        return false;
    }
}