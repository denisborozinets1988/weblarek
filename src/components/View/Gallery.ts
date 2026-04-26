import { Component, IView } from "../base/Component";

export interface IGalleryView extends IView<IGalleryView> {
    catalog: HTMLElement[];
}

/**
 * Список всех товаров.
 */
export class Gallery extends Component<IGalleryView> {
    constructor(
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