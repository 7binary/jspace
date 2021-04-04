import { Cell } from 'src/state';
import CodeWidget from 'src/components/CodeWidget';
import TextEditor from 'src/components/TextEditor';
import CellActionBar from 'src/components/CellActionBar';
import './cell-list-item.css';
import CellActionSave from '../CellActionSave';

const CellListItem: React.FC<{cell: Cell}> = ({ cell }) => {
  const child = cell.type === 'code' ? <CodeWidget cell={cell}/> : <TextEditor cell={cell}/>;

  return (
    <div className="cell-list-item">
      <div className={`cell-${cell.type}`}>
        <div className="action-bar-wrapper">
          <CellActionSave cell={cell}/>
          <CellActionBar id={cell.id}/>
        </div>
        {child}
      </div>
    </div>
  );
};

export default CellListItem;
