import { PRESENTER } from "../../main";
import { IBuyer, IErrorsBayer, PaymentType } from "../../types";
import { ensureElement, ensureElementByName } from "../../utils/utils";
import { FormBase, IFormBaseView } from "./FormBase";


export class FormOrder extends FormBase<IFormBaseView> {
    private _paymentButtonOffline: HTMLButtonElement;
    private _paymentButtonOnline: HTMLButtonElement;
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
                PRESENTER.stepOrder();
            } else {
                this.buttonAccessibility();
            }
        })

        this.buttonAccessibility();
    }

    protected override validateForm(): boolean {
        const buttonPayment = this.container.querySelector(".button_alt-active");
        let paymentType: string | null = null;
        if (buttonPayment === this._paymentButtonOffline) {
            paymentType = "offline";
        } else if (buttonPayment === this._paymentButtonOnline) {
            paymentType = "online";
        }

        const result = PRESENTER.getValidateInformationOrder(
            {
                payment: paymentType as PaymentType,
                address: this._addressInputElement.value
            }
        ) as IErrorsBayer;

        const resultArray: string[] = [];
        if (result.payment) {
            resultArray.push(result.payment);
        }
        if (result.address) {
            resultArray.push(result.address);
        }

        this._errors.textContent = resultArray.length ? resultArray.join(" ") : "";
        return this._errors.textContent === "";
    }
}