import { useRef } from 'react';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import Highlighter from 'monaco-jsx-highlighter';
import codeshift from 'jscodeshift';

import './code-editor.css';
import './syntax.css';

interface Props {
  initialValue?: string;
  onChange: (value: string) => void;
  isSmallScreen?: boolean
}

const Index: React.FC<Props> = ({ initialValue, onChange, isSmallScreen = false }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    editor.getModel()?.updateOptions({ tabSize: 2 });
    editorRef.current = editor;
    // подсветка синтакса JSX, скрывая вывод ошибок в консольку
    const highlighter = new Highlighter(monaco, codeshift, editor);
    highlighter.highLightOnDidChangeModelContent(() => {}, () => {}, undefined, () => {});
  };

  const formatCode = () => {
    const unformatted = editorRef.current?.getValue();
    const formatted = prettier.format(unformatted as string, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/, '');
    editorRef.current?.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={formatCode}
      >Format @ Prettier</button>

      <MonacoEditor
        onMount={handleEditorDidMount}
        value={initialValue}
        language="javascript"
        theme="vs-dark"
        height={isSmallScreen ? '200px' : '100%'}
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: isSmallScreen ? 13 : 16,
          scrollBeyondLastLine: true,
          automaticLayout: true,
        }}
      />
    </div>);
};

export default Index;
