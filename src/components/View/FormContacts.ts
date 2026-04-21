import { FormBase } from "./FormBase";

export class FormContacts<T> extends FormBase<T> {
    constructor(
        container: HTMLElement
    ) {
        super(container);
    }
}