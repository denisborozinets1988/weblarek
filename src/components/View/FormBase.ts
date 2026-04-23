import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IFormBaseView {
    validateInformation(): void;
}

export interface IValidateData {

}

export abstract class FormBase<T> extends Component<T> {
    protected _acceptButton: HTMLButtonElement;
    protected _orderBlock: HTMLElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);

        this._orderBlock = ensureElement<HTMLElement>(".order", container);
        this._acceptButton = ensureElement<HTMLButtonElement>(".button", ensureElement<HTMLElement>(".modal__actions", container));
    }

    protected buttonAccessibility() {
        this.validateForm() ? this._acceptButton.removeAttribute("disabled") : this._acceptButton.setAttribute("disabled", "true");
    }

    protected validateForm(): boolean {
        return false;
    }
}