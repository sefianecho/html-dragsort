import { isString } from ".";
import { DragElement, EventBinder, RectArray } from "../types";

export const getElements = <T extends Element>(ref: string | T): T[] => {
    if (isString(ref)) {
        return [...document.querySelectorAll<T>(ref)];
    }
    return [ref];
};

export const translate = (el: HTMLElement | SVGElement, x: number, y: number) =>
    (el.style.transform = `translate(${x}px,${y}px)`);

export const getClosestItem = (
    container: Element,
    element: Element | null,
): DragElement | null => {
    const parent = element && element.parentElement;

    if (parent === container) {
        return element as DragElement;
    }

    if (!parent) {
        return parent;
    }

    return getClosestItem(container, parent);
};

export const swapElements = (parent: Node, nodeA: Node, nodeB: Node) => {
    const nextA = nodeA.nextSibling;
    const nextB = nodeB.nextSibling;

    if (nextA === nodeB) {
        parent.insertBefore(nodeB, nodeA);
    } else if (nextB === nodeA) {
        parent.insertBefore(nodeA, nodeB);
    } else {
        parent.insertBefore(nodeA, nextB);
        parent.insertBefore(nodeB, nextA);
    }
};

export const addEvent: EventBinder = (target, type, listener, options) =>
    target.addEventListener(type, listener as EventListener, options);

export const removeEvent: EventBinder = (target, type, listener) =>
    target.removeEventListener(type, listener as EventListener);

export const getBoundingRect = (el: Element): RectArray => {
    const { x, y, width, height } = el.getBoundingClientRect();
    return [x, y, width, height];
};
