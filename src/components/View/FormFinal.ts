import { ensureElement } from "../../utils/utils";
import { Component, IView } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IFormFinalView extends IView<IFormFinalView> {
    successDescription: number;
}

/**
 * Форма успешного оформления заказа.
 */
export class FormFinal extends Component<IFormFinalView> {
    protected _successDescription: HTMLElement;
    protected _okButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._successDescription = ensureElement<HTMLElement>(".order-success__description", container);
        this._okButton = ensureElement<HTMLButtonElement>(".order-success__close", container);
        this._okButton.addEventListener("click",
            () => { events.emit("modal:close"); });
    }

    /**
     * Установка текста об успешном заказе.
     */
    set successDescription(orderAmount: number) {
        this._successDescription.textContent = `Списано ${orderAmount} синапсов`;
    }
}