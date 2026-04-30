import { ensureElementByName } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { FormBase, IFormBaseView } from "./FormBase";

export interface IFormContactsView extends IFormBaseView {
    email: string;
    phone: string;
}

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
            () => { events.emit("email:changed", { email: this._emailInputElement.value }); });
        this._phoneInputElement.addEventListener("input",
            () => { events.emit("phone:changed", { phone: this._phoneInputElement.value }); });
        this.container.addEventListener("submit",
            (e) => {
                e.preventDefault();
                events.emit("order:submit")
            });
    }

    set email(value: string) {
        this._emailInputElement.value = value;
    }

    set phone(value: string) {
        this._phoneInputElement.value = value;
    }
}