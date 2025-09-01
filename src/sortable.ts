import DragSort from "./dragsort";
import { EventData } from "./types";
import { assign, isStringNotEmpty } from "./utils";
import {
    addEvent,
    getBoundingRect,
    getElements,
    getSortableTarget,
    removeEvent,
    swapElements,
    translate,
} from "./utils/dom";

export const sortable = ({
    ls,
    e: { emit },
    opts: { axis, draggable },
}: DragSort) => {
    let activeElement: HTMLElement | SVGElement;
    let placeholder: HTMLElement | SVGElement;
    let sortableTarget: Element | null;

    let eventData: EventData;

    let dragStart = false;

    let startX: number;
    let startY: number;

    const ListElements = [...ls.children];
    const draggableElements = isStringNotEmpty(draggable)
        ? getElements(":scope > " + draggable)
        : ListElements;

    const dragMove = (e: PointerEvent) => {
        if (e.buttons) {
            let { x, y } = e;
            let [dragCenterX, dragCenterY, dragWidth, dragHeight] =
                getBoundingRect(activeElement);

            dragCenterX += dragWidth / 2;
            dragCenterY += dragHeight / 2;

            if (!dragStart) {
                emit("dragStart", eventData);
                dragStart = true;
            }

            if (axis === "x") {
                y = startY;
            } else if (axis === "y") {
                x = startX;
            }

            sortableTarget = getSortableTarget(
                ls,
                document.elementFromPoint(dragCenterX, dragCenterY),
            );

            translate(activeElement, x - startX, y - startY);

            if (sortableTarget && sortableTarget !== placeholder) {
                let [targetX, targetY, targetRight, targetBottom] =
                    getBoundingRect(sortableTarget);

                targetRight += targetX;
                targetBottom += targetY;

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
                    // Event target
                    eventData[3] = sortableTarget;
                    eventData[5] = ListElements.indexOf(sortableTarget);
                    emit("sort", eventData);
                    swapElements(ls, sortableTarget, placeholder);
                }
            }
        } else {
            dragEnd();
        }
    };

    const dragEnd = () => {
        activeElement.removeAttribute("style");
        removeEvent(activeElement, "pointermove", dragMove);
        removeEvent(activeElement, "pointerup", dragMove);
        placeholder.replaceWith(activeElement);
        eventData[1] = eventData[3] = null;
        emit("dragEnd", eventData);
    };

    draggableElements.forEach((dragElement, index) =>
        addEvent(dragElement, "pointerdown", ({ pointerId, x, y, target }) => {
            if (
                isStringNotEmpty(handle) &&
                !(target as Element).closest(handle)
            ) {
                return;
            }

            const [left, top, width, height] = getBoundingRect(dragElement);
            const box = {
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
                box,
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
                box,
            );

            activeElement.after(placeholder);
            document.body.append(activeElement);
            activeElement.setPointerCapture(pointerId);

            eventData = [ls, placeholder, activeElement, null, index, -1];

            addEvent(activeElement, "pointermove", dragMove);
            addEvent(activeElement, "pointerup", dragEnd);
        }),
    );

    return {};
};
