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
    font-size: 13px;
    white-space: pre-wrap;       
    white-space: -moz-pre-wrap; 
    white-space: -o-pre-wrap;
    word-wrap: break-word;
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
  .tablinks {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
  }
  .tablinks button {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    line-height: 26px;
    padding: 0 10px;
    transition: 0.3s;
  }
  .tablinks button:hover {
    background-color: #ddd;
  }
  .tablinks button.active {
    background-color: #ccc;
  }  
  .tabcontent {
    display: none;
    padding: 6px 12px 34px;
    border-top: none;
  }
  
  /* console logger */
  #console-counter {
    background: white;
    padding: 3px 7px;
    border-radius: 50%;
    font-size: 12px;
    line-height: 12px;
    border: 1px solid #999;
    color: #666;
    font-weight: bold;
    display: none;
  }
  .log-warn { color: orange }
  .log-error { color: red }
  .log-info { color: skyblue }
  .log-log { color: grey }
  .log-warn, .log-error { font-weight: bold; }
</style>
<script>
  let rootNode, consoleNode, consoleCounterNode, transpiledNode;
  let getConsoleCounter, resetConsoleCounter;
  // установка переключения вкладки
  function openTab(tabName) {
    const tablink = document.getElementsByClassName('tablink');
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    for (let i = 0; i < tablink.length; i++) {
      tablink[i].classList.remove('active');
    }
    document.getElementById(tabName).style.display = "block";
    document.querySelector('.tablink[data-tab="' + tabName + '"]').classList.add('active');
  }
  
  // функция переподключения консолек вывода
  function rewireConsole(containerNode, enableConsoleOutput = true) {
    let callCounter = 0;
    fixLoggingFunc('log');
    fixLoggingFunc('debug');
    fixLoggingFunc('warn');
    fixLoggingFunc('error');
    fixLoggingFunc('info');
  
    function fixLoggingFunc(name) {
      console['old' + name] = console[name];
      console[name] = function(...arguments) {
        const output = produceOutput(name, arguments);        
        containerNode.insertAdjacentHTML('beforeend', '<div>' + output + '</div>');
        containerNode.scrollIntoView(false);
        if (enableConsoleOutput) {
          console['old' + name].apply(undefined, arguments);
        }
      };
    }
  
    function produceOutput(name, args) {
      callCounter++;
      return args.reduce((output, arg) => {
        return output +
          '<span class="log-' + (typeof arg) + ' log-' + name + '">' +
          (typeof arg === 'object' && (JSON || {}).stringify ? JSON.stringify(arg) : arg) +
          '</span>&nbsp;';
      }, '');
    }
    
    return {
      getCounter: () => callCounter,
      resetCounter: () => { callCounter = 0 },
    }
  }

  // чтоб показывать ошибки в превьюхе
  const handleError = (err) => {
    const root = document.querySelector('#root');
    root.innerHTML = '<div class="err"><h3>Runtime error</h3>' + err.toString() + '</div>';
    console.error(err); // пробрасываем ошибку в консольку для деталки по ошибке
  }

  function registerIframeListener() {
    rootNode = document.querySelector('#root');
    consoleNode = document.querySelector('#console');
    consoleCounterNode = document.querySelector('#console-counter');
    transpiledNode = document.querySelector('#transpiled'); 
    
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
      try {
        // сбросы
        resetConsoleCounter();
        consoleNode.innerHTML = '';
        transpiledNode.innerHTML = transpiled;
        // безопасно выполняем eval, так как он в своей песочнице <iframe> без доступа на уровень выше
        eval(code);
        // обновляем счетчик консольных вызовов
        consoleCounterNode.innerHTML = getConsoleCounter();
        consoleCounterNode.style.display = 'inline-block';
      } catch (err) {
        handleError(err); // ловим синхронные ошибки
      }
    }, false);
  }
  
  // слушаем переключение вкладок
  document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('tablink')) {
      openTab(e.target.dataset.tab);
    }
  });
  
  // по готовности DOM: дефолтная вкладка и прокрутки
  document.addEventListener('DOMContentLoaded', e => {
    openTab('root');
    const {getCounter, resetCounter} = rewireConsole(document.getElementById('console'));
    getConsoleCounter = getCounter;
    resetConsoleCounter = resetCounter;
    registerIframeListener();
  });
</script>
</head>
<body>
  <div class="tablinks">
    <button class="tablink" data-tab="root">Preview</button>
    <button class="tablink" data-tab="transpiled">Transpiled ES6</button>
    <button class="tablink" data-tab="console">Console <span id="console-counter"></span></button>
  </div>
  <div class="tabcontents">
    <div class="tabcontent" id="root"></div>
    <pre class="tabcontent" id="transpiled"></pre>
    <pre class="tabcontent" id="console"></pre>
  </div>
</body>
</html>`;

export default Preview;
