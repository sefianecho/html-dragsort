import DragSort from "./dragsort";
import { assign, isStringNotEmpty } from "./utils";
import {
    getElements,
    getSortableTarget,
    swapElements,
    translate,
} from "./utils/dom";

export const sortable = ({ ls, opts: { axis, draggable } }: DragSort) => {
    let activeElement: HTMLElement | SVGElement;
    let placeholder: HTMLElement | SVGElement;
    let sortableTarget: Element | null;

    let startX: number;
    let startY: number;

    const ListElements = [...ls.children];
    const draggableElements = isStringNotEmpty(draggable)
        ? getElements(":scope > " + draggable)
        : ListElements;

    const dragMove = (e: Event) => {
        let { x, y, buttons } = e as PointerEvent;
        let {
            x: dragCenterX,
            y: dragCenterY,
            width: dragW,
            height: dragH,
        } = activeElement.getBoundingClientRect();

        if (buttons) {
            if (axis === "x") {
                y = startY;
            } else if (axis === "y") {
                x = startX;
            }

            dragCenterX += dragW / 2;
            dragCenterY += dragH / 2;

            sortableTarget = getSortableTarget(
                ls,
                document.elementFromPoint(dragCenterX, dragCenterY),
            );

            translate(activeElement, x - startX, y - startY);

            if (sortableTarget && sortableTarget !== placeholder) {
                let {
                    x: targetX,
                    y: targetY,
                    right: targetRight,
                    bottom: targetBottom,
                } = sortableTarget.getBoundingClientRect();

                if (
                    dragCenterX > targetX &&
                    dragCenterX < targetRight &&
                    dragCenterY > targetY &&
                    dragCenterY < targetBottom &&
                    (axis !== "xy" ||
                        (x > targetX &&
                            x < targetRight &&
                            y > targetY &&
                            y < targetBottom))
                ) {
                    swapElements(ls, sortableTarget, placeholder);
                }
            }
        } else {
            dragEnd();
        }
    };

    const dragEnd = () => {
        activeElement.removeAttribute("style");
        activeElement.removeEventListener("pointermove", dragMove);
        activeElement.removeEventListener("pointerup", dragEnd);
        placeholder.replaceWith(activeElement);
    };

    draggableElements.forEach((dragElement, index) =>
        dragElement.addEventListener("pointerdown", (e: Event) => {
            const { pointerId, x, y } = e as PointerEvent;
            const { top, left, width, height } =
                dragElement.getBoundingClientRect();
            const dim = {
                boxSizing: "border-box",
                width: width + "px",
                height: height + "px",
            };
            placeholder = dragElement.cloneNode() as HTMLElement | SVGElement;

            startX = x;
            startY = y;

            assign(
                placeholder.style,
                {
                    opacity: 0,
                },
                dim,
            );

            activeElement = dragElement as HTMLElement | SVGElement;

            assign(
                activeElement.style,
                {
                    position: "fixed",
                    pointerEvents: "none",
                    top: top + "px",
                    left: left + "px",
                    willChange: "transform",
                },
                dim,
            );

            activeElement.after(placeholder);
            document.body.append(activeElement);
            activeElement.setPointerCapture(pointerId);


            activeElement.addEventListener("pointermove", dragMove);
            activeElement.addEventListener("pointerup", dragEnd);
        }),
    );

    return {};
};
