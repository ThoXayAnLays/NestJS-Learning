"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedEvent = void 0;
class OrderCreatedEvent {
    constructor(orderId, userId, price) {
        this.orderId = orderId;
        this.userId = userId;
        this.price = price;
    }
}
exports.OrderCreatedEvent = OrderCreatedEvent;
//# sourceMappingURL=create-order.event.js.map