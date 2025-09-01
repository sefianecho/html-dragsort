import HTMLDragSort from "./dragsort";
import { DragElement, EventData } from "./types";
import { assign, isStringNotEmpty } from "./utils";
import {
    addEvent,
    getBoundingRect,
    getElements,
    getClosestItem,
    removeEvent,
    swapElements,
    translate,
} from "./utils/dom";

export const sortable = ({
    ls,
    e: { emit },
    unset,
    opts: { handle, axis, draggable, opacity, disabled },
}: HTMLDragSort) => {
    if (unset) {
        unset();
    }

    if (disabled) {
        return;
    }

    let dragItem: DragElement;
    let placeholder: DragElement;
    let sortableTarget: Element | null;

    let eventData: EventData;

    let isDragging = false;

    let startX: number;
    let startY: number;

    const items = [...ls.children];
    const draggableItems = isStringNotEmpty(draggable)
        ? getElements(":scope > " + draggable)
        : items;

    const dragMove = (e: PointerEvent) => {
        if (e.buttons) {
            let { x, y } = e;
            let [dragCenterX, dragCenterY, dragWidth, dragHeight] =
                getBoundingRect(dragItem);

            dragCenterX += dragWidth / 2;
            dragCenterY += dragHeight / 2;

            if (!isDragging) {
                emit("dragStart", eventData);
                isDragging = true;
            }

            if (axis === "x") {
                y = startY;
            } else if (axis === "y") {
                x = startX;
            }

            sortableTarget = getClosestItem(
                ls,
                document.elementFromPoint(dragCenterX, dragCenterY),
            );

            translate(dragItem, x - startX, y - startY);

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
                    eventData[5] = items.indexOf(sortableTarget);
                    emit("sort", eventData);
                    swapElements(ls, sortableTarget, placeholder);
                }
            }
        } else {
            dragEnd();
        }
    };

    const dragEnd = () => {
        dragItem.removeAttribute("style");
        removeEvent(dragItem, "pointermove", dragMove);
        removeEvent(dragItem, "pointerup", dragMove);
        placeholder.replaceWith(dragItem);
        eventData[1] = eventData[3] = null;
        emit("dragEnd", eventData);
    };

    const dragStart = ({ x, y, pointerId, target }: PointerEvent) => {
        const el = getClosestItem(ls, target as Element);
        if (
            disabled ||
            !el ||
            !draggableItems.includes(el) ||
            (isStringNotEmpty(handle) && !(target as Element).closest(handle))
        ) {
            return;
        }

        dragItem = el;
        placeholder = dragItem.cloneNode() as DragElement;
        const [left, top, width, height] = getBoundingRect(dragItem);
        const box = {
            boxSizing: "border-box",
            width: width + "px",
            height: height + "px",
        };

        startX = x;
        startY = y;

        assign(
            placeholder.style,
            {
                opacity,
            },
            box,
        );

        assign(
            dragItem.style,
            {
                position: "fixed",
                pointerEvents: "none",
                top: top + "px",
                left: left + "px",
                willChange: "transform",
            },
            box,
        );

        dragItem.after(placeholder);
        document.body.append(dragItem);
        dragItem.setPointerCapture(pointerId);

        eventData = [
            ls,
            placeholder,
            dragItem,
            null,
            items.indexOf(dragItem),
            -1,
        ];

        addEvent(dragItem, "pointermove", dragMove);
        addEvent(dragItem, "pointerup", dragEnd);
    };

    addEvent(ls, "pointerdown", dragStart);

    return () => removeEvent(ls, "pointerdown", dragStart);
};
