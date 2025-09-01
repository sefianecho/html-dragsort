export const { assign } = Object;

export const isString = (value: unknown): value is string =>
    typeof value === "string";

export const isUndefined = (value: unknown): value is undefined =>
    typeof value === "undefined";

export const isStringNotEmpty = (value: unknown): value is string =>
    !!(isString(value) && value.trim());
