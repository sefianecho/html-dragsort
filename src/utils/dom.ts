import { isString } from ".";

export const getElements = <T extends Element>(ref: string | T): T[] => {
    if (isString(ref)) {
        return [...document.querySelectorAll<T>(ref)];
    }
    return [ref];
};

export const translate = (el: HTMLElement | SVGElement, x: number, y: number) =>
    (el.style.transform = `translate(${x}px,${y}px)`);
