class Mediator {

    constructor() {
        console.log('create mediator');
        this.events = {};
    }

    register(eventName, callbackFunction) {
        if (!this.events[eventName])  {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callbackFunction);
    }

    raiseEvent(eventName, eventData) {
        if (!this.events[eventName])  {
            return;
        }

        for (const callbackFunction of this.events[eventName]) {
            callbackFunction(eventData);
        }
    }
}

export const mediator = new Mediator();