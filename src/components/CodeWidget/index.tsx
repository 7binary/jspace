import { useEffect } from 'react';

import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import Resizable from '../Resizable';
import { Cell } from '../../state';
import { useActions } from '../../hooks/use-actions';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import { useCumulativeCode } from '../../hooks/use-cumulative-code';
import './code-widget.css';
import { useMediaQuery } from '../../hooks/use-media-query';

const CodeWidget: React.FC<{cell: Cell}> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector(state => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    // Debouncing - сработает спустя 750мс после окончания ввода кода
    const timer = setTimeout(() => {
      createBundle(cell.id, cumulativeCode);
    }, 750);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode, createBundle, isSmallScreen]);

  if (isSmallScreen) {
    return (
      <div className='code-widget'>
        <CodeEditor
          initialValue={cell.content}
          onChange={(value: string) => updateCell(cell.id, value)}
          isSmallScreen={isSmallScreen}
        />
        <Preview bundled={bundle?.bundled} loading={bundle?.loading}/>
      </div>
    );
  }

  return (
    <Resizable direction="vertical" vertialHeight={280}>
      <div className='code-widget'>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value: string) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview bundled={bundle?.bundled} loading={bundle?.loading}/>
      </div>
    </Resizable>
  );
};

export default CodeWidget;
