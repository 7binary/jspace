import { useEffect } from 'react';

import CodeEditor from 'src/components/CodeEditor';
import Preview from 'src/components/Preview';
import Resizable from 'src/components/Resizable';
import { Cell } from 'src/state';
import { useActions, useTypedSelector, useMediaQuery, useCumulativeCode } from 'src/hooks';
import './code-widget.css';

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
