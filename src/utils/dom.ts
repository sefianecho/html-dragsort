import { isString } from ".";

export const getElements = <T extends Element>(ref: string | T): T[] => {
    if (isString(ref)) {
        return [...document.querySelectorAll<T>(ref)];
    }
    return [ref];
};

export const translate = (el: HTMLElement | SVGElement, x: number, y: number) =>
    (el.style.transform = `translate(${x}px,${y}px)`);

export const getSortableTarget = (
    container: Element,
    element: Element | null,
): Element | null => {
    const parent = element && element.parentElement;

    if (parent === container) {
        return element;
    }

    if (!parent) {
        return parent;
    }

    return getSortableTarget(container, parent);
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
