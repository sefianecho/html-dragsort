import { EventEmitter, EventHandler, EventListeners, EventType } from "./types";
import { isUndefined } from "./utils";

const initListeners = (): EventListeners => ({
    dragStart: [],
    sort: [],
    dragEnd: [],
});

export const eventEmitter = (): EventEmitter => {
    let listeners = initListeners();
    return {
        emit(type, [list, placeholder, dragged, target, from, to]) {
            listeners[type].forEach((listener) =>
                listener({
                    type,
                    placeholder,
                    dragged,
                    target,
                    from,
                    to,
                    list,
                }),
            );
        },

        add(type: EventType, handler: EventHandler) {
            if (listeners[type] && !listeners[type].includes(handler)) {
                listeners[type].push(handler);
            }
        },

        rm(type?: EventType, handler?: EventHandler) {
            if (isUndefined(type)) {
                listeners = initListeners();
            } else if (listeners[type]) {
                listeners[type] = isUndefined(handler)
                    ? []
                    : listeners[type].filter((fn) => fn !== handler);
            }
        },
    };
};
