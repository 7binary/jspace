import { Fragment } from 'react';
import { useTypedSelector } from 'hooks';
import CellListItem from 'components/CellListItem';
import AddCell from 'components/AddCell';
import './cell-list.css';

const CellList: React.FC = () => {
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
