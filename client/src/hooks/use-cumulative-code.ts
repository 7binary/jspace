import { Cell } from '../state';

export const useCumulativeCode = (cell: Cell): string => {
  if (cell.type !== 'code') {
    return '';
  }
  const showFunc = `
    var show = (value) => {
      const root = document.querySelector('#root');
      if (value && typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _ReactDOM.render(value, root);
        } else {
          root.innerHTML = JSON.stringify(value);
        }
      } else {
        root.innerHTML = value;
      }
    }`;
  const cumulativeCode = [`
      import _React from 'react';
      import _ReactDOM from 'react-dom';
    `];

  cumulativeCode.push(showFunc);
  let content = cell.content;

  // если последняя строка только имя переменной или вызов функции - покажем через show()
  for (const varName of getVariableNames(cell.content)) {
    let lastLine = cell.content.split('\n').pop();
    if (!lastLine) {
      break;
    }
    if (lastLine.endsWith(';')) {
      lastLine = lastLine.slice(0, -1);
    }
    const regex = new RegExp(`^${varName}(.+)$`, 'g');
    if (lastLine === varName || lastLine.match(regex)) {
      const lines = cell.content.split('\n');
      lines.pop();
      lines.push(`show( ${lastLine} );`);
      content = lines.join('\n');
    }
  }
  cumulativeCode.push(content);

  return cumulativeCode.join('\n');
};

const getVariableNames = (code: string): string[] => {
  // @ts-ignore
  return [...code.matchAll(/(var|const|let|function) ([a-zA-Z$_]+)/g)].map(match => match[2]);
};
