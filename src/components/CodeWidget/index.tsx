import { useEffect, useState } from 'react';
import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import bundle, { BundledResut } from '../../bundler';
import Resizable from '../Resizable';

import './code-widget.css';

const initialCode =
  `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1 style={{textAlign:'center'}}>Hello</h1>;
ReactDOM.render(<App/>, document.querySelector('#root'));
`;

const CodeWidget = () => {
  const [input, setInput] = useState(initialCode);
  const [bundled, setBundled] = useState<BundledResut>({ transpiled: '', code: '', error: null });

  useEffect(() => {
    // Debouncing - сработает спустя 750мс после окончания ввода кода
    const timer = setTimeout(async () => {
      const result = await bundle(input);
      setBundled(result);
    }, 750);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <Resizable direction="vertical" vertialHeight={280}>
      <div className="code-widget">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={initialCode}
            onChange={(editorCode: string) => setInput(editorCode)}
          />
        </Resizable>
        <Preview bundled={bundled}/>
      </div>
    </Resizable>
  );
};

export default CodeWidget;
