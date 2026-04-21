import { ensureElement } from "../../utils/utils";
import { FormBase, IFormBaseView } from "./FormBase";

interface IFormOrderView extends IFormBaseView {

}

export class FormOrder<IFormOrderView> extends FormBase<IFormOrderView> {
    private _paymentButtonOffline?: HTMLButtonElement | null = null;
    private _paymentButtonOnline?: HTMLButtonElement;
    private _addressInputElement?: HTMLInputElement;

    constructor(
        container: HTMLElement
    ) {
        super(container);

        const buttons = ensureElement<HTMLElement>(".order__buttons", container).children;
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i] as HTMLButtonElement;
            const buttonName = button.getAttribute("name");
            if (buttonName === "card") {
                this._paymentButtonOnline = button;
            } else if (buttonName === "cash") {
                this._paymentButtonOffline = button;
            }
        }

        const fields = ensureElement<HTMLElement>(".order__field", container).children;
        for (let i = 0; i < fields.length; i++) {
            const element = fields[i];
            const elementName = element.getAttribute("name");
            if (elementName === "address") {
                this._addressInputElement = element as HTMLInputElement;
            }
        }
    }
}