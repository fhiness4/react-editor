// git remote add origin https://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@github.com/fhiness4/Auth.git
import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import AceEditor from 'react-ace';
import './CodeEditor.css';

// Import Ace modes (languages)
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-python';

// Import Ace themes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-solarized_dark';

// Import Ace extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

const CodeEditor = ({ 
  language = 'html', 
  value = '', 
  onChange, 
  theme = 'vs-dark',
  readOnly = false,
  fontSize = 14,
  showLineNumbers = true,
  wordWrap = 'on',
  tabSize = 2,
  fileName = 'devio file',
  onSave,
  onRun,
  onFormat,
  autoSave = false,
  autoSaveDelay = 3000
}) => {
  const [editorValue, setEditorValue] = useState(value);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ row: 1, col: 1 });
  const [localSettings, setLocalSettings] = useState({
    fontSize,
    wordWrap,
    tabSize,
    showLineNumbers,
    enableMinimap: true,
    autoSave
  });
  
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const isInternalChange = useRef(false);

  // Update internal state when prop changes
  useEffect(() => {
    if (!isInternalChange.current) {
      setEditorValue(value);
    }
    isInternalChange.current = false;
  }, [value]);

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close settings
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target) && 
          !event.target.closest('.settings-btn')) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (localSettings.autoSave && editorValue) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        if (onSave) {
          onSave(editorValue);
        }
      }, autoSaveDelay);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [editorValue, localSettings.autoSave, autoSaveDelay, onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      if (e.shiftKey && e.altKey && e.key === 'f') {
        e.preventDefault();
        handleFormat();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
      
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorValue]);

  // Fixed onChange handler
  const handleEditorChange = (newValue) => {
    // Update local state
    setEditorValue(newValue);
    
    // Mark as internal change to prevent prop update loop
    isInternalChange.current = true;
    
    // Call parent onChange with the new value
    if (onChange) {
      onChange(newValue);
    }
  };

  // Monaco specific change handler
  const handleMonacoChange = (newValue, event) => {
    handleEditorChange(newValue);
  };

  // Ace specific change handler - FIXED VERSION
  const handleAceChange = (newValue) => {
    // Ace Editor passes the new value directly as first argument
    handleEditorChange(newValue);
  };

  const handleMonacoEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ row: e.position.lineNumber, col: e.position.column });
    });

    editor.focus();
  };

  const handleAceEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Set up cursor tracking
    editor.selection.on('changeCursor', () => {
      const position = editor.getCursorPosition();
      setCursorPosition({ row: position.row + 1, col: position.column + 1 });
    });

    // Set up change event listener directly on the editor
    editor.on('change', (delta) => {
      const newValue = editor.getValue();
      handleEditorChange(newValue);
    });

    editor.focus();
    editor.setReadOnly(readOnly);
    
    // Ensure textarea is focusable
    if (editor.renderer.textarea) {
      editor.renderer.textarea.focus();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editorValue);
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun(editorValue);
    }
  };

  const handleFormat = () => {
    if (onFormat) {
      onFormat(editorValue);
    }
  };

  const handleDownload = () => {
    const extension = language === 'javascript' ? 'js' : 
                     language === 'css' ? 'css' : 
                     language === 'html' ? 'html' : 
                     language === 'json' ? 'json' : 
                     language === 'markdown' ? 'md' : 'txt';
    
    const blob = new Blob([editorValue], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getAceTheme = () => {
    const themeMap = {
      'vs-dark': 'monokai',
      'light': 'github',
      'dracula': 'dracula',
      'solarized-dark': 'solarized_dark'
    };
    return themeMap[theme] || 'github';
  };

  const getAceMode = () => {
    const modeMap = {
      'html': 'html',
      'css': 'css',
      'javascript': 'javascript',
      'json': 'json',
      'markdown': 'markdown',
      'python': 'python'
    };
    return modeMap[language] || 'html';
  };

  return (
    <div 
      ref={containerRef} 
      className={`code-editor-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <span className="file-name" title={fileName} hidden>
            {fileName}
          </span>
          
          {onRun && (
            <button onClick={handleRun} className="toolbar-btn run-btn" title="Run (Ctrl+Enter)">
              ▶ Run
            </button>
          )}
          
          {onFormat && (
            <button onClick={handleFormat} className="toolbar-btn" title="Format (Shift+Alt+F)">
              ✨ Format
            </button>
          )}
          
          {onSave && (
            <button onClick={handleSave} className="toolbar-btn" title="Save (Ctrl+S)">
              💾 Save
            </button>
          )}
        </div>
        
        <div className="toolbar-right">
          <button onClick={handleCopy} className="toolbar-btn" title="Copy to clipboard">
            {copied ? '✓' : '📋'} 
          </button>
          
          <button onClick={handleDownload} className="toolbar-btn" title="Download file">
            ⬇️ 
          </button>
          
          <button 
            onClick={toggleSettings} 
            className={`toolbar-btn settings-btn ${isSettingsOpen ? 'active' : ''}`}
            title="Settings"
          >
            ⚙️ 
          </button>
          
          <button onClick={toggleFullscreen} className="toolbar-btn" title="Fullscreen (F11)">
            {isFullscreen ? '↙' : '↗'} Fullscreen
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div ref={settingsRef} className="settings-panel">
          <div className="settings-header">
            <h4>Editor Settings</h4>
            <button onClick={() => setIsSettingsOpen(false)} className="close-btn">×</button>
          </div>
          <div className="settings-content">
            <label>
              <span>Font Size: {localSettings.fontSize}px</span>
              <input
                type="range"
                min="10"
                max="24"
                value={localSettings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              />
            </label>
            
            <label>
              <span>Tab Size</span>
              <select
                value={localSettings.tabSize}
                onChange={(e) => updateSetting('tabSize', parseInt(e.target.value))}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.wordWrap === 'on'}
                onChange={(e) => updateSetting('wordWrap', e.target.checked ? 'on' : 'off')}
              />
              <span>Word Wrap</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.showLineNumbers}
                onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
              />
              <span>Show Line Numbers</span>
            </label>
            
            {!isMobile && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localSettings.enableMinimap}
                  onChange={(e) => updateSetting('enableMinimap', e.target.checked)}
                />
                <span>Show Minimap</span>
              </label>
            )}
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={localSettings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
              />
              <span>Auto Save ({autoSaveDelay/1000}s)</span>
            </label>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="editor-wrapper">
        {!isMobile ? (
          <MonacoEditor
            height="100%"
            width="100%"
            language={language}
            value={editorValue}
            theme={theme}
            onChange={handleMonacoChange}
            onMount={handleMonacoEditorDidMount}
            options={{
              minimap: { enabled: localSettings.enableMinimap },
              fontSize: localSettings.fontSize,
              wordWrap: localSettings.wordWrap,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: localSettings.showLineNumbers ? 'on' : 'off',
              tabSize: localSettings.tabSize,
              readOnly: readOnly,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              folding: true,
              bracketPairColorization: { enabled: true },
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              renderWhitespace: 'selection',
              smoothScrolling: true,
              cursorBlinking: 'blink',
              cursorStyle: 'line',
              dragAndDrop: true,
            }}
          />
        ) : (
          <AceEditor
            mode={getAceMode()}
            theme={getAceTheme()}
            name={`ace-editor-${language}`}
            value={editorValue}
            onChange={handleAceChange}
            onLoad={handleAceEditorDidMount}
            width="100%"
            height="100%"
            fontSize={localSettings.fontSize}
            showPrintMargin={false}
            showGutter={localSettings.showLineNumbers}
            highlightActiveLine={true}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            debounceChangePeriod={250}
            wrapEnabled={localSettings.wordWrap === 'on'}
            readOnly={readOnly}
            editorProps={{
              $blockScrolling: Infinity
            }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: localSettings.showLineNumbers,
              tabSize: localSettings.tabSize,
              useWorker: false,
              wrap: localSettings.wordWrap === 'on',
              behavioursEnabled: true,
              autoCloseTags: true,
              enableMultiselect: true,
              enableEmmet: true,
              animatedScroll: false
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="editor-statusbar">
        <div className="status-left">
          <span>Ln {cursorPosition.row}, Col {cursorPosition.col}</span>
          <span className="language-badge">{language.toUpperCase()}</span>
        </div>
        <div className="status-right">
          {localSettings.autoSave && <span className="status-item">💾 Auto-save</span>}
          {readOnly && <span className="status-item">🔒 Read-only</span>}
          <span className="status-item">
            {isMobile ? '📱 Mobile' : '💻 Desktop'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;