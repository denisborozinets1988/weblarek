import { PRESENTER } from "../../main";
import { IErrorsBayer } from "../../types";
import { ensureElementByName } from "../../utils/utils";
import { FormBase } from "./FormBase";

export interface IFormContacts {
    error: string;
}

export class FormContacts extends FormBase<IFormContacts> {
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
                PRESENTER.finalOrder();
            } else {
                this.buttonAccessibility();
            }
        })

        this.buttonAccessibility();
    }

    protected override validateForm(): boolean {
        const result = PRESENTER.getValidateInformationOrder(
            {
                email: this._emailInputElement.value,
                phone: this._phoneInputElement.value
            }
        ) as IErrorsBayer;

        const resultArray: string[] = [];
        if (result.email) {
            resultArray.push(result.email);
        }
        if (result.phone) {
            resultArray.push(result.phone);
        }

        this._errors.textContent = resultArray.length ? resultArray.join(" ") : "";
        return this._errors.textContent === "";
    }

    set error(value: string) {
        this._errors.textContent = value;
    }
}