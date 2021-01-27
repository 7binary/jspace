import { useEffect, useRef } from 'react';
import './preview.css';

interface Props {
  code: string;
  transpiled: string;
}

const Preview: React.FC<Props> = ({ code, transpiled }) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // iframe.current!.srcdoc = html;
    iframe.current?.contentWindow?.postMessage(code + '@*@' + transpiled, '*');
  }, [code, transpiled]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Sandbox"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
      />
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
  }
  pre {
    background-color: beige;
    padding: 4px 8px;
    font-size: 12px;
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
  }
  .err {
    color: red;
  }
</style>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('message', (event) => {
      const [code, transpiled] = event.data.split('@*@');
      console.log(code, transpiled);
      console.log('=> IFRAME GOT EVENT WITH CODE LENGTH: ', code.length);
      document.body.innerHTML = '<div id="root"></div>';
      const root = document.querySelector('#root');
      
      try {
        // безопасно выполняем eval, так как он в своей песочнице <iframe> без доступа на уровень выше
        eval(code);
        // если нечего показывать, то отобразим транспиляцию в ES6 код
        if (root.innerHTML === '' && transpiled.length) {
          root.innerHTML = '<pre><b>Transpiled to ES2015</b><hr/>$1</pre>'.replace('$1', transpiled);
        }
      } catch (err) {
        const root = document.querySelector('#root');
        root.innerHTML = '<div class="err"><h3>Runtime error</h3>' + err.toString() + '</div>';
        // пробрасываем ошибку в консольку для деталки
        throw err;
      }
    }, false);
  });
</script>
</head>
<body>
</body>
</html>`;

export default Preview;
