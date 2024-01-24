/*Purpose: This function calculates adjusted width and height for drawing shapes based on the user's mouse movement.
It calculates the initial width and height (x - from[0] and y - from[1]).
If the shift key is pressed, it adjusts the width and height to maintain the aspect ratio, ensuring that the drawn shape is proportional. */
const getWidthAndHeight = (
  x: number,
  y: number,
  from: [number, number],
  shift?: boolean
) => {
    // Calculate the width and height based on the difference between the current (x, y) and the starting point (from)
  let width = x - from[0];
  let height = y - from[1];

   // Check if the shift key is pressed
  if (shift) {
    // If width is greater than height, adjust height to maintain the aspect ratio
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
// Return an object with the adjusted width and height
  return { width, height };
};

/*Purpose: This function draws an ellipse (or circle) on the canvas.
It uses getWidthAndHeight to get adjusted width and height.
The ellipse's center (cX, cY) and radii (radiusX, radiusY) are calculated based on the adjusted dimensions.
The ellipse is drawn using the ellipse method, and both stroke and fill operations are performed. */
export const drawCircle = (
    ctx: CanvasRenderingContext2D,
    from: [number, number],
    x: number,
    y: number,
    shift?: boolean
) => {
     // Begin a new path for drawing
    ctx.beginPath();

    // Get adjusted width and height using getWidthAndHeight function
    const { width, height } = getWidthAndHeight(x, y, from, shift);

    // Calculate the center (cX, cY) and radii (radiusX, radiusY) of the ellipse
    const cX = from[0] + width / 2;
    const cY = from[1] + height / 2;
    const radiusX = Math.abs(width / 2);
    const radiusY = Math.abs(height / 2);

      // Draw an ellipse with the calculated parameters
    ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

    // Stroke and fill the ellipse
    ctx.stroke();
    ctx.fill();

  // Close the path
    ctx.closePath();

    // Return an object with ellipse properties
    return { cX, cY, radiusX, radiusY };
};

/*Purpose: This function draws a rectangle on the canvas, either filled or outlined.
It uses getWidthAndHeight to get adjusted width and height.
If the fill parameter is true, it uses fillRect to draw a filled rectangle; otherwise, it uses rect for an outlined rectangle.
Both stroke and fill operations are performed. */
export const drawRect = (
    ctx: CanvasRenderingContext2D,
    from: [number, number],
    x: number,
    y: number,
    shift?: boolean,
    fill?: boolean
) => {
    // Begin a new path for drawing
    ctx.beginPath();

    const { width, height } = getWidthAndHeight(x, y, from, shift);

    // Draw a filled or outlined rectangle based on the 'fill' parameter
    if (fill) {
        ctx.fillRect(from[0], from[1], width, height);
    } else {
        ctx.rect(from[0], from[1], width, height);
    }

    //stroke and fill the rectangle
    ctx.stroke();
    ctx.fill();

    //Close the path
    ctx.closePath();

    // Return an object with rectangle dimensions
    return { width, height };
};

/*Purpose: This function draws a line on the canvas.
If the shift key is pressed, it draws a straight line from the starting point to the current position.
If shift is not pressed, it draws a continuous line to the current position. */
export const drawLine = (
    ctx: CanvasRenderingContext2D,
    from: [number, number],
    x: number,
    y: number,
    shift?: boolean
) => {
    //if the shift key is pressed
    if(shift) {
        // If shift is pressed, draw a straight line from the starting point to the current position
        ctx.beginPath();
        ctx.lineTo(from[0], from[1]);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        return;
    }

    // If shift is not pressed, draw a continuous line to the current position
    ctx.lineTo(x, y);
    ctx.stroke();
};



