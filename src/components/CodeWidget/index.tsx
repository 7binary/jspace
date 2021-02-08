import { useEffect, useState } from 'react';
import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import bundle, { BundledResut } from '../../bundler';
import Resizable from '../Resizable';

import './code-widget.css';
import { Cell } from '../../state';
import { useActions } from '../../hooks/use-actions';

const CodeWidget: React.FC<{cell: Cell}> = ({ cell }) => {
  const [bundled, setBundled] = useState<BundledResut>({ transpiled: '', code: '', error: null });
  const { updateCell } = useActions();

  useEffect(() => {
    // Debouncing - сработает спустя 750мс после окончания ввода кода
    const timer = setTimeout(async () => {
      const result = await bundle(cell.content);
      setBundled(result);
    }, 750);

    return () => clearTimeout(timer);
  }, [cell.content]);

  return (
    <Resizable direction="vertical" vertialHeight={280}>
      <div className="code-widget">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value: string) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview bundled={bundled}/>
      </div>
    </Resizable>
  );
};

export default CodeWidget;
