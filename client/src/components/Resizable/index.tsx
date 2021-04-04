import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';
import useWindowSize from './use-window-size';

interface Props {
  direction: 'horizontal' | 'vertical';
  vertialHeight?: number;
}

const Resizable: React.FC<Props> = ({ children, direction, vertialHeight = 280 }) => {
  const windowSize = useWindowSize();
  let resizableProps: ResizableBoxProps;

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      width: windowSize.width * 0.65,
      height: Infinity,
      minConstraints: [windowSize.width * 0.25, Infinity],
      maxConstraints: [windowSize.width * 0.75, Infinity],
      resizeHandles: ['e'],
    };
  } else {
    resizableProps = {
      width: Infinity,
      height: vertialHeight,
      minConstraints: [Infinity, windowSize.height * 0.1],
      maxConstraints: [Infinity, windowSize.height * 0.9],
      resizeHandles: ['s'],
    };
  }

  return (
    <ResizableBox {...resizableProps}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
