import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import SuggestionBox from './components/SuggestionBox';
import ThemeToggle from './components/ThemeToggle';
import ResizeHandle from './components/ResizeHandle';
import { Play, Save, History, Maximize2, Minimize2, PanelLeft, PanelRight } from 'lucide-react';
import './App.css';

const App = () => {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      animation: slideIn 1s ease;
    }
    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    button {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.3s;
    }
    button:hover {
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ Welcome to CodePlay Editor ✨</h1>
    <div id="app"></div>
    <button onclick="alert('Hello from JavaScript!')">
      Click Me!
    </button>
  </div>
</body>
</html>`);

  const [css, setCss] = useState(`/* CSS Editor */
.container {
  text-align: center;
  padding: 20px;
}

button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.3s;
}

button:hover {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  h1 {
    font-size: 24px;
  }
}`);

  const [js, setJs] = useState(`// JavaScript Editor
console.log("Welcome to the code editor!");

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded!');
  
  // Example: Add dynamic greeting
  const app = document.getElementById('app');
  if (app) {
    const greeting = document.createElement('p');
    greeting.textContent = 'Hello from JavaScript!';
    greeting.style.fontSize = '20px';
    greeting.style.marginTop = '20px';
    app.appendChild(greeting);
  }
});`);

  const [theme, setTheme] = useState('vs-dark');
  const [savedCodes, setSavedCodes] = useState([]);
  const [output, setOutput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [editorSize, setEditorSize] = useState(55); // Percentage for editor width
  const [isDragging, setIsDragging] = useState(false);
  const [deviceMode, setDeviceMode] = useState('laptop'); // laptop, ipad, mobile
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [fullscreen, setfullscreen] = useState({})
  const [isdesktop, setisdesktop] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('savedCodes');
    if (saved) {
      setSavedCodes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    runCode();
  }, [html, css, js]);

  const runCode = () => {
    const combinedCode = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch(error) {
              console.error(error);
              document.body.innerHTML += '<p style="color: red; padding: 10px; background: rgba(255,0,0,0.1);">Error: ' + error.message + '</p>';
            }
          </script>
        </body>
      </html>
    `;
    setOutput(combinedCode);
  };

  const saveCode = () => {
    const newSave = {
      id: Date.now(),
      html,
      css,
      js,
      timestamp: new Date().toLocaleString()
    };
    const updatedSaves = [...savedCodes, newSave];
    setSavedCodes(updatedSaves);
    localStorage.setItem('savedCodes', JSON.stringify(updatedSaves));
    alert('Code saved successfully!');
  };

  const loadCode = (savedItem) => {
    setHtml(savedItem.html);
    setCss(savedItem.css);
    setJs(savedItem.js);
    setShowSaved(false);
  };

  const deleteCode = (id) => {
    const updatedSaves = savedCodes.filter(code => code.id !== id);
    setSavedCodes(updatedSaves);
    localStorage.setItem('savedCodes', JSON.stringify(updatedSaves));
  };

  const suggestions = {
    html: [
      'Add a responsive navigation bar',
      'Create a contact form',
      'Add an image gallery',
      'Create a pricing card',
      'Add a footer section',
      'Implement a hero section',
      'Add a video background'
    ],
    css: [
      'Add flexbox layout',
      'Create keyframe animations',
      'Make it responsive with media queries',
      'Add gradient backgrounds',
      'Style with glassmorphism',
      'Implement CSS grid',
      'Add hover effects'
    ],
    js: [
      'Add click event listeners',
      'Fetch data from API',
      'Form validation',
      'Toggle dark mode',
      'Create a counter',
      'Add smooth scroll',
      'Implement modal dialog'
    ]
  };

  const applySuggestion = (language, suggestion) => {
    if (language === 'html') {
      setHtml(html + `\n<!-- ${suggestion} -->\n<div class="suggestion-demo">${suggestion}</div>\n`);
    } else if (language === 'css') {
      setCss(css + `\n/* ${suggestion} */\n.suggestion-demo {\n  /* Add your styles here */\n}\n`);
    } else if (language === 'js') {
      setJs(js + `\n// ${suggestion}\nconsole.log("${suggestion}");\n`);
    }
    setShowSuggestions(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
        setfullscreen({top: "-80%",
          left: "-80%",
          transform: "rotate(0deg) scale(1) translateZ(-800px)",
          width: "260%",
          height: "260%"})
          
    }
    else{
          setfullscreen({})
      }
  };
  const setdesktop =()=>{
    //setDevicePreset('ipad')
    setisdesktop(!isdesktop)
    if (!isdesktop) {
      setfullscreen({top: "-20%",
          left: "-20%",
          transform: "rotate(0deg) scale(1) translateZ(-200px)",
          width: "140%",
          height: "140%"})
    }else{
      setfullscreen({})
    }
     
  }

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
    let editpanel = document.getElementById('editor-panel');
    if (!isPanelCollapsed) {
      if (window.innerWidth <= 546) {
        editpanel.style.height = '1500%'
      }
    }else{
      editpanel.style.height = '100%'
      if (window.innerWidth <= 546) {
        editpanel.style.height = '40%'
      }
    }
  };

  

  const setDevicePreset = (mode) => {
    setDeviceMode(mode);
    switch(mode) {
      case 'mobile':
        setEditorSize(73);
        setIsPanelCollapsed(false);
        break;
      case 'ipad':
        setEditorSize(50);
        setIsPanelCollapsed(false);
        break;
      case 'laptop':
        setEditorSize(35);
        setIsPanelCollapsed(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`app ${isFullscreen ? 'fullscreen' : ''} ${theme === 'vs-dark' ? 'dark-theme' : 'light-theme'}`}>
      <header className="header">
        <div className="header-left">
          <h1 className="title">🚀 Finesse Editor</h1>
          <br />
          <br />
           {window.innerWidth > 764 ?
            <div className="device-presets">
            <button 
              className={`preset-btn ${deviceMode === 'laptop' ? 'active' : ''}`}
              onClick={() => setDevicePreset('laptop')}
              title="Laptop Layout"
            >
              💻
            </button>
            <button 
              className={`preset-btn ${deviceMode === 'ipad' ? 'active' : ''}`}
              onClick={() => setDevicePreset('ipad')}
              title="iPad Layout"
            >
              📱
            </button>
            <button 
              className={`preset-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setDevicePreset('mobile')}
              title="Mobile Layout"
            >
              📲
            </button>
          </div>: 
           <div className="device-presets">
         <button className="icon-btn" onClick={toggleFullscreen}>
          🖥️
            {/* {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />} */}
          </button>

            <button 
              className={`preset-btn ${deviceMode === 'ipad' ? 'active' : ''}`}
              onClick={() => setdesktop()}
              title="iPad Layout"
            >
              📱
            </button>
           </div>
          
          }
        </div>
        <div className="header-right">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button className="icon-btn" onClick={togglePanel}>
            {isPanelCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
          </button>
          <button className="run-btn" onClick={runCode}>
            <Play size={20} /> Run
          </button>
          <button className="save-btn" onClick={saveCode}>
            <Save size={20} /> Save
          </button>
          <button className="icon-btn" onClick={() => setShowSaved(!showSaved)}>
            <History size={20} />
          </button>
          <button className="icon-btn suggestion-btn" onClick={() => setShowSuggestions(!showSuggestions)}>
            💡
          </button>
        </div>
      </header>

      <div className="main-container">
        <div 
          className="resize-container"
          style={{ 
            '--editor-size': `${editorSize}%`,
            '--output-size': `${100 - editorSize}%`
          }}
        >
          {/* Editors Panel */}
          <div className={`editors-panel ${isPanelCollapsed ? 'collapsed' : ''}`}>
            <div className="editor-tabs">
              <button 
                className={`tab ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button 
                className={`tab ${activeTab === 'css' ? 'active' : ''}`}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
              <button 
                className={`tab ${activeTab === 'js' ? 'active' : ''}`}
                onClick={() => setActiveTab('js')}
              >
                JavaScript
              </button>
            </div>
            <div className="editor-content">
              {activeTab === 'html' && (
                <CodeEditor
                  language="html"
                  value={html}
                  onChange={setHtml}
                  theme={theme}
                />
              )}
              {activeTab === 'css' && (
                <CodeEditor
                  language="css"
                  value={css}
                  onChange={setCss}
                  theme={theme}
                />
              )}
              {activeTab === 'js' && (
                <CodeEditor
                  language="javascript"
                  value={js}
                  onChange={setJs}
                  theme={theme}
                />
              )}
            </div>
          </div>



          {/* Output Panel */}
          <div className={`output-panel ${isPanelCollapsed ? 'expanded' : ''}`} id='editor-panel'>
            <Output output={output} setscreen={fullscreen}/>
          </div>
        </div>
      </div>

      {showSuggestions && (
        <SuggestionBox
          suggestions={suggestions}
          onApplySuggestion={applySuggestion}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {showSaved && (
        <div className="modal-overlay" onClick={() => setShowSaved(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Saved Codes</h3>
              <button className="close-btn" onClick={() => setShowSaved(false)}>×</button>
            </div>
            <div className="saved-list">
              {savedCodes.length === 0 ? (
                <p className="no-saved">No saved codes yet</p>
              ) : (
                savedCodes.map((code) => (
                  <div key={code.id} className="saved-item">
                    <span className="saved-time">{code.timestamp}</span>
                    <div className="saved-actions">
                      <button className="load-btn" onClick={() => loadCode(code)}>Load</button>
                      <button className="delete-btn" onClick={() => deleteCode(code.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;