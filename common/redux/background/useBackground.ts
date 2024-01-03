import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMode, toggleLines } from "./backgroundSlice";

export const useBackground = () => {
  const bg = useSelector((state: any) => state.background);

  useEffect(() => {
    const root = window.document.documentElement;

    if (bg.mode === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [bg.mode]);

  return bg;
};

export const useSetBackground = () => {
  const dispatch = useDispatch();

  const setBackground = (mode: "dark" | "light", lines: boolean) => {
    dispatch(setMode(mode));
    dispatch(toggleLines());
  };

  return setBackground;
};
