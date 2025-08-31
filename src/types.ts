export interface DragSortOptions {
    draggable?: string;
    axis?: "x" | "y" | "xy";
}

export interface SortEvent {
    type: EventType;
    placeholder: HTMLElement;
    dragged: HTMLElement;
    target: HTMLElement;
    from: number;
    to: number;
    list: HTMLElement;
}

export type EventType = "dragStart" | "sort" | "dragEnd";
export type EventHandler = (e: {}) => void;
export type EventListeners = Record<EventType, EventHandler[]>;

export type EventData = [
    list: Element,
    placeholder: Element | null,
    dragged: Element,
    target: Element | null,
    from: number,
    to: number,
];

export interface EventEmitter {
    emit(type: EventType, data: EventData): void;
    add(type: EventType, handler: EventHandler): void;
    rm(type?: EventType, handler?: EventHandler): void;
}
