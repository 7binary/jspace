import { useEffect, useRef } from 'react';
import './preview.css';
import { BundledResut } from 'src/bundler';

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
        sandbox="allow-scripts allow-modals"
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
  /* console logger */
  #log-container { overflow: auto; height: 150px; }
  .log-warn { color: orange }
  .log-error { color: red }
  .log-info { color: skyblue }
  .log-log { color: silver }
  .log-warn, .log-error { font-weight: bold; }
</style>
<script>
  // чтоб был console вывод в превьюхе
  rewireLoggingToElement(
    () => document.getElementById('log'),
    () => document.getElementById('log-container'), true);
  
  function rewireLoggingToElement(eleLocator, eleOverflowLocator, autoScroll) {
    fixLoggingFunc('log');
    fixLoggingFunc('debug');
    fixLoggingFunc('warn');
    fixLoggingFunc('error');
    fixLoggingFunc('info');
  
    function fixLoggingFunc(name) {
      console['old' + name] = console[name];
      console[name] = function(...arguments) {
        const output = produceOutput(name, arguments);
        const eleLog = eleLocator();
  
        if (autoScroll) {
          const eleContainerLog = eleOverflowLocator();
          const isScrolledToBottom = eleContainerLog.scrollHeight - eleContainerLog.clientHeight <= eleContainerLog.scrollTop + 1;
          eleLog.innerHTML += output + '<br>';
          if (isScrolledToBottom) {
            eleContainerLog.scrollTop = eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
          }
        } else {
          eleLog.innerHTML += output + '<br>';
        }
  
        console['old' + name].apply(undefined, arguments);
      };
    }
  
    function produceOutput(name, args) {
      return args.reduce((output, arg) => {
        return output +
          '<span class="log-' + (typeof arg) + ' log-' + name + '">' +
          (typeof arg === 'object' && (JSON || {}).stringify ? JSON.stringify(arg) : arg) +
          '</span>&nbsp;';
      }, '');
    }
  }

  // чтоб показывать ошибки в превьюхе
  const handleError = (err) => {
    const root = document.querySelector('#root');
    root.innerHTML = '<div class="err"><h3>Runtime error</h3>' + err.toString() + '</div>';
    console.error(err); // пробрасываем ошибку в консольку для деталки по ошибке
  }

  window.addEventListener('message', (event) => {
    const [code, transpiled, error] = event.data.split('@*@');
    
    if (error && error.length > 0) {
       return handleError(error);
    }

    document.body.innerHTML = '<div id="root"></div>'
      + '<div id="log-container"><pre id="log"></pre></div>'
      + '<div id="transpiled-container><pre id="transpiled"></pre></div>';
    
    // ловим асинхронные ошибки
    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });
    
    try {
      // безопасно выполняем eval, так как он в своей песочнице <iframe> без доступа на уровень выше
      eval(code);
      // отобразим транспиляцию в ES6 код
      if (transpiled.length > 0) {
        document.querySelector('#transpiled').innerHTML = transpiled;
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
