import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import Avatar from "../appPages/component/avatar.jsx"
import Output from './components/Output';
import SuggestionBox from './components/SuggestionBox';
import ThemeToggle from './components/ThemeToggle';
import ResizeHandle from './components/ResizeHandle';
import NavDropdown from "../appPages/component/drop-down.jsx"
import {
  Save, History, PanelLeft, PanelRight,
  Monitor, Tablet, Smartphone, Lightbulb, Terminal, Eye,
  Download, Copy, CheckCircle, Loader
} from 'lucide-react';
import LoadingSpinner from "../components/LoadingSpinner";
import './Editor.css';
import { useAuthStore } from '../store/authStore';
const url = import.meta.env.VITE_API_URL;
import { useSearchParams } from 'react-router-dom';
import JSZip from 'jszip';

const NAV_PAGES = [
  { label: "Home",       icon: "⌂",  desc: "Back to landing page" , to : "/"     },
  { label: "Sign-up",  icon: "◈",  desc: "sign up to Devio"   , to: "/Signup" },
    { label: "Sign-in",   icon: "◉",  desc: "Sign in to Devio", to:"/login" },
  { label: "Editor",     icon: "⟨/⟩",desc: "Write & run code" ,  active: true  },
  { label: "Explore",    icon: "✦",  desc: "Browse the community", to:"/explore" },
];
/* ─── Responsive hook ────────────────────────────────────────────────────── */
function useIsMobile() {
  const [v, setV] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setV(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return v;
}

/* ─── Email Loading Component ────────────────────────────────────────────── */
const EmailLoadingOverlay = ({ email }) => {
  return (
    <div className="email-loading-overlay">
      <div className="email-loading-content">
        <Loader className="email-loading-spinner" size={40} />
        <h3>Loading your workspace</h3>
        <p>geting, @{email} code!</p>
        <div className="email-loading-progress">
          <div className="email-loading-bar"></div>
        </div>
        <span className="email-loading-text">Setting up your coding environment...</span>
      </div>
    </div>
  );
};

/* ─── App ────────────────────────────────────────────────────────────────── */
const App = ({onNavigate}) => {
  const [searchParams] = useSearchParams();
  const [urldata, seturldata] = useState({
    userId: {
      name: "user not found",
      profilepic: "",
      email: ""
    }
  });
  const [id, setId] = useState(searchParams.get('id'));
  const [isEmailLoading, setIsEmailLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'DM Mono', 'Courier New', monospace;
      padding: 40px 20px;
      background: #0A0A0F;
      color: #E0E0E0;
      min-height: 100vh;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .terminal-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      opacity: 0.5;
    }
    
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.r { background: #FF5F57; }
    .dot.y { background: #FFBD2E; }
    .dot.g { background: #28CA42; }
    
    .terminal-label {
      margin-left: auto;
      font-size: 11px;
      color: #555;
      letter-spacing: 0.1em;
    }
    
    h1 {
      text-align: center;
      font-size: 28px;
      font-weight: 500;
      color:  #58A6FF;
      letter-spacing: -0.02em;
      animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    
    h1 .prefix { color: #555; font-weight: 300; }
    
    @keyframes fadeUp {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    
    button:active { transform: scale(0.98); }
  </style>
</head>
<body>
  <div class="container">
    <div class="terminal-bar">
      <span class="dot r"></span>
      <span class="dot y"></span>
      <span class="dot g"></span>
      <span class="terminal-label">devio — index.html</span>
    </div>
    <h1><span class="prefix">// </span> code not found</h1>
  </div>
</body>
</html>`);

const [css, setCss] = useState(`/* CSS Editor */
.container { text-align: center; padding: 20px; }

button {
  background: transparent;
  color: #00FFB2;
  border: 1px solid #00FFB2;
  padding: 10px 28px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  letter-spacing: 0.08em;
  transition: background 0.2s, box-shadow 0.2s;
}

button:hover {
  background: rgba(0, 255, 178, 0.08);
  box-shadow: 0 0 16px rgba(0, 255, 178, 0.2);
}

@media (max-width: 768px) {
  .container { padding: 10px; }
  h1 { font-size: 20px; }
}`);

const [js, setJs] = useState(`// JavaScript Editor
console.log("Welcome to the Devio code editor!");
`);

  const [theme, setTheme] = useState('vs-dark');
  const [output, setOutput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [editorSize, setEditorSize] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [deviceMode, setDeviceMode] = useState('ipad');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [fullscreen, setfullscreen] = useState({});
  const [isdesktop, setisdesktop] = useState(false);
  const [isSaving, setIssaving] = useState(false);
  const [mobile, setIsmobile] = useState(false);
  const [mobileView, setMobileView] = useState('preview');
  
  // get data
  async function getData() {
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/code/getsingle-html?_id=${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "content-Type": "application/json"
        }
      });
      const res = await response.json();
      if (res.success) {
        
        seturldata(res.existingcode)
        setHtml(res.existingcode.html)
        setCss(res.existingcode.css)
        setJs(res.existingcode.js)
        
        // Simulate email loading for 1.5 seconds after data is loaded
        setTimeout(() => {
          setIsEmailLoading(false);
        }, 1500);
      } else {
        
        setTimeout(() => {
          setIsEmailLoading(false);
        }, 1500);
      }
    } catch (error) {
      
      setTimeout(() => {
        setIsEmailLoading(false);
      }, 1500);
    }
  }
  
  useEffect(() => {
    getData()
  }, [searchParams]); // Re-run when URL changes

  // Function to download combined code as zip
  const downloadCombinedCode = async () => {
    setIsDownloading(true);
    try {
      const combinedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Devio Generated Code</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;

      const zip = new JSZip();
      
      // Add individual files
      zip.file("index.html", combinedHtml);
      zip.file("style.css", css);
      zip.file("script.js", js);
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(content);
      link.href = url;
      link.download = `devio-code-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      
    } catch (error) {
      console.error("Error downloading code:", error);
      
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to copy current page link
  const copyPageLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      
      
    });
  };

  const isMobile = useIsMobile();
  useEffect(() => { runCode(); }, [html, css, js]);

  const runCode = () => {
    const combinedCode = `
      <html>
        <head><style>${css}</style></head>
        <body>
          ${html}
          <script>
            try { ${js} } catch(error) {
              console.error(error);
              document.body.innerHTML += '<p style="color:red;padding:10px;background:rgba(255,0,0,0.1);">Error: ' + error.message + '</p>';
            }
          <\/script>
        </body>
      </html>`;
    setOutput(combinedCode);
  };

  const applySuggestion = (language, suggestion) => {
    if (language === 'html') setHtml(html + suggestion);
    else if (language === 'css') setCss(css + suggestion);
    else if (language === 'js') setJs(js + suggestion);
    setShowSuggestions(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setfullscreen({ top: '-100%', left: '-100%', transform: 'rotate(0deg) scale(1) translateZ(-1000px)', width: '300%', height: '300%' });
    } else { setfullscreen({}); }
  };

  const setdesktop = () => {
    setisdesktop(!isdesktop);
    if (!isdesktop) {
      setfullscreen({ top: '-40%', left: '-40%', transform: 'rotate(0deg) scale(1) translateZ(-400px)', width: '180%', height: '180%' });
    } else { setfullscreen({}); }
  };

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const setDevicePreset = (mode) => {
    setDeviceMode(mode);
    switch (mode) {
      case 'mobile': setEditorSize(30); setIsPanelCollapsed(false); break;
      case 'ipad': setEditorSize(50); setIsPanelCollapsed(false); break;
      case 'laptop': setEditorSize(80); setIsPanelCollapsed(false); break;
      default: break;
    }
  };

  const suggestions = {
    html: [
      { code: '<nav class="navbar">\n  <div class="logo">MySite</div>\n  <ul class="nav-links">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n  <div class="hamburger">☰</div>\n</nav>', desc: 'Add a responsive navigation bar' },
      { code: '<form class="contact-form">\n  <h2>Contact Us</h2>\n  <input type="text" placeholder="Your Name" required>\n  <input type="email" placeholder="Your Email" required>\n  <textarea placeholder="Your Message" rows="5" required></textarea>\n  <button type="submit">Send Message</button>\n</form>', desc: 'Create a contact form' },
      { code: '<div class="gallery">\n  <div class="gallery-item"><img src="image1.jpg" alt="1"></div>\n  <div class="gallery-item"><img src="image2.jpg" alt="2"></div>\n  <div class="gallery-item"><img src="image3.jpg" alt="3"></div>\n</div>', desc: 'Add an image gallery' },
      { code: '<div class="pricing-card">\n  <h3>Premium Plan</h3>\n  <div class="price">$29<span>/month</span></div>\n  <ul class="features">\n    <li>✓ Feature 1</li>\n    <li>✓ Feature 2</li>\n    <li>✓ Feature 3</li>\n  </ul>\n  <button class="cta-button">Get Started</button>\n</div>', desc: 'Create a pricing card' },
      { code: '<section class="hero">\n  <div class="hero-content">\n    <h1>Welcome to Our Website</h1>\n    <p>Discover amazing things with us</p>\n    <a href="#learn-more" class="hero-button">Learn More</a>\n  </div>\n</section>', desc: 'Implement a hero section' },
      { code: '<div class="video-background">\n  <video autoplay muted loop><source src="background-video.mp4" type="video/mp4"></video>\n  <div class="content-overlay"><h1>Your Content Here</h1></div>\n</div>', desc: 'Add a video background' },
    ],
    css: [
      { code: '.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 20px;\n}', desc: 'Add flexbox layout' },
      { code: '@keyframes slideIn {\n  from { transform: translateX(-100%); opacity: 0; }\n  to   { transform: translateX(0);     opacity: 1; }\n}\n.animated-element { animation: slideIn 1s ease-out; }', desc: 'Create keyframe animations' },
      { code: '@media (max-width: 768px) {\n  .container { flex-direction: column; }\n  .nav-links { display: none; }\n  .hamburger { display: block; }\n}', desc: 'Make it responsive' },
      { code: '.glass-card {\n  background: rgba(255,255,255,0.25);\n  backdrop-filter: blur(10px);\n  border-radius: 10px;\n  border: 1px solid rgba(255,255,255,0.18);\n}', desc: 'Style with glassmorphism' },
      { code: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n}', desc: 'Implement CSS grid' },
      { code: '.button { transition: all 0.3s ease; }\n.button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }', desc: 'Add hover effects' },
    ],
    js: [
      { code: "document.querySelector('.myButton').addEventListener('click', function(e) {\n  e.preventDefault();\n  this.classList.toggle('active');\n});", desc: 'Add click event listeners' },
      { code: "async function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    displayData(data);\n  } catch (error) { console.error('Error:', error); }\n}", desc: 'Fetch data from API' },
      { code: "document.getElementById('myForm').addEventListener('submit', function(e) {\n  e.preventDefault();\n  const email = document.getElementById('email').value;\n  if (!email.includes('@')) alert('Invalid email');\n});", desc: 'Form validation' },
      { code: "document.body.classList.toggle('dark-mode');\nlocalStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));", desc: 'Toggle dark mode' },
      { code: "class Counter {\n  constructor(v=0){ this.count=v; this.updateDisplay(); }\n  increment(){ this.count++; this.updateDisplay(); }\n  decrement(){ this.count--; this.updateDisplay(); }\n  updateDisplay(){ document.getElementById('counter').textContent=this.count; }\n}\nconst counter=new Counter();", desc: 'Create a counter' },
      { code: "document.querySelectorAll('a[href^=\"#\"]').forEach(a => {\n  a.addEventListener('click', e => {\n    e.preventDefault();\n    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });\n  });\n});", desc: 'Add smooth scroll' },
    ],
  };

  // Show email loading overlay while fetching data
  if (isEmailLoading) {
    return <EmailLoadingOverlay email={urldata.userId.email || "Guest"} />;
  }

  /* ── Render ── */
  return (
    <div
      Style={{
        "overflow": "hidden"
      }}
      className={`devio-app app ${isFullscreen ? 'fullscreen' : ''} ${theme === 'vs-dark' ? 'dark-theme' : 'light-theme'}`}>

      {/* ══════════ HEADER ══════════ */}
      <header className="devio-header1">
        <div className="devio-logo">
          <div className="devio-traffic-lights">
            <Avatar name={urldata.userId.name} src={urldata.userId.profilepic} size={35} />
          </div>

          <div className="devio-h-divider" />
          <div className="devio-logo-icon">
            <Terminal size={12} />
          </div>
          <span className="devio-logo-text">devio</span>
          <span className="devio-cursor" />

          {/* User badge — visible on all screen sizes and user name*/}
          <div className="devio-h-divider" />
          <span className="devio-user-badge">@{urldata.userId.name}</span>
        </div>

        <div className="devio-device-group devio-desktop-only">
          <button className={`devio-device-btn${deviceMode === 'laptop' ? ' active' : ''}`} onClick={() => setDevicePreset('laptop')} title="Laptop"><Monitor size={12} /></button>
          <button className={`devio-device-btn${deviceMode === 'ipad' ? ' active' : ''}`} onClick={() => setDevicePreset('ipad')} title="iPad">  <Tablet size={12} /></button>
          <button 
          
          className={`devio-device-btn${deviceMode === 'mobile' ? ' active' : ''}`} onClick={() => setDevicePreset('mobile')} title="Mobile"><Smartphone size={12} /></button>
         <NavDropdown onNavigate={onNavigate} NAV_PAGES={NAV_PAGES} />
        </div>

        {/* Mobile only */}
        {
          isMobile &&
          <div className="devio-device-group devio-mobile-only">
            <button 
            className={`devio-device-btn${isFullscreen ? ' active' : ''}`} onClick={toggleFullscreen} title="Fullscreen">  <Monitor size={12} /></button>
            <button className={`devio-device-btn${isdesktop ? ' active' : ''}`} onClick={() => setdesktop()} title="Desktop sim"><Tablet size={12} /></button>
               <NavDropdown onNavigate={onNavigate} NAV_PAGES={NAV_PAGES} />
          </div>
        }
      </header>

      <header className="devio-header">
        <div className="devio-h-right">
          {/* Copy Link Button */}
          <button 
            className="devio-icon-btn" 
            onClick={copyPageLink} 
            title="Copy link to this page"
          >
            {copiedLink ? <CheckCircle size={14} /> : <Copy size={14} />}
          </button><span style={{fontSize: "5px"}}>copy  share link</span>

          {/* Download Button */}
          <button 
            className="devio-icon-btn" 
            onClick={downloadCombinedCode} 
            title="Download code as ZIP"
            disabled={isDownloading}
          >
            {isDownloading ? <Loader size={14} className="spinning" /> : <Download size={14} />}
            
          </button><span style={{fontSize: "5px"}}>download</span>

          <ThemeToggle theme={theme} setTheme={setTheme} />

          <button className="devio-icon-btn devio-desktop-only" onClick={togglePanel} title="Toggle panel">
            {isPanelCollapsed ? <PanelRight size={14} /> : <PanelLeft size={14} />}
          </button>

          <button className="devio-icon-btn" onClick={() => setShowSuggestions(!showSuggestions)} title="Snippets">
            <Lightbulb size={14} />
          </button>
        </div>
      </header>
      {/* ══════════ MAIN ══════════ */}
      <div className="devio-main">

        {/* Desktop split */}
        {!isMobile && (
          <div className="devio-split">
            <div className={`devio-editor-panel${isPanelCollapsed ? ' collapsed' : ''}`}>
              <div className="devio-tab-bar">
                {[
                  { id: 'html', label: 'HTML' },
                  { id: 'css', label: 'CSS' },
                  { id: 'js', label: 'JS' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    className={`devio-tab ${id}${activeTab === id ? ' active' : ''}`}
                    onClick={() => setActiveTab(id)}
                  >
                    <span className={`devio-tab-dot ${id}`} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="devio-editor-body">
                {activeTab === 'html' && <CodeEditor language="html" value={html} onChange={setHtml} theme={theme} />}
                {activeTab === 'css' && <CodeEditor language="css" value={css} onChange={setCss} theme={theme} />}
                {activeTab === 'js' && <CodeEditor language="javascript" value={js} onChange={setJs} theme={theme} />}
              </div>
            </div>

            <div className={`devio-output-panel${isPanelCollapsed ? ' expanded' : ''}`} id="editor-panel"
              style={{
                '--editor-size': `${editorSize}%`,
                '--panel-size': `${100 - editorSize}%`
              }}>
              <div className="devio-output-bar">
                <span className="devio-output-label">
                  <span className="devio-live-dot" /> Preview
                </span>
                <div className="devio-url-bar">
                  <span>▶</span> localhost:3000
                </div>
              </div>
              <Output output={output} setscreen={fullscreen} />
            </div>
          </div>
        )}

        {/* Mobile: both panes always in DOM, toggled via .hidden class */}
        {isMobile && (
          <div className="devio-mobile-container">
            {/* Editor pane */}
            <div
              className={`devio-mobile-pane${mobileView !== 'editor' ? ' hidden' : ''}`}
              style={{ background: 'var(--surface)' }}
            >
              <div className="devio-tab-bar">
                {[
                  { id: 'html', label: 'HTML' },
                  { id: 'css', label: 'CSS' },
                  { id: 'js', label: 'JS' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    className={`devio-tab ${id}${activeTab === id ? ' active' : ''}`}
                    onClick={() => setActiveTab(id)}
                  >
                    <span className={`devio-tab-dot ${id}`} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="devio-editor-body">
                {activeTab === 'html' && <CodeEditor language="html" value={html} onChange={setHtml} theme={theme} />}
                {activeTab === 'css' && <CodeEditor language="css" value={css} onChange={setCss} theme={theme} />}
                {activeTab === 'js' && <CodeEditor language="javascript" value={js} onChange={setJs} theme={theme} />}
              </div>
            </div>

            {/* Preview pane — always mounted, never destroyed */}
            <div
              className={`devio-mobile-pane${mobileView !== 'preview' ? ' hidden' : ''}`}
              style={{ background: 'var(--bg)' }}
              id="editor-panel"
            >
              <div className="devio-output-bar">
                <span className="devio-output-label">
                  <span className="devio-live-dot" /> Preview
                </span>
              </div>
              {/* Output always rendered — visibility controlled by parent .hidden */}
              <Output output={output} setscreen={fullscreen} />
            </div>
          </div>
        )}
      </div>

      {/* ══════════ MOBILE BOTTOM NAV ══════════ */}
      {isMobile && (
        <nav className="devio-mobile-nav">
          <button
            className={`devio-mobile-nav-btn${mobileView === 'editor' ? ' active' : ''}`}
            onClick={() => setMobileView('editor')}
          >
            <Terminal size={16} />
            Editor
          </button>
          <button
            className={`devio-mobile-nav-btn${mobileView === 'preview' ? ' active' : ''}`}
            onClick={() => setMobileView('preview')}
          >
            <Eye size={16} />
            Preview
          </button>
        </nav>
      )}

      {/* ══════════ OVERLAYS ══════════ */}
      {showSuggestions && (
        <SuggestionBox
          suggestions={suggestions}
          onApplySuggestion={applySuggestion}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default App;