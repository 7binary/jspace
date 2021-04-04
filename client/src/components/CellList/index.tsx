import { Fragment } from 'react';
import { useTypedSelector, useDefaultCells } from 'src/hooks';
import CellListItem from 'src/components/CellListItem';
import AddCell from 'src/components/AddCell';
import './cell-list.css';

const CellList: React.FC = () => {
  useDefaultCells();
  const cells = useTypedSelector(({ cells }) => cells.order.map(id => cells.data[id]));

  const renderedCells = cells.map(cell => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell}/>
      <AddCell prevCellId={cell.id}/>
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell prevCellId={null} forceVisible={true}/>
      {renderedCells}
    </div>
  );
};

export default CellList;
