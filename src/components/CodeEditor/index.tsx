import './add-cell.scss';
import { useActions } from '../../hooks/use-actions';
import { useTypedSelector } from '../../hooks/use-typed-selector';

interface Props {
  prevCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<Props> = ({ prevCellId, forceVisible = false }) => {
  const { insertCellAfter } = useActions();
  const hasDefaultCode = useTypedSelector(state => {
    let found = false;
    Object.keys(state.cells.data).forEach(key => {
      if (state.cells.data[key].content.includes('const wakeUp =')) {
        found = true;
      }
    });
    return found;
  });

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
          onClick={() => insertCellAfter(prevCellId, 'code', hasDefaultCode ? '' : defaultCode)}
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

/* eslint-disable no-template-curly-in-string */
const defaultCode =
  'const person = \'Neo\';\n' +
  'const wakeUp = (name) => `Wake up, ${name}...`;\n' +
  'wakeUp(person)';

export default AddCell;
