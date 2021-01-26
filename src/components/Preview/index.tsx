import { useEffect, useRef } from 'react';

interface Props {
  code: string;
}

const html = `
<html>
<head>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('message', (event) => {
      console.log('>> IFRAME window.addEventListener("message") GOT CODE length', event.data.length);
      document.body.innerHTML = '<div id="root"></div>';
      // безопасно выполняем eval, так как он в своей песочнице <iframe> без доступа на уровень выше
      try {
        eval(event.data);
      } catch (err) {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color:orange"><h3>Runtime error</h3>' + err.toString() + '</div>';
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

const Preview: React.FC<Props> = ({ code }) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // iframe.current!.srcdoc = html;
    iframe.current?.contentWindow?.postMessage(code, '*');
  }, [code]);

  return (
    <iframe
      title="Sandbox"
      ref={iframe}
      srcDoc={html}
      sandbox="allow-scripts"
    />
  );
};

export default Preview;
