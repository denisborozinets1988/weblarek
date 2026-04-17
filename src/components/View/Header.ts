import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeaderView {
  counter: number;
}

export class Header extends Component<IHeaderView> {
  protected _counterElement: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this._counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this._basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  initEventHandler(): void {
    this.events.on("basket:open", () => { PRESENTER.openBasket() });
  }

  set counter(value: number) {
    this._counterElement.textContent = String(value);
  }
}
