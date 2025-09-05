# HTML DragSort

html-dragsort is a lightweight, zero-dependency library for reordering HTML elements using Pointer Events. It supports vertical, horizontal, and grid layouts, with options for drag handles and lifecycle events (`dragStart`, `sort`, `dragEnd`).

## Getting Started

Install using package manager:
```sh
npm install html-dragsort
```
or
```sh
yard add html-dragsort
```
### CDN

- UMD
```html
  <script src="https://cdn.jsdelivr.net/npm/html-dragsort@1/dist/html-dragsort.umd.min.js"></script>
```
- IIFE
```html
  <script src="https://cdn.jsdelivr.net/npm/html-dragsort@1/dist/html-dragsort.iife.min.js"></script>
```
- ES Module
```html
<script type="module">
    import HTMLDragSort from "https://cdn.jsdelivr.net/npm/html-dragsort@1/dist/html-dragsort.esm.min.js";
</script>
```
## Usage

html-dragsort makes any container sortable by dragging its children. Just pass a parent element (or a selector) to the constructor. By default, all direct children become draggable, but you can customize which ones are draggable using options like `handle` or a `draggable` class filter.

```javascript
const sorter = new HTMLDragSort('#container', { /* ...options */ });
```
## Options

| Option      | Type             | Default | Description                                                                                                                             |
|-------------|------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `draggable` | `string`         | `""`    | A CSS selector that defines which children of the container can be dragged.                                                             |
| `handle`    | `string`         | `""`    | A CSS selector for a "drag handle" inside each draggable item.                                                                          |
| `axis`      | `"x"\|"y"\|"xy"` | `"y"`   | Restricts the drag movement to a specific axis, for `xy` items can be dragged freely in both directions.                                |
| `opacity`   | `number`         | `0`     | Sets the CSS opacity of the placeholder element while dragging. The value should be between 0 (fully transparent) and 1 (fully opaque). |
| `disabled`  | `boolean`        | `false` | Disables drag-and-sort behavior when set to `true`.                                                                                     |

## Events

html-dragsort dispatches events during the drag-and-sort lifecycle. You can listen for them using `.on(event, callback)`
Each event handler receives a `SortEvent` object with details like the item being dragged, placeholder, from/to indexes, and the container list.

```javascript
sorter.on("sort", (evt) => {
  // Event type
  evt.type
  // Temporary element that occupies the position of the dragged item while sorting.
  evt.placeholder
  // Dragged element
  evt.dragged
  // The target is the sortable element that the dragged item is currently hovering over during a drag operation.
  evt.target
  // The original index of the dragged item before sorting began.
  evt.from
  // The new index of the dragged item after it has been reordered. (-1 if no reordering happened yet).
  evt.to
  // The sortable container element passed to HTMLDragSort.
  evt.list
});
```

| Event       | Argument    | Description                                                           |
|-------------|-------------|-----------------------------------------------------------------------|
| `dragStart` | `SortEvent` | Triggered as soon as the user starts dragging an item.                |
| `sort`      | `SortEvent` | Fires whenever the dragged item is reordered within the container.    |
| `dragEnd`   | `SortEvent` | Fires when the dragged item is dropped (the drag operation finishes). |

## Methods

- setOptions(options: `DragSortOptions`) — Updates the configuration of the existing HTMLDragSort instance.
- on(type: `EventType`, handler: `EventHandler`) — Attaches an event handler.
- off(type?: `EventType`, handler?: `EventHandler`) — Detaches event handlers; omit `handler` to remove all handlers for an event, omit event `type` to remove all handlers entirely.
- destroy() — Removes event listeners attached to the container and cleans up the `HTMLDragSort` instance.
