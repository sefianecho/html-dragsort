import { eventEmitter } from "./eventEmitter";
import { sortable } from "./sortable";
import {
    DragSortOptions,
    EventEmitter,
    EventHandler,
    EventType,
} from "./types";
import { assign } from "./utils";
import { getElements } from "./utils/dom";

export default class HTMLDragSort {
    opts!: DragSortOptions;
    ls!: HTMLElement;
    e!: EventEmitter;
    unset: (() => void) | undefined;
    constructor(
        container: string | HTMLElement,
        options: DragSortOptions = {},
    ) {
        const list = getElements<HTMLElement>(container)[0];

        if (list) {
            this.e = eventEmitter();
            this.ls = list;
            this.opts = { ...{ axis: "y", opacity: 0 }, ...options };
            this.unset = sortable(this);
        }
    }

    setOptions(options: DragSortOptions) {
        assign(this.opts, options || {});
        this.unset = sortable(this);
    }

    on(type: EventType, handler: EventHandler) {
        this.e.add(type, handler);
    }

    off(type?: EventType, handler?: EventHandler) {
        this.e.rm(type, handler);
    }
}
