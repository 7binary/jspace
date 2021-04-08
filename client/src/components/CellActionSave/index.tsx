import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Cell } from '../../state';
import { ax } from '../../utils/ax';
import { useClipboard } from '../../hooks';
import './cell-action-save.css';

const CellActionSave: React.FC<{cell: Cell}> = ({ cell }) => {
  const [link, setLink] = useState('');
  const { handleCopy } = useClipboard();

  const share = async () => {
    const res = await ax().post<{cell: Cell}>('api/cells', cell);
    const cellUrl = process.env.REACT_APP_BASE_URL + '/' + res.data.cell.uuid + '/';
    setLink(cellUrl);
    if (handleCopy(cellUrl)) {
      toast(`Скопировано в буфер: ${cellUrl}`);
    }
  };

  return (
    <>
      <div className="action-save">
        <button className="button is-primary is-small" onClick={share}>
        <span className="icon">
          <i className="fas fa-upload"/>
        </span>
          <span>Share Link</span>
        </button>
        <span className="action-link">{link}</span>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3500}
      />
    </>
  );
};

export default CellActionSave;
