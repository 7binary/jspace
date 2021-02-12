import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string): string =>
  useTypedSelector(state => {
    const { data, order } = state.cells;
    const orderedCells = order.map(id => data[id]);
    const showFuncNoop = 'var show = () => {};';
    const showFunc = `
      var show = (value) => {
        const root = document.querySelector('#root');
        if (typeof value === 'object') {
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

    for (let c of orderedCells) {
      if (c.type === 'code') {
        // что бы у каждой ячейки была своя версия функции show()
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        // если последняя строка только имя переменной - выводим ее значение на экран через show()
        let content = c.content;
        for (const varName of getVariableNames(c.content)) {
          const matcher = '\n' + varName;
          if (c.content.endsWith(matcher) || c.content.endsWith(`${matcher};`)) {
            const lastOccuredIndex = c.content.lastIndexOf(matcher);
            content = content.substr(0, lastOccuredIndex) + `\nshow(${varName});`;
            break;
          }
        }

        cumulativeCode.push(content);
      }
      if (c.id === cellId) {
        break;
      }
    }

    return cumulativeCode;
  }).join('\n');

const getVariableNames = (code: string): string[] => {
  // @ts-ignore
  return [...code.matchAll(/(var|const|let) ([a-zA-z$_]+)/g)].map(match => match[2]);
};
