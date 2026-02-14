import React from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ language, value, onChange, theme }) => {
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  const getLanguage = () => {
    switch(language) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'html';
    }
  };

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        width="100%"
        language={getLanguage()}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          tabSize: 2,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
          autoIndent: 'full',
          folding: true,
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoSurround: 'languageDefined',
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          snippetSuggestions: 'inline',
        }}
      />
    </div>
  );
};

export default CodeEditor;