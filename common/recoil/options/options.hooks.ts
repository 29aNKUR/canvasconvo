import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { optionsAtom } from './options.atom';

//This hook uses useRecoilValue to access the current value of the optionsAtom. It returns the options object.
export const useOptionsValue = () => {
  const options = useRecoilValue(optionsAtom);

  return options;
};

//This hook uses useSetRecoilState to get the function to set the state of optionsAtom. It returns this function (setOptions), which can be used to update the state.
export const useSetOptions = () => {
  const setOptions = useSetRecoilState(optionsAtom);

  return setOptions;
};

//This hook uses useRecoilState to get both the current value of optionsAtom and the function to set its state. It returns an array with these two value
export const useOptions = () => {
  const options = useRecoilState(optionsAtom);

  return options;
};

//This hook uses the useSetOptions hook to obtain the setOptions function. It provides two functions - setSelection and clearSelection. setSelection takes a rectangle object and updates the selection property in the options, while clearSelection sets selection to null
export const useSetSelection = () => {
  const setOptions = useSetOptions();

  const setSelection = (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setOptions((prev) => ({ ...prev, selection: rect }));
  };

  const clearSelection = () => {
    setOptions((prev) => ({ ...prev, selection: null }));
  };

  return { setSelection, clearSelection };
};
