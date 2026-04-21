import { Component } from "../base/Component";

export interface IFormBaseView {
    validateInformation(): void;
}

export abstract class FormBase<T> extends Component<T> {
    constructor(
        container: HTMLElement
    ) {
        super(container);
    }

    validateInformation() {

    }
}