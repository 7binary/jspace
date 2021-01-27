import { useEffect, useState } from 'react';
import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import bundle from '../../bundler';
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
  const [code, setCode] = useState('');
  const [transpiled, setTranspiled] = useState('');

  useEffect(() => {
    // Debouncing - сработает спустя 750мс после окончания ввода кода
    const timer = setTimeout(async () => {
      const { transformed, builded } = await bundle(input);
      setTranspiled(transformed);
      setCode(builded);
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
        <Preview code={code} transpiled={transpiled}/>
      </div>
    </Resizable>
  );
};

export default CodeWidget;
