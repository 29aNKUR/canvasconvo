import { COLORS_ARRAY } from "../constants/color";

export const getNextColor = (color?: string) => {
    const index = COLORS_ARRAY.findIndex((colorArr) => colorArr === color);

    if (index === -1) return COLORS_ARRAY[0];

    /*If the provided color is found, it calculates the index of the next color using modulo arithmetic ((index + 1) % COLORS_ARRAY.length).
This ensures that it loops back to the beginning of the array when reaching the end.
The function then returns the color at the calculated index */
    return COLORS_ARRAY[(index + 1) % COLORS_ARRAY.length];
};