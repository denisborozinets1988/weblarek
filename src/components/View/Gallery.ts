import { Component, IView } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IGalleryView extends IView<IGalleryView> {
    catalog: HTMLElement[];
}

/**
 * Список всех товаров.
 */
export class Gallery extends Component<IGalleryView> {
    constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);
    }

    /**
     * Список всех товаров.
     */
    set catalog(values: HTMLElement[]) {
        this.container.append(...values);
    }
}