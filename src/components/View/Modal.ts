import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModalView {
    content: HTMLElement;
    openModal(): void;
    closeModal(): void;
}

export class Modal extends Component<IModalView> implements IModalView {
    protected _content: HTMLElement;
    protected _buttonClose: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);

        this._content = ensureElement<HTMLElement>(
            ".modal__content",
            this.container,
        );

        this._buttonClose = ensureElement<HTMLButtonElement>(
            ".modal__close",
            this.container,
        );

        this._buttonClose.addEventListener("click", () => {
            this.events.emit("modal:close");
        });
    }

    initEventHandler(): void {
        this.events.on("modal:close", () => { PRESENTER.closeModal() });
    }

    openModal() {
        this.container.classList.add("modal_active");
    }

    closeModal() {
        this.container.classList.remove("modal_active");
    }

    set content(value: HTMLElement) {
        this._content = value;
    }
}