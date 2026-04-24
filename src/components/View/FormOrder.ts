import { PRESENTER } from "../../main";
import { IBuyer } from "../../types";
import { ensureElement, ensureElementByName } from "../../utils/utils";
import { FormBase, IFormBaseView } from "./FormBase";


export class FormOrder extends FormBase<IFormBaseView> {
    private _paymentButtonOffline?: HTMLButtonElement;
    private _paymentButtonOnline?: HTMLButtonElement;
    private _addressInputElement: HTMLInputElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);

        const buttonsPaymentParent = ensureElement<HTMLElement>(".order__buttons", container);
        this._paymentButtonOnline = ensureElementByName<HTMLButtonElement>(buttonsPaymentParent, ".button", "card");
        this._paymentButtonOffline = ensureElementByName<HTMLButtonElement>(buttonsPaymentParent, ".button", "cash");
        this._addressInputElement = ensureElementByName<HTMLInputElement>(this._orderBlock, ".form__input", "address");

        const classNameButtonActive = "button_alt-active";

        this._paymentButtonOffline.addEventListener("click", () => {
            this._paymentButtonOffline?.classList.add(classNameButtonActive);
            this._paymentButtonOnline?.classList.remove(classNameButtonActive);
            this.buttonAccessibility();
        });
        this._paymentButtonOnline.addEventListener("click", () => {
            this._paymentButtonOffline?.classList.remove(classNameButtonActive);
            this._paymentButtonOnline?.classList.add(classNameButtonActive);
            this.buttonAccessibility();
        });
        this._addressInputElement.addEventListener("input", () => {
            this.buttonAccessibility();
        });
        this._acceptButton.addEventListener("click", () => {
            if (this.validateForm()) {
                const data: Partial<IBuyer> = {
                    payment: this._paymentButtonOffline?.classList.contains("button_alt-active") ? "offline" : "online",
                    address: this._addressInputElement.value
                }

                PRESENTER.stepOrder(data)
            } else {
                this.buttonAccessibility();
            }
        })
    }

    protected override validateForm(): boolean {
        return this.container.querySelector(".button_alt-active") !== null && this._addressInputElement.value !== "";
    }
}