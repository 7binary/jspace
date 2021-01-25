import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/CodeEditor';

const App = () => {
  const ref = useRef<esbuild.Service>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.34/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    iframe.current.srcdoc = html;
    const transformed = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });
    setSource(transformed.code);

    const builded = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input, true)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    iframe.current?.contentWindow?.postMessage(builded.outputFiles[0].text, '*');
  };

  const html = `
<html>
<head></head>
<body>
<div id="root"></div>

<script>
  window.addEventListener('message', (event) => {
    console.log(event.data);
    try {
      eval(event.data);
    } catch (err) {
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color:red"><h4>Runtime error</h4>' + err.toString() + '</div>';
      throw err;
    }
  }, false);
</script>
</body>
</html>`;

  return (
    <div>
      <CodeEditor
        initialValue="const App = () => {
  return (
    <button onClick={() => console.log(1)}>Click me </button>
  );
}"
        onChange={(value: string) => console.log(value)}
      />
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '100%', height: '180px' }}
      />
      <div>
        <button type="submit" onClick={onClick}>Convert & Run</button>
      </div>

      <h5>Transpiled:</h5>
      <pre>{source}</pre>

      <h5>Sandbox</h5>
      <iframe title="Sandbox" ref={iframe} srcDoc={html} sandbox="allow-scripts"/>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
