import { useEffect, useRef } from 'react';
import './preview.css';
import { BundledResut } from '../../bundler';

interface Props {
  bundled?: BundledResut;
  loading?: boolean;
}

const Preview: React.FC<Props> = ({ bundled, loading }) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (bundled) {
      const { code, transpiled, error } = bundled;
      iframe.current?.contentWindow?.postMessage([code, transpiled, error].join('@*@'), '*');
    }
  }, [bundled]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Sandbox"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
      />
      {loading ? (
        <div className="progress-cover">
          <progress className="progress is-small is-primary" max="100">Loading</progress>
        </div>
      ) : null}
    </div>
  );
};

const html = `
<html>
<head>
<style>
  html { 
    background-color: white; 
  }
  html, body, pre {
    margin: 0;
    font-family: "Source Sans Pro", Arial, sans-serif;
    font-size: 15px;
  }
  pre {
    background-color: beige;
    padding: 4px 8px;
    font-size: 13px;
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
  }
  .err {
    padding: 10px 15px 15px;
    color: maroon;
    background-color: beige;
  }
  .err h3 {
    margin-top: 0;
  }
</style>
<script>
  const handleError = (err) => {
    const root = document.querySelector('#root');
    root.innerHTML = '<div class="err"><h3>Runtime error</h3>' + err.toString() + '</div>';
    console.error(err); // пробрасываем ошибку в консольку для деталки по ошибке
  }

  window.addEventListener('message', (event) => {
    const [code, transpiled, error] = event.data.split('@*@');
    // console.log('=> <iframe> for event with code length', code.length);
    
    if (error && error.length > 0) {
       return handleError(error);
    }

    document.body.innerHTML = '<div id="root"></div>';
    const root = document.querySelector('#root');
    
    // ловим асинхронные ошибки
    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });
    
    try {
      // безопасно выполняем eval, так как он в своей песочнице <iframe> без доступа на уровень выше
      eval(code);
      // если нечего показывать, то отобразим транспиляцию в ES6 код
      if (root.innerHTML === '' && transpiled.length) {
        root.innerHTML = '<pre><b>Transpiled to ES6</b><hr/>$1</pre>'.replace('$1', transpiled);
      }
    } catch (err) {
      // ловим синхронные ошибки
      handleError(err);
    }
  }, false);
</script>
</head>
<body>
  
</body>
</html>`;

export default Preview;
