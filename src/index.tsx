import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const ref = useRef<esbuild.Service>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
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

  const onClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (!ref.current) {
      return;
    }
    const transformed = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });
    setSource(transformed.code);

    const builded = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    setCode(builded.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '100%', height: '180px' }}
      />
      <div>
        <button type="submit" onClick={onClick}>Convert & Run</button>
      </div>
      <pre>{source}</pre>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
