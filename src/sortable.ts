import { DragSort } from "./dragsort";
import { isStringNotEmpty } from "./utils";
import { getElements, translate } from "./utils/dom";

export const sortable = ({ ls, opts: { draggable } }: DragSort) => {
    let activeElement: HTMLElement | SVGElement;
    let startX: number;
    let startY: number;

    const ListElements = [...ls.children];
    const draggableElements = isStringNotEmpty(draggable)
        ? getElements(":scope > " + draggable)
        : ListElements;

    const dragMove = (e: PointerEvent) => {
        if (e.buttons) {
            translate(activeElement, e.x - startX, e.y - startY);
        } else {
            dragEnd();
        }
    };

    const dragEnd = () => {
        activeElement.style.cssText = "";
        document.removeEventListener("pointermove", dragMove);
        document.removeEventListener("pointerup", dragEnd);
    };

    const dragStart = (e: Event) => {
        const { target, pointerId, x, y } = e as PointerEvent;
        startX = x;
        startY = y;

        activeElement = target as HTMLElement | SVGElement;
        activeElement.setPointerCapture(pointerId);
        activeElement.style.pointerEvents = "none";

        document.addEventListener("pointermove", dragMove);
        document.addEventListener("pointerup", dragEnd);
    };

    draggableElements.forEach((draggableElement) =>
        draggableElement.addEventListener("pointerdown", dragStart),
    );

    return {};
};
