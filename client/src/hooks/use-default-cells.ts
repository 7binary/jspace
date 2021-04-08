import { useEffect } from 'react';
import { useActions } from './use-actions';
import { useTypedSelector } from './use-typed-selector';
import { ax } from '../utils/ax';
import { Cell } from '../state';

export const useDefaultCells = () => {
  const cells = useTypedSelector(state => state.cells.data);
  const cellsCount = useTypedSelector(state => state.cells.order.length);
  const { insertCellAfter } = useActions();

  useEffect(() => {
    const path = window.location.pathname;
    // check uuid
    if (path && path.length >= 7) {
      const uuid = path.replace(/^\/|\/$/g, '');
      ax().get<{cell: Cell}>(`/api/cells/${uuid}`)
        .then(res => {
          const { cell } = res.data;
          if (!cells[cell.uuid!]) {
            insertCellAfter(cell.uuid!, cell.type, cell.content);
          }
        });
    } else if (cellsCount === 0) {
      // add default MarkDown cell
      insertCellAfter(null, 'text', `# Click to edit!
- Mark Down
- Syntax`);
      // add default JavaScript cell
      insertCellAfter(null, 'code', `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1 style={{textAlign:'center'}}>Hello</h1>;
ReactDOM.render(<App/>, document.querySelector('#root'));`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
