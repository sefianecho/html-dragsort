import { sortable } from "./sortable";
import { DragSortOptions } from "./types";
import { getElements } from "./utils/dom";

export class DragSort {
    opts!: DragSortOptions;
    ls!: HTMLElement;
    s!: {};
    constructor(
        container: string | HTMLElement,
        options: DragSortOptions = {},
    ) {
        const list = getElements<HTMLElement>(container)[0];

        if (list) {
            this.ls = list;
            this.opts = { ...options };
            this.s = sortable(this);
        }
    }
}
