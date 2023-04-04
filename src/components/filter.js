import { mediator } from "../services/mediator";

export class Filter {
    constructor(elementName) {
        this.initialize(elementName);
    }

    initialize(elementName) {
        const rootElement = document.getElementById(elementName);
        this.filterInputElement = document.createElement('input');
        this.filterInputElement.placeholder = 'Filter breeds...'
        this.filterInputElement.addEventListener('keyup', this.handleKeyUp.bind(this));

        rootElement.appendChild(this.filterInputElement);
    }

    handleKeyUp() {
        mediator.raiseEvent('filter-breeds', this.filterInputElement.value);
    }
}