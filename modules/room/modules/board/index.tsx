import Canvas from './components/Canvas';
import MousePosition from './components/MousePosition';
import MousesRenderer from './components/MouseRenderer';
import MoveImage from './components/MoveImage';
import SelectionBtns from './components/SelectionBtns';

const Board = () => (
  <>
    <Canvas />
    <MousePosition />
    <MousesRenderer />
    <MoveImage />
    <SelectionBtns />
  </>
);

export default Board;
