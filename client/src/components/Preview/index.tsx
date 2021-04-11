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
  
  /* error */
  .err {
    padding: 10px 15px 15px;
    color: maroon;
    background-color: beige;
  }
  .err h3 {
    margin-top: 0;
  }
  
  /* tabs */
  .tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
  }
  .tab button {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 14px 16px;
    transition: 0.3s;
  }
  /* Change background color of buttons on hover */
  .tab button:hover {
    background-color: #ddd;
  }
  /* Create an active/current tablink class */
  .tab button.active {
    background-color: #ccc;
  }
  
  /* Style the tab content */
  .tabcontent {
    display: none;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-top: none;
  }
  
  /* console logger */
  #console { overflow: auto; height: 150px; }
  .log-warn { color: orange }
  .log-error { color: red }
  .log-info { color: skyblue }
  .log-log { color: grey }
  .log-warn, .log-error { font-weight: bold; }
</style>
<script>
  // установка переключения вкладки
  function openTab(tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove('active');
    }
    document.getElementById(tabName).style.display = "block";
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
  }
  
  // функция переподключения консолек вывода
  function rewireLoggingToElement(containerNode, enableConsole) {
    fixLoggingFunc('log');
    fixLoggingFunc('debug');
    fixLoggingFunc('warn');
    fixLoggingFunc('error');
    fixLoggingFunc('info');
  
    function fixLoggingFunc(name) {
      console['old' + name] = console[name];
      console[name] = function(...arguments) {
        const output = produceOutput(name, arguments);        
        containerNode.insertAdjacentHTML('afterbegin', '<div>' + output + '</div>');
        if (enableConsole) {
          console['old' + name].apply(undefined, arguments);
        }
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
    // ловим асинхронные ошибки
    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });
    //document.getElementById('root').innerHTML = '';
    try {
      // безопасно выполняем eval, так как он в своей песочнице <iframe> без доступа на уровень выше
      eval(code);
      // отобразим транспиляцию в ES6 код
      document.querySelector('#transpiled').innerHTML = transpiled;
    } catch (err) {
      handleError(err); // ловим синхронные ошибки
    }
  }, false);
  
  // слушаем переключение вкладок
  document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('tablinks')) {
      openTab(e.target.dataset.tab);
    }
  });
  
  // по готовности DOM: дефолтная вкладка и прокрутки
  document.addEventListener('DOMContentLoaded', e => {
    openTab('root');
    rewireLoggingToElement(document.getElementById('console'), true);
  });
</script>
</head>
<body>
  <div class="tab">
    <button class="tablinks" data-tab="root">Preview</button>
    <button class="tablinks" data-tab="console">Console</button>
    <button class="tablinks" data-tab="transpiled">Transpiled ES6</button>
  </div>
  <div id="root" class="tabcontent"></div>
  <pre id="console" class="tabcontent"></pre>
  <pre id="transpiled" class="tabcontent"></pre>
</body>
</html>`;

export default Preview;
