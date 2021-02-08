import './add-cell.scss';
import { useActions } from '../../hooks/use-actions';

interface Props {
  prevCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<Props> = ({ prevCellId, forceVisible = false }) => {
  const { insertCellAfter } = useActions();

  return (
    <div className={forceVisible ? 'add-cell add-cell--visible' : 'add-cell'}>
      <div className="add-cell__buttons">
        <button
          onClick={() => insertCellAfter(prevCellId, 'text')}
          className="add-cell__button button is-primary is-small"
        >
          <span className="icon is-small">
            <i className="fas fa-plus"/>
          </span>
          <span className="add-cell-text">Markdown text</span>
        </button>

        <button
          onClick={() => insertCellAfter(prevCellId, 'code')}
          className="add-cell__button button is-primary is-small"
        >
          <span className="icon is-small">
            <i className="fas fa-plus"/>
          </span>
          <span className="add-cell-text">Javascript code</span>
        </button>
      </div>
      <div className="add-cell__divider"/>
    </div>
  );
};

export default AddCell;
