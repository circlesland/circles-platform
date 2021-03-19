import {EventBroker} from "omo-utils/dist/eventBroker";

/**
 * Sends events to subscribers (if online via websocket, else via e-mail)
 */
/*
export class Emitter {

    private _eventBroker:EventBroker;

    constructor(eventBroker:EventBroker) {
        this._eventBroker = eventBroker;
    }

    emitNewMessage(messageId: number)
    {
        // TODO: Find all namespaces (subscribed users) who may be concerned
        //       and send one event for each (sender, recipient)
        let topic = this._eventBroker.tryGetTopic(toFissionName, "messages");
        if (topic) {
            topic.publish({
                type: "message",
                key: messageId
            });
        }
    }


    emitNewOffer(offerId: number) {
        // TODO: Send a broadcast to all subscribers
    }

    emitNewPurchase(purchaseId: number) {
        // TODO: Find all namespaces (subscribed users) who may be concerned
        //       and send one event for each (offer creator and purchaser)
        let topic = this._eventBroker.tryGetTopic(toFissionName, "messages");
        if (topic) {
            topic.publish({
                type: "message",
                key: messageId
            });
        }
    }
}*/