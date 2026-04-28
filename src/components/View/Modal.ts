import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Интерфейс модалки.
 */
export interface IModalView {
    content: HTMLElement;
    openModal(content?: HTMLElement): void;
    closeModal(): void;
}

/**
 * Модальное окно (далее - модалка).
 */
export class Modal extends Component<IModalView> {
    protected _content: HTMLElement;
    protected _buttonClose: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);

        this._content = ensureElement<HTMLElement>(".modal__content", this.container,);
        this._buttonClose = ensureElement<HTMLButtonElement>(".modal__close", this.container,);
        this._buttonClose.addEventListener("click",
            () => { this.events.emit("modal:close"); });
    }

    /**
     * Открыть модалку с контентом.
     * @param content контент.
     */
    openModal(content: HTMLElement) {
        this.content = content;
        this.container.classList.add("modal_active");
    }

    /**
     * Зкрыть модалку.
     */
    closeModal() {
        this.container.classList.remove("modal_active");
        this._content.innerHTML = "";
    }

    /**
     * Изменяемый контент модалки.
     */
    set content(value: HTMLElement) {
        this._content.innerHTML = "";
        this._content.append(value);
    }
}