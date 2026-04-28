import { ensureElement, ensureElementByName } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { FormBase, IFormBaseView } from "./FormBase";

/**
 * Оформление заказа. Шаг 1. Выбор типа оплаты и заполнение адреса.
 */
export class FormOrder extends FormBase<IFormBaseView> {
    private _paymentButtonOffline: HTMLButtonElement;
    private _paymentButtonOnline: HTMLButtonElement;
    private _addressInputElement: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        const buttonsPaymentParent = ensureElement<HTMLElement>(".order__buttons", container);
        this._paymentButtonOnline = ensureElementByName<HTMLButtonElement>(buttonsPaymentParent, ".button", "card");
        this._paymentButtonOffline = ensureElementByName<HTMLButtonElement>(buttonsPaymentParent, ".button", "cash");
        this._addressInputElement = ensureElementByName<HTMLInputElement>(this._orderBlock, ".form__input", "address");

        const classNameButtonActive = "button_alt-active";

        this._paymentButtonOffline.addEventListener("click",
            () => {
                this._paymentButtonOffline.classList.add(classNameButtonActive);
                this._paymentButtonOnline.classList.remove(classNameButtonActive);
                events.emit("payment:changed", { payment: "offline" });
            });
        this._paymentButtonOnline.addEventListener("click",
            () => {
                this._paymentButtonOffline.classList.remove(classNameButtonActive);
                this._paymentButtonOnline.classList.add(classNameButtonActive);
                events.emit("payment:changed", { payment: "online" });
            });
        this._addressInputElement.addEventListener("input",
            () => { events.emit("address:changed", { address: this._addressInputElement.value }); });
        this._acceptButton.addEventListener("click",
            () => { events.emit("order:accept"); });
    }

    clearFields() {
        const classNameButtonActive = "button_alt-active";
        this._paymentButtonOffline.classList.remove(classNameButtonActive);
        this._paymentButtonOnline.classList.remove(classNameButtonActive);
        this._addressInputElement.value = "";
    }
}