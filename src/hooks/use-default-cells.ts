import { useEffect } from 'react';
import { useActions } from './use-actions';
import { useTypedSelector } from './use-typed-selector';

export const useDefaultCells = () => {
  const cellsCount = useTypedSelector(state => state.cells.order.length);
  const { insertCellAfter } = useActions();

  useEffect(() => {
    if (cellsCount === 0) {
      // add default JavaScript cell
      insertCellAfter(null, 'code', `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1 style={{textAlign:'center'}}>Hello</h1>;
ReactDOM.render(<App/>, document.querySelector('#root'));`);

      // add default MarkDown cell
      insertCellAfter(null, 'text', `# Click to edit!
- Mark Down
- Syntax`);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
