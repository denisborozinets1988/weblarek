import { PRESENTER } from "../../main";
import { IBuyer } from "../../types";
import { ensureElementByName } from "../../utils/utils";
import { FormBase, IFormBaseView } from "./FormBase";

interface IFormContactsView extends IFormBaseView {

}

export class FormContacts<IFormContactsView> extends FormBase<IFormContactsView> {
    private _emailInputElement: HTMLInputElement;
    private _phoneInputElement: HTMLInputElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);

        this._emailInputElement = ensureElementByName<HTMLInputElement>(this._orderBlock, ".form__input", "email");
        this._phoneInputElement = ensureElementByName<HTMLInputElement>(this._orderBlock, ".form__input", "phone");

        this._emailInputElement?.addEventListener("input", () => {
            this.buttonAccessibility();
        });

        this._phoneInputElement?.addEventListener("input", () => {
            this.buttonAccessibility();
        });
        this.container.addEventListener("submit", (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                const data: Partial<IBuyer> = {
                    email: this._emailInputElement.value,
                    phone: this._phoneInputElement.value
                }

                PRESENTER.finalOrder(data)
            } else {
                this.buttonAccessibility();
            }
        })
    }

    protected override validateForm(): boolean {
        return this._emailInputElement.value !== "" && this._phoneInputElement.value !== "";
    }

    get content() {
        return this.container;
    }
}