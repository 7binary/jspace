import { Cell } from '../../state';
import CodeWidget from '../CodeWidget';
import TextEditor from '../TextEditor';
import CellActionBar from '../CellActionBar';
import './cell-list-item.css';

const CellListItem: React.FC<{cell: Cell}> = ({ cell }) => {
  const child = cell.type === 'code' ? <CodeWidget cell={cell}/> : <TextEditor cell={cell}/>;

  return (
    <div className="cell-list-item">
      <div className={`cell-${cell.type}`}>
        <div className="action-bar-wrapper">
          <CellActionBar id={cell.id}/>
        </div>
        {child}
      </div>
    </div>
  );
};

export default CellListItem;
