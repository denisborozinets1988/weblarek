import { PRESENTER } from "../../main";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ICardCatalogView } from "./CardCatalog";

export interface IGalleryView {

}

export class Gallery extends Component<IGalleryView> {
    private _catalog: HTMLElement[] = [];

    constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);
    }

    set catalog(values: HTMLElement[]) {
        this.container.append(...values);
    }
}
