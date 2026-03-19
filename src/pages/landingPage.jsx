import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Features", "Showcase", "Pricing"];

const FEATURES = [
  {
    icon: "⚡", title: "Live Code Editor",
    desc: "Write HTML, CSS & JS with syntax highlighting, autocomplete, and real-time error detection.",
    color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/30", tag: null,
  },
  {
    icon: "✦", title: "AI Code Suggestions",
    desc: "Context-aware completions and smart refactors powered by AI — finish lines before you type them.",
    color: "from-violet-500/20 to-blue-500/10", border: "border-violet-500/40", tag: "AI",
  },
  {
    icon: "▶", title: "Instant Preview",
    desc: "Run your code instantly in a sandboxed iframe. Results appear side-by-side as you type.",
    color: "from-cyan-500/20 to-teal-500/10", border: "border-cyan-500/30", tag: null,
  },
  {
    icon: "☁", title: "Cloud Save",
    desc: "Every keystroke auto-saved to the cloud. Access your projects from any device, anywhere.",
    color: "from-sky-500/20 to-blue-500/10", border: "border-sky-500/30", tag: null,
  },
  {
    icon: "⟨/⟩", title: "Share & Embed",
    desc: "One-click sharing with a unique URL. Embed live previews in blogs, portfolios, and docs.",
    color: "from-indigo-500/20 to-blue-500/10", border: "border-indigo-500/30", tag: null,
  },
  {
    icon: "◐", title: "Smart Snippet Fix",
    desc: "Paste broken code and let AI diagnose and patch bugs instantly with an explanation.",
    color: "from-blue-600/20 to-violet-500/10", border: "border-blue-600/30", tag: "AI",
  },
  {
    icon: "💬", title: "Code Reviews",
    desc: "Get inline comments and structured reviews from the developer community on your snippets.",
    color: "from-blue-600/20 to-indigo-500/10", border: "border-blue-600/30", tag: null,
  },
  {
    icon: "◈", title: "Version History",
    desc: "Every save is versioned. Roll back, compare diffs, and track your code evolution over time.",
    color: "from-teal-500/20 to-cyan-500/10", border: "border-teal-500/30", tag: null,
  },
];

const SHOWCASES = [
  { name: "glassmorphism-card", author: "0xkaito",     lang: "CSS",  stars: 284, reviews: 31 },
  { name: "particle-canvas",   author: "devmila",      lang: "JS",   stars: 512, reviews: 67 },
  { name: "responsive-grid",   author: "nullpointer",  lang: "HTML", stars: 198, reviews: 22 },
  { name: "dark-nav-scroll",   author: "rxbydev",      lang: "CSS",  stars: 341, reviews: 45 },
  { name: "json-visualizer",   author: "0xkaito",      lang: "JS",   stars: 627, reviews: 89 },
  { name: "terminal-ui-kit",   author: "devmila",      lang: "HTML", stars: 453, reviews: 58 },
];

const LANG_COLOR = { CSS: "#f472b6", JS: "#fbbf24", HTML: "#60a5fa" };

const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    desc: "Perfect for side projects and learning.",
    color: "#3b82f6",
    features: [
      "100 snippets storage",
      "Live HTML/CSS/JS editor",
      "Public sharing",
      "Community code reviews",
      "Basic syntax highlighting",
    ],
    cta: "Get Started Free",
    popular: false,
  }
];

// ─── Code sequences ───────────────────────────────────────────────────────────
const HTML_LINES = [
  { txt: '<div class="card">',        color: "#60a5fa" },
  { txt: '  <h1>Hello, DEVIO</h1>',   color: "#e2e8f0" },
  { txt: '  <p>Build something.</p>', color: "#e2e8f0" },
  { txt: '  <button onclick="run()">', color: "#60a5fa" },
  { txt: '    Run ▶',                  color: "#4ade80" },
  { txt: '  </button>',               color: "#60a5fa" },
  { txt: '</div>',                    color: "#60a5fa" },
];
const CSS_LINES = [
  { txt: '.card {',                      color: "#f472b6" },
  { txt: '  display: flex;',             color: "#e2e8f0" },
  { txt: '  background: #0a0f1a;',       color: "#e2e8f0" },
  { txt: '  border: 1px solid #1d4ed8;', color: "#e2e8f0" },
  { txt: '  border-radius: 12px;',       color: "#e2e8f0" },
  { txt: '  color: #93c5fd;',            color: "#93c5fd" },
  { txt: '}',                            color: "#f472b6" },
];
const JS_LINES = [
  { txt: 'function run() {',          color: "#fbbf24" },
  { txt: '  const out = eval(code);', color: "#e2e8f0" },
  { txt: '  console.log(out);',       color: "#e2e8f0" },
  { txt: '  preview.srcdoc = code;',  color: "#e2e8f0" },
  { txt: '  save(code);',             color: "#86efac" },
  { txt: '  share(link);',            color: "#86efac" },
  { txt: '}',                         color: "#fbbf24" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>{children}</div>
  );
}

function Cursor({ color = "#3b82f6" }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 530); return () => clearInterval(t); }, []);
  return <span style={{ opacity: on ? 1 : 0, color, fontWeight: 700 }}>█</span>;
}

function TypeLine({ text, speed = 34, color = "#e2e8f0", onDone }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false); let i = 0;
    const t = setInterval(() => {
      setOut(text.slice(0, i + 1)); i++;
      if (i >= text.length) { clearInterval(t); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <span style={{ color }}>{out}{!done && <Cursor color={color} />}</span>;
}

function CodePanel({ lines, active }) {
  const [visible, setVisible] = useState([]);
  const [cur, setCur] = useState(0);
  const [loop, setLoop] = useState(0);
  useEffect(() => { if (!active) return; setVisible([]); setCur(0); }, [active, loop]);
  const done = () => {
    setCur(prev => {
      const next = prev + 1;
      if (next < lines.length) { setVisible(v => [...v, lines[prev]]); return next; }
      setVisible(v => [...v, lines[prev]]);
      setTimeout(() => setLoop(k => k + 1), 2000);
      return prev;
    });
  };
  if (!active) return null;
  return (
    <div className="text-xs leading-6 select-none font-mono">
      {visible.map((l, i) => <div key={i} style={{ color: l.color }}>{l.txt}</div>)}
      {cur < lines.length && <div><TypeLine key={`${loop}-${cur}`} text={lines[cur].txt} color={lines[cur].color} onDone={done} /></div>}
    </div>
  );
}

// ─── Layered Editor ───────────────────────────────────────────────────────────
function LayeredEditor() {
  const [tab, setTab] = useState("html");
  const TABS = [
    { id: "html", label: "index.html", dot: "#60a5fa", badge: "HTML", lines: HTML_LINES },
    { id: "css",  label: "style.css",  dot: "#f472b6", badge: "CSS",  lines: CSS_LINES  },
    { id: "js",   label: "main.js",    dot: "#fbbf24", badge: "JS",   lines: JS_LINES   },
  ];
  const panelStyle = (id, zMap) => ({
    position: "absolute", width: "100%",
    zIndex: zMap[id],
    left:    id === tab ? "0%" : id === "css" ? "4%" : id === "html" ? "2%" : "6%",
    top:     id === tab ? 0    : id === "css" ? "5%" : id === "html" ? "3%" : "8%",
    opacity: id === tab ? 1    : 0.32,
    transform: id === tab ? "scale(1)" : "scale(0.95)",
    transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
    borderRadius: 14,
    overflow: "hidden",
    cursor: id !== tab ? "pointer" : "default",
    border: `1px solid ${id === tab
      ? (id === "html" ? "rgba(96,165,250,0.45)" : id === "css" ? "rgba(244,114,182,0.45)" : "rgba(251,191,36,0.4)")
      : "rgba(255,255,255,0.06)"}`,
    background: "rgba(8,12,22,0.96)",
    backdropFilter: "blur(14px)",
    boxShadow: id === tab
      ? (id === "html" ? "0 12px 40px rgba(59,130,246,0.2)" : id === "css" ? "0 12px 40px rgba(244,114,182,0.15)" : "0 12px 40px rgba(251,191,36,0.1)")
      : "none",
  });
  const zMap = { html: tab === "html" ? 30 : 10, css: tab === "css" ? 30 : 20, js: tab === "js" ? 30 : 15 };
  return (
    <div className="relative w-full max-w-2xl mx-auto" style={{ height: 296 }}>
      {TABS.map(t => (
        <div key={t.id} style={panelStyle(t.id, zMap)} onClick={() => setTab(t.id)}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-gray-900/50">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/65" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/65" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/65" />
            <span className="ml-2 text-xs text-gray-500 tracking-widest">{t.label}</span>
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded border font-bold"
              style={{ color: t.dot, borderColor: `${t.dot}44`, background: `${t.dot}14` }}>{t.badge}</span>
          </div>
          <div className="p-5 h-52 overflow-hidden">
            <CodePanel lines={t.lines} active={tab === t.id} />
          </div>
        </div>
      ))}
      {/* Tab pills */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all duration-200"
            style={{
              borderColor: tab === t.id ? `${t.dot}55` : "rgba(255,255,255,0.07)",
              background:  tab === t.id ? `${t.dot}18`  : "transparent",
              color:       tab === t.id ? t.dot           : "#6b7280",
            }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.dot }} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Hero typewriter ──────────────────────────────────────────────────────────
const PHRASES = [
  "> Write clean HTML in milliseconds_",
  "> Style with CSS. Ship in seconds_",
  "> Run JS. Share instantly. Get reviewed_",
  "> AI suggests your next line of code_",
  "> The terminal for frontend devs_",
];
function HeroTypewriter() {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const phrase = PHRASES[idx];
    let t;
    if (!del) {
      if (out.length < phrase.length) t = setTimeout(() => setOut(phrase.slice(0, out.length + 1)), 38);
      else t = setTimeout(() => setDel(true), 1600);
    } else {
      if (out.length > 0) t = setTimeout(() => setOut(phrase.slice(0, out.length - 1)), 18);
      else { setDel(false); setIdx(i => (i + 1) % PHRASES.length); }
    }
    return () => clearTimeout(t);
  }, [out, del, idx]);
  return <span className="text-blue-300/80">{out}<Cursor color="#3b82f6" /></span>;
}

// ─── Background elements ──────────────────────────────────────────────────────
function GridBg({ id = "grid" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
    </div>
  );
}
function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.2),transparent)", animation: "scanline 5s linear infinite", top: 0 }} />
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="inline-block text-xs tracking-widest text-blue-500 uppercase mb-3 border border-blue-800/50 px-3 py-1 rounded-full bg-blue-950/20">
      {children}
    </div>
  );
}

// ─── AI Suggestion Demo ───────────────────────────────────────────────────────
function AISuggestionDemo() {
  const [step, setStep] = useState(0);
  const steps = [
    { user: "const btn = document.querySelector(", ghost: "'#run-btn');" },
    { user: "btn.addEventListener('click', () =>", ghost: " { runCode(); });" },
    { user: "function runCode() { const src =", ghost: " editor.getValue();" },
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="rounded-xl border border-violet-700/30 bg-gray-950/80 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-violet-800/20 bg-violet-950/20">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: "0 0 6px #a78bfa" }} />
        <span className="text-xs text-violet-400 tracking-widest font-bold uppercase">AI Suggestions</span>
      </div>
      <div className="p-4 font-mono text-xs leading-7">
        {steps.map((s, i) => (
          <div key={i} className={`transition-opacity duration-300 ${i === step ? "opacity-100" : "opacity-30"}`}>
            <span className="text-gray-200">{s.user}</span>
            {i === step && <span className="text-violet-400/70 bg-violet-900/20 rounded px-0.5">{s.ghost}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DevioLanding({ onEnterDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const yearlyDiscount = (price) => {
    if (price === "$0") return "$0";
    const num = parseInt(price.replace("$", ""));
    return `$${Math.round(num * 0.8)}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden" style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-gray-950/95 backdrop-blur-md border-b border-blue-900/40 shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-xs font-bold glow-blue">D/V</div>
            <span className="text-lg font-bold tracking-widest text-blue-400 text-glow">DEVIO</span>
          </div>
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="nav-ul text-xs tracking-widest text-gray-400 hover:text-blue-400 transition-colors uppercase pb-0.5">{l}</a>
            ))}
            <button onClick={onEnterDashboard} className="nav-ul text-xs tracking-widest text-blue-400 hover:text-blue-300 transition-colors uppercase font-bold pb-0.5">Dashboard</button>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              to='/login' className="text-xs text-center text-gray-400 hover:text-white px-3 py-1.5 border border-gray-700 rounded hover:border-blue-500/60 transition-all">Log in</Link>
            <Link
              to='/signup'  className="shine text-center text-xs font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-all glow-blue text-white">Get Started →</Link>
          </div>
          <button className="md:hidden p-1 text-gray-400 hover:text-white" onClick={() => setMobileOpen(v => !v)}>
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-0.5 bg-current transition-all origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 border-b border-blue-900/40" : "max-h-0"} bg-gray-950/98 backdrop-blur-md`}>
          <div className="px-5 py-5 space-y-1">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-xs tracking-widest text-gray-400 hover:text-blue-400 uppercase py-2 border-b border-gray-800/40">{l}</a>
            ))}
            <Link to="/login" onClick={() => { setMobileOpen(false); onEnterDashboard(); }} className="block w-full text-left text-center text-xs tracking-widest text-blue-400 uppercase font-bold py-2 border-b border-gray-800/40">Dashboard</Link>
            <div className="pt-3 flex flex-col gap-2">
              <Link
                 to='/login' className="w-full text-center text-xs text-gray-400 border border-gray-700 rounded py-2">Log in</Link>
              <Link
              to="/signup"
              onClick={() => { setMobileOpen(false); onEnterDashboard(); }} className="w-full shine text-xs text-center font-bold bg-blue-600 text-white rounded py-2 glow-blue">Get Started →</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-36 overflow-hidden">
        <GridBg id="hero-grid" />
        <ScanLine />
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)" }} />
          <div style={{ position: "absolute", top: "35%", right: "8%",  width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto w-full" style={{ zIndex: 10 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-800/60 bg-blue-950/40 text-blue-400 text-xs mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: "pulse-ring 1.6s ease-out infinite", boxShadow: "0 0 6px #3b82f6" }} />
            <span className="tracking-widest uppercase">v1.0 — Now in Beta</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-none mb-6 tracking-tight">
            <span className="block text-gray-100">Code.</span>
            <span className="block text-blue-400 text-glow">Run.</span>
            <span className="block text-gray-100">Share.</span>
          </h1>
          <div className="text-sm sm:text-base mb-10 font-light tracking-wide min-h-[1.6rem]">
            <HeroTypewriter />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
            to="/signup" onClick={onEnterDashboard} className="shine w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded transition-all glow-blue">
              Get Started — it's free →
            </Link>
            <a href="#showcase" className="w-full sm:w-auto text-center px-8 py-3 border border-blue-800 hover:border-blue-500 text-blue-300 hover:text-blue-200 text-sm rounded transition-all">
              View Showcase
            </a>
          </div>
          <div className="float-anim" style={{ paddingBottom: 48 }}>
            <LayeredEditor />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-6">
            <SectionLabel># features</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to <span className="text-blue-400">ship faster</span></h2>
          </RevealSection>

          {/* AI Suggestions highlight row */}
          <RevealSection className="mb-10" delay={100}>
            <div className="rounded-2xl border border-violet-600/30 bg-gradient-to-r from-violet-950/40 to-blue-950/40 p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 backdrop-blur-sm"
              style={{ boxShadow: "0 0 40px rgba(139,92,246,0.08)" }}>
              <div className="flex-1 lg:max-w-md">
                <div className="ai-badge inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 px-2.5 py-1 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: "0 0 5px #a78bfa" }} />
                  AI-Powered
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">Smart Code Suggestions</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  DEVIO's AI engine reads your context and completes the next line before you finish typing — like having a senior dev looking over your shoulder. Works across HTML, CSS, and JavaScript.
                </p>
                <ul className="space-y-2">
                  {["Context-aware line completions", "Auto-imports & variable names", "Instant bug diagnosis & patch", "Tab to accept, Esc to dismiss"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="w-4 h-4 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-400 text-xs shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full max-w-md lg:max-w-none">
                <AISuggestionDemo />
              </div>
            </div>
          </RevealSection>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.filter(f => !["AI Code Suggestions", "Smart Snippet Fix"].includes(f.title)).map((f, i) => (
              <RevealSection key={f.title} delay={i * 60}>
                <div
                  className={`card-hover relative rounded-xl border ${f.border} bg-gradient-to-br ${f.color} p-5 cursor-pointer backdrop-blur-sm h-full`}
                  onMouseEnter={() => setActiveFeature(i)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  {f.tag && (
                    <span className="ai-badge absolute top-3 right-3 text-xs font-bold text-violet-300 px-1.5 py-0.5 rounded">{f.tag}</span>
                  )}
                  <div className="text-xl mb-3 text-blue-400">{f.icon}</div>
                  <h3 className="font-bold text-white mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                  {activeFeature === i && <div className="absolute inset-0 rounded-xl border border-blue-400/40 pointer-events-none" />}
                </div>
              </RevealSection>
            ))}
            {/* Smart snippet fix card */}
            {FEATURES.filter(f => f.title === "Smart Snippet Fix").map((f, i) => (
              <RevealSection key={f.title} delay={380} className="sm:col-span-2 lg:col-span-2">
                <div className={`card-hover relative rounded-xl border ${f.border} bg-gradient-to-br ${f.color} p-5 cursor-pointer backdrop-blur-sm h-full flex gap-5`}>
                  <div>
                    <div className="ai-badge inline-flex items-center gap-1 text-xs font-bold text-violet-300 px-2 py-0.5 rounded-full mb-3">✦ AI</div>
                    <div className="text-xl mb-2 text-blue-400">{f.icon}</div>
                    <h3 className="font-bold text-white mb-1.5 text-sm">{f.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-xs">{f.desc}</p>
                  </div>
                  <div className="hidden sm:block flex-1 rounded-lg bg-gray-950/60 border border-violet-800/20 p-3 font-mono text-xs space-y-1.5 self-center">
                    <div className="text-red-400/70">// ❌ Uncaught TypeError</div>
                    <div className="text-gray-500">document.getElement<span className="text-red-400">ByClassName</span>(…)</div>
                    <div className="text-green-400/80 mt-2">// ✓ AI fix applied</div>
                    <div className="text-gray-300">document.<span className="text-green-400">getElementsByClassName</span>(…)</div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      
            {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(29,78,216,0.07) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <RevealSection className="text-center mb-12">
            <SectionLabel># pricing</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, transparent <span className="text-blue-400">pricing</span></h2>
            <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">Start free. No hidden fees.</p>

          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <RevealSection key={plan.name} delay={i * 100}>
                <div
                  className={`plan-card relative rounded-2xl p-6 sm:p-7 h-full flex flex-col ${plan.popular ? "border-2" : "border"}`}
                  style={{
                    borderColor: plan.popular ? `${plan.color}70` : "rgba(59,130,246,0.18)",
                    background: plan.popular
                      ? `linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(15,23,42,0.9) 60%)`
                      : "rgba(15,23,42,0.75)",
                    backdropFilter: "blur(12px)",
                    boxShadow: plan.popular ? `0 0 40px ${plan.color}22, 0 8px 32px rgba(0,0,0,0.4)` : "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-extrabold tracking-widest uppercase px-4 py-1 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${plan.color}, #3b82f6)`, color: "#fff", boxShadow: `0 0 16px ${plan.color}60` }}>
                      ✦ Most Popular
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: plan.color, boxShadow: `0 0 8px ${plan.color}` }} />
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: plan.color }}>{plan.name}</span>
                    </div>
                    <div className="flex items-end gap-1.5 mb-2">
                      <span className="text-4xl font-extrabold text-white">{billing === "yearly" ? yearlyDiscount(plan.price) : plan.price}</span>
                      <span className="text-xs text-gray-500 mb-1.5 pb-px">{plan.per}</span>
                    </div>
                    {billing === "yearly" && plan.price !== "$0" && (
                      <p className="text-xs text-green-400">✓ 20% off — billed annually</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{plan.desc}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, transparent, ${plan.color}40, transparent)` }} />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1 mb-7">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-px"
                          style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40`, color: plan.color, fontSize: 9 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                  to="/signup"
                    onClick={onEnterDashboard}
                    className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all shine"
                    style={plan.popular
                      ? { background: `linear-gradient(90deg, ${plan.color}, #3b82f6)`, color: "#fff", boxShadow: `0 0 20px ${plan.color}50` }
                      : { background: "rgba(59,130,246,0.1)", color: plan.color, border: `1px solid ${plan.color}40` }
                    }
                  >
                    {plan.cta}
                  </Link>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* ── SHOWCASE ── */}
      <section id="showcase" className="py-24 px-4 bg-gray-900/40 border-y border-blue-950/40 relative overflow-hidden">
        <GridBg id="showcase-grid" />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealSection className="text-center mb-16">
            <SectionLabel># showcase</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Trending <span className="text-blue-400">code snippets</span></h2>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHOWCASES.map((s, i) => (
              <RevealSection key={s.name} delay={i * 70}>
                <div className="card-hover rounded-xl border border-gray-800 bg-gray-900/80 p-5 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: LANG_COLOR[s.lang] }} />
                      <span className="text-xs text-gray-300 font-semibold">{s.name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded border font-bold" style={{ color: LANG_COLOR[s.lang], borderColor: `${LANG_COLOR[s.lang]}40`, background: `${LANG_COLOR[s.lang]}12` }}>{s.lang}</span>
                  </div>
                  <div className="bg-gray-950/80 rounded-lg p-3 mb-4 h-16 flex items-center font-mono">
                    <div className="text-xs space-y-1">
                      <div><span className="text-blue-500">.</span><span style={{ color: LANG_COLOR[s.lang] }}>{s.name}</span><span className="text-gray-600">{" { "}</span></div>
                      <div className="ml-2 text-gray-600">display: <span className="text-yellow-600">flex</span>;</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>@{s.author}</span>
                    <div className="flex items-center gap-3"><span>⭐ {s.stars}</span><span>💬 {s.reviews}</span></div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(29,78,216,0.14) 0%, transparent 70%)" }} />
        <RevealSection className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 text-white">Start coding in <span className="text-blue-400 text-glow">seconds.</span></h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">No installs. No setup. Just open DEVIO and write code the world can see, run, and review.</p>
          <Link
              to='/signup' onClick={onEnterDashboard} className="shine px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl glow-blue transition-all text-sm">
            Get Started — it's free →
          </Link>
        </RevealSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-blue-950/50 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">D/V</div>
            <span className="text-gray-500 tracking-widest">DEVIO © {new Date().getFullYear()}</span>
          </div>
          {/*<div className="flex flex-wrap justify-center gap-6">
            {["Privacy", "Terms", "Docs", "GitHub", "Pricing"].map(l => (
              <a key={l} href="#" className="hover:text-blue-400 transition-colors tracking-wide">{l}</a>
            ))}
          </div>*/}
        </div>
      </footer>
    </div>
  );
}
