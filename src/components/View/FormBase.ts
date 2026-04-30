import { ensureElement } from "../../utils/utils";
import { Component, IView } from "../base/Component";
import { ValidationType } from "../presenter/Presenter";

export interface IFormBaseView extends IView<IFormBaseView> {
    errors: string;
}

export interface IValidationResult {
    validationResult: string;
    validationType: ValidationType;
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
     * Установка текста ошибок валидации и доступности кнопки принятия.
     */
    set errors(value: string) {
        this._errors.textContent = value;
        value === "" ? this._acceptButton.removeAttribute("disabled") : this._acceptButton.setAttribute("disabled", "true");
    }
}