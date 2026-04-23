import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IFormFinalView {
    successDescription: number;
}

export class FormFinal extends Component<IFormFinalView> {
    protected _successDescription: HTMLElement;
    protected _okButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._successDescription = ensureElement<HTMLElement>(".order-success__description", container);
        this._okButton = ensureElement<HTMLButtonElement>(".order-success__close", container);
        this._okButton.addEventListener("click", () => {
            PRESENTER.closeModal();
        });
    }


    get content() {
        return this.container;
    }

    set successDescription(orderAmount: number) {
        this._successDescription.textContent = `Списано ${orderAmount} синапсов`;
    }
}