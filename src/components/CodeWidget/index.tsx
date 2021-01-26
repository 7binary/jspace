import { useEffect, useState } from 'react';
import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import bundle from '../../bundler';

const initialCode =
  `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1>Hello</h1>;
ReactDOM.render(<App/>, document.querySelector('#root'))
`;

const CodeWidget = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [transpiled, setTranspiled] = useState('');

  useEffect(() => {
    setInput(initialCode);
  }, []);

  const onClick = async () => {
    const { transformed, builded } = await bundle(input);
    setTranspiled(transformed);
    setCode(builded);
  };

  return (
    <div>
      <CodeEditor
        initialValue={initialCode}
        onChange={(editorCode: string) => setInput(editorCode)}
      />
      <div>
        <button
          onClick={onClick}
          className="button button-run is-primary is-small"
        >Transpile & Run</button>
      </div>

      <h5>Transpiled:</h5>
      <pre>{transpiled}</pre>

      <h5>Sandbox</h5>
      <pre>
        <Preview code={code}/>
      </pre>
    </div>
  );
};

export default CodeWidget;
