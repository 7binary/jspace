import { useEffect } from 'react';
import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import Resizable from '../Resizable';

import './code-widget.css';
import { Cell } from '../../state';
import { useActions } from '../../hooks/use-actions';
import { useTypedSelector } from '../../hooks/use-typed-selector';

const CodeWidget: React.FC<{cell: Cell}> = ({ cell }) => {
  const bundle = useTypedSelector(state => state.bundles[cell.id]);
  const { updateCell, createBundle } = useActions();

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }
    // Debouncing - сработает спустя 750мс после окончания ввода кода
    const timer = setTimeout(() => {
      createBundle(cell.id, cell.content);
    }, 750);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cell.content, createBundle]);

  return (
    <Resizable direction="vertical" vertialHeight={280}>
      <div className="code-widget">
        <Resizable direction="horizontal">
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
