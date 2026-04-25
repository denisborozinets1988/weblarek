import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IFormBaseView {
    validateInformation(): void;
}

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

    protected buttonAccessibility() {
        this.validateForm() ? this._acceptButton.removeAttribute("disabled") : this._acceptButton.setAttribute("disabled", "true");
    }

    protected validateForm(): boolean {
        return false;
    }
}