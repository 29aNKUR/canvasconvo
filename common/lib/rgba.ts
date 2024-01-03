import { RgbaColor } from 'react-colorful';

export const getStringFromRgba = (rgba: RgbaColor) => {
    `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}


//rgba - red, green, blue, alpha
//rgba(255, 0, 0, 0.5)