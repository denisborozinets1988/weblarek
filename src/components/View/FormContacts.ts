import { IBuyer } from "../../types";
import { ensureElementByName } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { FormBase } from "./FormBase";

/**
 * Оформление заказа. Шаг 2. Заполнение почты и телефона.
 */
export class FormContacts extends FormBase<FormContacts> {
    private _emailInputElement: HTMLInputElement;
    private _phoneInputElement: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._emailInputElement = ensureElementByName<HTMLInputElement>(this._orderBlock, ".form__input", "email");
        this._phoneInputElement = ensureElementByName<HTMLInputElement>(this._orderBlock, ".form__input", "phone");

        this._emailInputElement.addEventListener("input",
            () => { events.emit("email:changed", { email: this._emailInputElement.value } as Partial<IBuyer>); });
        this._phoneInputElement.addEventListener("input",
            () => { events.emit("phone:changed", { phone: this._phoneInputElement.value } as Partial<IBuyer>); });
        this.container.addEventListener("submit",
            (e) => {
                e.preventDefault();
                events.emit("order:submit")
            });
    }

    clearFields() {
        this._emailInputElement.value = "";
        this._phoneInputElement.value = "";
    }
}