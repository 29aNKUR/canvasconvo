const getWidthAndHeight = (
  x: number,
  y: number,
  from: [number, number],
  shift?: boolean
) => {
  let width = x - from[0];
  let height = y - from[1];

  if (shift) {
    if (Math.abs(width) > Math.abs(height)) {
      if ((width > 0 && height < 0) || (width < 0 && height > 0)) {
        width = -height;
      } else {
        width = height;
      }
    } else if ((height > 0 && width < 0) || (height < 0 && width > 0)) {
      height = -width;
    } else {
      height = width;
    }
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  return { width, height };
};

export const drawCircle = (
    ctx: CanvasRenderingContext2D,
    from: [number, number],
    x: number,
    y: number,
    shift?: boolean
) => {
    ctx.beginPath();

    const { width, height } = getWidthAndHeight(x, y, from, shift);

    const cX = from[0] + width / 2;
    const cY = from[1] + height / 2;
    const radiusX = Math.abs(width / 2);
    const radiusY = Math.abs(height / 2);

    ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    return { cX, cY, radiusX, radiusY };
};


