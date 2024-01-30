import { useEffect, useState } from "react";

export const useViewportSize = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      //window.innerWidth and window.innerHeight are properties of the window object in a browser environment.
      /*window.innerWidth returns the width of the browser window's content area, including the vertical scrollbar if present.
window.innerHeight returns the height of the browser window's content area, including the horizontal scrollbar if present. */
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width, height };
};
