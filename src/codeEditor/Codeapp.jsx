import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import Saving from './Savecode'
import Navbar from './components/navbar'
import SuggestionBox from './components/SuggestionBox';
import ThemeToggle from './components/ThemeToggle';
import ResizeHandle from './components/ResizeHandle';
import { Play, Save, History, Maximize2, Minimize2, PanelLeft, PanelRight } from 'lucide-react';
import './App.css';
import { useAuthStore } from "../store/authStore";

const url = 'https://auth-dusky-rho.vercel.app/api/auth'
import toast from "react-hot-toast";

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
    <h1>✨ Welcome to Finesse Devio editor ✨</h1>
    <div id="app"></div>
    <button onclick="alert('Hello from Devio!')">
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
console.log("Welcome to the Devio code editor!");

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
  const [editorSize, setEditorSize] = useState(2); // Percentage for editor width
  const [isDragging, setIsDragging] = useState(false);
  const [deviceMode, setDeviceMode] = useState('laptop'); // laptop, ipad, mobile
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [fullscreen, setfullscreen] = useState({})
  const [isdesktop, setisdesktop] = useState(false);
  const [isSaving, setIssaving] = useState(false)
  const [mobile, setIsmobile] = useState(false)
  const { user, data, logout, getuser, uploadimg , addcodes, codefiles} =
  useAuthStore();



function closesaving(){
  setIssaving(!isSaving)
}
  async function gethtml() {
  setShowSaved(!showSaved)
      const response = await
      fetch(`https://auth-dusky-rho.vercel.app/api/code/getuser-html?codeid=${user._id}`,{
      method: "GET",
        mode: "cors",
        headers:{
                "content-Type": "application/json"
            }
      });
      const res = await response.json();
      //setCss(res.data)
     setSavedCodes(res.data);
      
      
    const saved = localStorage.getItem('savedCodes');
  }
  
  
  
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
    setIssaving(true)
    
    //alert('Code saved successfully!');
  };

  const loadCode = (savedItem) => {
    setHtml(savedItem.html);
    setCss(savedItem.css);
    setJs(savedItem.js);
    setShowSaved(false);
  };

  const deleteCode = async (codeid, userid) => {
    try {
      setShowSaved(!showSaved)
      const urll = 'https://auth-dusky-rho.vercel.app'
      toast.success("deleting code....")
        const response = await fetch(
        `${urll}/api/code/delete-html?userId=${userid}&_id=${codeid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
      console.log(data)
      if (data.success) {
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
        
    } catch (error) {
        
        console.error('Error:', error);
        throw error;
    }
  };


  
  // suggestions
  const suggestions = {
    html: [
        { code: '<nav class="navbar">\n  <div class="logo">MySite</div>\n  <ul class="nav-links">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n  <div class="hamburger">☰</div>\n</nav>', desc: 'Add a responsive navigation bar' },
        
        { code: '<form class="contact-form">\n  <h2>Contact Us</h2>\n  <input type="text" placeholder="Your Name" required>\n  <input type="email" placeholder="Your Email" required>\n  <textarea placeholder="Your Message" rows="5" required></textarea>\n  <button type="submit">Send Message</button>\n</form>', desc: 'Create a contact form' },
        
        { code: '<div class="gallery">\n  <div class="gallery-item">\n    <img src="image1.jpg" alt="Description 1">\n  </div>\n  <div class="gallery-item">\n    <img src="image2.jpg" alt="Description 2">\n  </div>\n  <div class="gallery-item">\n    <img src="image3.jpg" alt="Description 3">\n  </div>\n</div>', desc: 'Add an image gallery' },
        
        { code: '<div class="pricing-card">\n  <h3>Premium Plan</h3>\n  <div class="price">$29<span>/month</span></div>\n  <ul class="features">\n    <li>✓ Feature 1</li>\n    <li>✓ Feature 2</li>\n    <li>✓ Feature 3</li>\n  </ul>\n  <button class="cta-button">Get Started</button>\n</div>', desc: 'Create a pricing card' },
        
        { code: '<footer class="footer">\n  <div class="footer-content">\n    <div class="footer-section">\n      <h4>About Us</h4>\n      <p>Company description here</p>\n    </div>\n    <div class="footer-section">\n      <h4>Quick Links</h4>\n      <ul>\n        <li><a href="#privacy">Privacy Policy</a></li>\n        <li><a href="#terms">Terms of Service</a></li>\n      </ul>\n    </div>\n    <div class="footer-section">\n      <h4>Follow Us</h4>\n      <div class="social-links">\n        <a href="#">FB</a>\n        <a href="#">TW</a>\n        <a href="#">IG</a>\n      </div>\n    </div>\n  </div>\n  <div class="footer-bottom">\n    <p>&copy; 2024 Your Company. All rights reserved.</p>\n  </div>\n</footer>', desc: 'Add a footer section' },
        
        { code: '<section class="hero">\n  <div class="hero-content">\n    <h1>Welcome to Our Website</h1>\n    <p>Discover amazing things with us</p>\n    <a href="#learn-more" class="hero-button">Learn More</a>\n  </div>\n</section>', desc: 'Implement a hero section' },
        
        { code: '<div class="video-background">\n  <video autoplay muted loop id="bg-video">\n    <source src="background-video.mp4" type="video/mp4">\n    Your browser does not support HTML5 video.\n  </video>\n  <div class="content-overlay">\n    <h1>Your Content Here</h1>\n  </div>\n</div>', desc: 'Add a video background' }
    ],
    
    css: [
        { code: '.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 20px;\n}', desc: 'Add flexbox layout' },
        
        { code: '@keyframes slideIn {\n  from {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n.animated-element {\n  animation: slideIn 1s ease-out;\n}', desc: 'Create keyframe animations' },
        
        { code: '@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n  \n  .nav-links {\n    display: none;\n  }\n  \n  .hamburger {\n    display: block;\n  }\n}\n\n@media (max-width: 480px) {\n  body {\n    font-size: 14px;\n  }\n}', desc: 'Make it responsive with media queries' },
        
        { code: '.gradient-bg {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}\n\n.radial-gradient {\n  background: radial-gradient(circle at center, #ff6b6b, #556270);\n}', desc: 'Add gradient backgrounds' },
        
        { code: '.glass-card {\n  background: rgba(255, 255, 255, 0.25);\n  backdrop-filter: blur(10px);\n  border-radius: 10px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\n}', desc: 'Style with glassmorphism' },
        
        { code: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  padding: 20px;\n}\n\n.grid-item {\n  background: #f5f5f5;\n  padding: 20px;\n  border-radius: 8px;\n}', desc: 'Implement CSS grid' },
        
        { code: '.button {\n  transition: all 0.3s ease;\n}\n\n.button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 5px 15px rgba(0,0,0,0.3);\n}\n\n.card:hover {\n  filter: brightness(1.1);\n  transform: scale(1.02);\n}', desc: 'Add hover effects' }
    ],
    
    js: [
        { code: 'document.querySelector(\'.myButton\').addEventListener(\'click\', function(e) {\n  e.preventDefault();\n  console.log(\'Button clicked!\');\n  this.classList.toggle(\'active\');\n});\n\n// Multiple elements\ndocument.querySelectorAll(\'.menu-item\').forEach(item => {\n  item.addEventListener(\'click\', function() {\n    alert(`Clicked: ${this.textContent}`);\n  });\n});', desc: 'Add click event listeners' },
        
        { code: 'async function fetchData() {\n  try {\n    const response = await fetch(\'https://api.example.com/data\');\n    const data = await response.json();\n    console.log(data);\n    displayData(data);\n  } catch (error) {\n    console.error(\'Error:\', error);\n  }\n}\n\nfunction displayData(data) {\n  const container = document.getElementById(\'data-container\');\n  container.innerHTML = data.map(item => `\n    <div class="item">${item.name}</div>\n  `).join(\'\');\n}', desc: 'Fetch data from API' },
        
        { code: 'document.getElementById(\'myForm\').addEventListener(\'submit\', function(e) {\n  e.preventDefault();\n  \n  const email = document.getElementById(\'email\').value;\n  const password = document.getElementById(\'password\').value;\n  const errors = [];\n\n  if (!isValidEmail(email)) {\n    errors.push(\'Please enter a valid email\');\n  }\n  \n  if (password.length < 8) {\n    errors.push(\'Password must be at least 8 characters\');\n  }\n\n  if (errors.length > 0) {\n    showErrors(errors);\n  } else {\n    this.submit();\n  }\n});\n\nfunction isValidEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}', desc: 'Form validation' },
        
        { code: 'const darkModeToggle = document.getElementById(\'darkModeToggle\');\n\ndarkModeToggle.addEventListener(\'click\', () => {\n  document.body.classList.toggle(\'dark-mode\');\n  \n  // Save preference\n  const isDarkMode = document.body.classList.contains(\'dark-mode\');\n  localStorage.setItem(\'darkMode\', isDarkMode);\n});\n\n// Load saved preference\nif (localStorage.getItem(\'darkMode\') === \'true\') {\n  document.body.classList.add(\'dark-mode\');\n}', desc: 'Toggle dark mode' },
        
        { code: 'class Counter {\n  constructor(initialValue = 0) {\n    this.count = initialValue;\n    this.updateDisplay();\n  }\n  \n  increment() {\n    this.count++;\n    this.updateDisplay();\n  }\n  \n  decrement() {\n    this.count--;\n    this.updateDisplay();\n  }\n  \n  reset() {\n    this.count = 0;\n    this.updateDisplay();\n  }\n  \n  updateDisplay() {\n    document.getElementById(\'counter\').textContent = this.count;\n  }\n}\n\nconst counter = new Counter();', desc: 'Create a counter' },
        
        { code: 'document.querySelectorAll(\'a[href^="#"]\').forEach(anchor => {\n  anchor.addEventListener(\'click\', function (e) {\n    e.preventDefault();\n    \n    const target = document.querySelector(this.getAttribute(\'href\'));\n    if (target) {\n      target.scrollIntoView({\n        behavior: \'smooth\',\n        block: \'start\'\n      });\n    }\n  });\n});', desc: 'Add smooth scroll' },
        
        { code: 'class Modal {\n  constructor() {\n    this.modal = document.getElementById(\'myModal\');\n    this.closeBtn = document.querySelector(\'.close\');\n    this.setupEventListeners();\n  }\n  \n  open() {\n    this.modal.style.display = \'block\';\n    document.body.style.overflow = \'hidden\';\n  }\n  \n  close() {\n    this.modal.style.display = \'none\';\n    document.body.style.overflow = \'auto\';\n  }\n  \n  setupEventListeners() {\n    this.closeBtn.addEventListener(\'click\', () => this.close());\n    \n    window.addEventListener(\'click\', (e) => {\n      if (e.target === this.modal) {\n        this.close();\n      }\n    });\n    \n    document.addEventListener(\'keydown\', (e) => {\n      if (e.key === \'Escape\' && this.modal.style.display === \'block\') {\n        this.close();\n      }\n    });\n  }\n}\n\nconst modal = new Modal();', desc: 'Implement modal dialog' }
    ]
};
  
  
  
  

  const applySuggestion = (language, suggestion) => {
    if (language === 'html') {
      setHtml(html + `${suggestion}`);
    } else if (language === 'css') {
      setCss(css + `${suggestion}`);
    } else if (language === 'js') {
      setJs(js + `${suggestion}`);
    }
    setShowSuggestions(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
        setfullscreen({top: "-100%",
          left: "-100%",
          transform: "rotate(0deg) scale(1) translateZ(-1000px)",
          width: "300%",
          height: "300%"})
          
    }
    else{
          setfullscreen({})
      }
  };
  const setdesktop =()=>{
    //setDevicePreset('ipad')
    setisdesktop(!isdesktop)
    if (!isdesktop) {
      setfullscreen({top: "-40%",
          left: "-40%",
          transform: "rotate(0deg) scale(1) translateZ(-400px)",
          width: "180%",
          height: "180%"})
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
    let editpanel = document.getElementById('editor-panel')
    setDeviceMode(mode);
    switch(mode) {
      case 'mobile':
        
        setEditorSize(3);
        setIsPanelCollapsed(false);
        break;
      case 'ipad':
        setEditorSize(2);
        setIsPanelCollapsed(false);
        break;
      case 'laptop':
        setEditorSize(1);
        setIsPanelCollapsed(false);
        break;
      default:
        break;
    }
  };

  return (
  
    
    <div className={`app ${isFullscreen ? 'fullscreen' : ''} ${theme === 'vs-dark' ? 'dark-theme' : 'light-theme'}`}>
    
      
      
      <header className="header bg-gradient-to-br from-gray-900 via-gray-900
      to-gray-800">
        <div className="header-left">
          <h3 className={"title"}>🚀 {user.name}</h3>
          {window.innerWidth > 764 &&
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
          </div>
          }
          
           {window.innerWidth < 764 &&
           <div className="device-presets">
         <button className="icon-btn" onClick={toggleFullscreen}>
          🖥️
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
          <button className="icon-btn" onClick={() => gethtml()}>
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
            '--editor-size': `${editorSize}`,
            '--output-size': `${4 - editorSize}`
          }}
        >
          {/* Editors Panel */}
          <div className={`editors-panel ${isPanelCollapsed ? 'collapsed' :''}
          `}
          id="panel"
   
      
          >
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
          <div className={`output-panel ${isPanelCollapsed ? 'expanded' : ''}`} 
          id='editor-panel'>
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
      
      {
        isSaving &&
          <Saving
          html={html}
          userId={user._id}
          css={css}
          js={js}
          onclose={closesaving}/>
        
      }

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
                savedCodes.map((code, i) => (
                  <div key={i} className="saved-item">
                    <span className="saved-time">{code.name}
                    </span>
                    <div className="saved-actions">
                      <button className="load-btn" onClick={() => loadCode(code)}>Load</button>
                      <button className="delete-btn" onClick={() =>
                      deleteCode(code._id, user._id)}>Delete</button>
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

