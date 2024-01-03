import { useDispatch, useSelector } from "react-redux";
import { setOptions, setSelection } from "./optionSlice";


export const useOptionsValue = () => {
    return useSelector((state: any) => state.option);
}

export const useSetOptions = () => {
    const dispatch = useDispatch();

    return (newOptions: any) => {
        dispatch(setOptions(newOptions));
    };
};

// export const useOptions = () => {
//     return 
// }

export const useSelection = () => {
    const setOptions = useSetOptions();

    const setSelection = (rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => {
        setOptions((prev: any) => ({ ...prev, Selection: rect }));
    };

    const clearSelection = () => {
        (setOptions((prev: any) => ({ ...prev, selection: null})));
    };

    return { setSelection, clearSelection };
};