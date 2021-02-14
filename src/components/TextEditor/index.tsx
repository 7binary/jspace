import MDEditor from '@uiw/react-md-editor';
import { useEffect, useRef, useState } from 'react';
import './text-editor.css';
import { Cell } from '../../state';
import { useActions } from '../../hooks/use-actions';
import { useMediaQuery } from '../../hooks/use-media-query';

const TextEditor: React.FC<{cell: Cell}> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && event.target && ref.current?.contains(event.target as Node)) {
        console.log('el inside editor');
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => document.removeEventListener('click', listener, { capture: true });
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || '')}
          preview={isSmallScreen ? 'edit' : 'live'}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || 'Click to edit!'}/>
      </div>
    </div>
  );
};

export default TextEditor;
