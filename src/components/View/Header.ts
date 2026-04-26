import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeaderView {
  counter: number;
}

/**
 * Заголовок с кнопкой корзины и счётчиком товаров в ней.
 */
export class Header extends Component<IHeaderView> {
  protected _counterElement: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this._counterElement = ensureElement<HTMLElement>(".header__basket-counter", this.container,);
    this._basketButton = ensureElement<HTMLButtonElement>(".header__basket", this.container,);
    this._basketButton.addEventListener("click", () => { this.events.emit("basket:open"); });
    this.events.on("basket:open", () => { PRESENTER.openBasket() });
  }

  /**
   * Счётчик товаров в корзине.
   */
  set counter(value: number) {
    this._counterElement.textContent = String(value);
  }
}
