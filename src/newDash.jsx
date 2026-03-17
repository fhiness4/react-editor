import { useState, useRef, useEffect } from "react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import {formatDate} from "./utils/date"
import toast from "react-hot-toast";
const url = 'https://auth-dusky-rho.vercel.app/api/auth';
// ─── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_USER = {
  name: "Kaitura",
  username: "0xkaito",
  email: "kaito@devio.dev",
  dateJoined: "January 12, 2025",
  snippetsSaved: 67,
  snippetLimit: 100,
  plan: "Pro",
};




// ─── Helpers ──────────────────────────────────────────────────────────────────
const pct   = (v, m) => Math.round((v / m) * 100);
const gColor = (p)   => p >= 85 ? "#ef4444" : p >= 60 ? "#f59e0b" : "#3b82f6";

// ─── Animated number ──────────────────────────────────────────────────────────
function AnimNum({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const n = parseFloat(target);
    if (isNaN(n)) { setVal(target); return; }
    let start = 0;
    const step = n / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= n) { setVal(target); clearInterval(t); }
      else setVal(target.includes("k") ? (start / 1000).toFixed(1) + "k" : Math.floor(start).toString());
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <span>{val || target}</span>;
}

// ─── Snippet Gauge ────────────────────────────────────────────────────────────
function SnippetGauge({ saved}) {
  const percent = pct(saved, 100);
  const color   = gColor(percent);
  const data    = [{ name: "used", value: percent, fill: color }];
  return (
    <div className="relative w-36 h-36 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="62%" outerRadius="85%"
          startAngle={210} endAngle={-30} data={data} barSize={11}>
          <RadialBar dataKey="value" cornerRadius={6}
            background={{ fill: "rgba(255,255,255,0.03)", cornerRadius: 6 }} clockWise />
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <Tooltip content={({ active, payload }) =>
            active && payload?.length ? (
              <div style={{ background: "#0f172a", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#d1d5db" }}>
                <span style={{ color }}>{payload[0].value}%</span> used
              </div>
            ) : null} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span className="text-2xl font-black" style={{ color, textShadow: `0 0 20px ${color}80` }}>{saved}</span>
        <span className="text-xs text-gray-600 tracking-widest">/ 100</span>
        <span className="text-xs font-bold" style={{ color }}>{percent}%</span>
      </div>
    </div>
  );
}

// ─── Cursor blink ─────────────────────────────────────────────────────────────
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 520); return () => clearInterval(t); }, []);
  return <span style={{ opacity: on ? 1 : 0, color: "#3b82f6" }}>█</span>;
}

// ─── Editor preview (animated) ────────────────────────────────────────────────
const EDITOR_LINES = [
  { txt: '<div class="hero">',        c: "#60a5fa" },
  { txt: '  <h1>Hello World</h1>',   c: "#e2e8f0" },
  { txt: '  <style>',                c: "#f472b6" },
  { txt: '    .hero { display:flex', c: "#e2e8f0" },
  { txt: '    background:#0a0f1a }', c: "#e2e8f0" },
  { txt: '  </style>',               c: "#f472b6" },
  { txt: '</div>',                   c: "#60a5fa" },
];
function EditorPreview() {
  const [lines, setLines] = useState([]);
  const [cur, setCur] = useState(0);
  const [loop, setLoop] = useState(0);
  useEffect(() => { setLines([]); setCur(0); }, [loop]);
  useEffect(() => {
    if (cur >= EDITOR_LINES.length) { setTimeout(() => setLoop(k => k + 1), 2000); return; }
    const delay = setTimeout(() => {
      setLines(v => [...v, EDITOR_LINES[cur]]);
      setCur(c => c + 1);
    }, 380);
    return () => clearTimeout(delay);
  }, [cur]);
  return (
    <div className="font-mono text-xs leading-6 overflow-hidden h-full">
      {lines.map((l, i) => <div key={`${loop}-${i}`} style={{ color: l.c }}>{l.txt}</div>)}
      {cur < EDITOR_LINES.length && <div><Cursor /></div>}
    </div>
  );
}

    

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview",  icon: "⬡", label: "Overview"  },
  { id: "snippets",  icon: "◻", label: "Snippets"  },
  { id: "editor",    icon: "⟨/⟩", label: "Editor" , href:"/editor" },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DevioDashboard({ onBackToLanding, onOpenEditor }) {
  const {addcodes, user, data,  logout, getuser, uploadimg, codefiles} = useAuthStore();
  const [userData, setuserdata]= useState([])

  const [avatarSrc,   setAvatarSrc]   = useState(user.profilepic);
  const [hovAvatar,   setHovAvatar]   = useState(false);
  const [savedBadge,  setSavedBadge]  = useState(false);
  const [editName,    setEditName]    = useState(false);
  const [nameInput,   setNameInput]   = useState(DEFAULT_USER.name);
  const [activeTab,   setActiveTab]   = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const fileRef = useRef(null);
  
  
  async function gethtml() {
      const response = await
      fetch(`https://auth-dusky-rho.vercel.app/api/code/getuser-html?codeid=${user._id}`,{
      method: "GET",
        mode: "cors",
        headers:{
                "content-Type": "application/json"
            }
      });
      const res = await response.json();
      if(res.success){
        toast.success("successfully fetched codes!")
        setuserdata(res.data)
      }else{
        toast.error("fetching data failed")
      }
      
  }
  useEffect(() => {
    gethtml();
  }, []);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
	   toast.success("uploading image....")
	   if(!file){
		   toast.error("Please select a file");
		   return;
	   }
	   const dat = new FormData();	
	   dat.append("file", file);
	   dat.append("upload_preset","finesse");
	   dat.append("cloud_name","db4x6r4zm");
	   const res = await fetch("https://api.cloudinary.com/v1_1/db4x6r4zm/image/upload", {
		   method: "POST",
		   body: dat
	   })
	    const uploaaded = await res.json();
		if (uploaaded.url) {
			console.log(uploaaded, uploaaded.url);

			// update user profile picture
			const respons = await fetch(`${url}/upload-img`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json",
                "authorization": `Bearer ${data.token}`,
                "client": "not-browser"
            }, 
			body:JSON.stringify({
                email: data.user.email,
                url: uploaaded.url
            })
          });
          const res = await respons.json();
		  console.log(res);
		  if(res.success === true){
			  setAvatarSrc(uploaaded.url);
			  toast.success("Profile picture uploaded successfully");
		  }else{
			toast.error("profile picture upload failed");
		  }
		   
		}else{
      console.log(err);
		   toast.error("Error uploading profile picture");
		}

  };
const QUICK_STATS = [
  { label: `Snippets `,  val: userData.length,  icon: "◻", color: "#3b82f6" },
  { label: "Reviews  // coming soon",   val: "0", icon: "💬", color: "#22d3ee" },
  { label: "Stars  // coming soon",     val: "0",icon: "★",  color: "#f59e0b" },
  { label: "Shared  // coming soon",    val: "0",  icon: "⟳",  color: "#4ade80" },
];
 const handleLogout = async() => {
		const response = await fetch(`${url}/signout`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json",
                "authorization": `Bearer ${data.token}`,
                "client": "not-browser"
            }
          });
          const res = await response.json();
			if (res.success) {
				toast.success("Logged out successfully");
			} else {
				toast.error(res.message || "Error logging out");
			}
			setTimeout(() => {
				logout(res);
			}, 1000);
		  console.log(res)
	};
  const percent  = pct(userData.length, 100);
  const color    = gColor(percent);
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={`min-h-screen overflow-x-hidden ${darkMode ? "" : "light-mode"}`}
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", background: darkMode ? "#04080f" : "#f0f4ff", color: darkMode ? "#f1f5f9" : "#0f172a", transition: "background 0.3s ease, color 0.3s ease" }}>

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          style={{ zIndex: 55 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Global CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar       { width: 4px; background: #04080f; }
        ::-webkit-scrollbar-thumb { background: #1d4ed8; border-radius: 4px; }

        /* Glass card */
        .glass {
          background: rgba(12, 20, 40, 0.7);
          border: 1px solid rgba(59, 130, 246, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .glass-bright {
          background: rgba(14, 22, 44, 0.85);
          border: 1px solid rgba(59, 130, 246, 0.25);
          backdrop-filter: blur(20px);
        }
        /* Neon glow utilities */
        .glow-blue  { box-shadow: 0 0 16px rgba(59,130,246,0.55), 0 0 32px rgba(59,130,246,0.15); }
        .glow-cyan  { box-shadow: 0 0 16px rgba(6,182,212,0.5),   0 0 32px rgba(6,182,212,0.12); }
        .text-glow  { text-shadow: 0 0 24px rgba(59,130,246,0.7); }

        /* Shine sweep */
        .shine { position:relative; overflow:hidden; }
        .shine::after { content:''; position:absolute; inset:0;
          background:linear-gradient(108deg,transparent 38%,rgba(255,255,255,0.08) 50%,transparent 62%);
          animation:shine-move 2.8s ease-in-out infinite; }
        @keyframes shine-move { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

        /* Spin ring */
        @keyframes spin-ring { to { transform: rotate(360deg); } }
        .ring-spin { animation: spin-ring 10s linear infinite; }

        /* Pulse dot */
        @keyframes pulse-glow { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.5; transform:scale(0.8)} }

        /* Fade up */
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .fade-up { animation: fade-up 0.5s ease forwards; }

        /* Tab transition */
        .tab-active {
          background: rgba(59,130,246,0.15);
          border-color: rgba(59,130,246,0.4) !important;
          color: #93c5fd;
        }

        /* Avatar hover */
        .av-hover-overlay { opacity: 0; transition: opacity 0.2s; }
        .av-wrap:hover .av-hover-overlay { opacity: 1; }

        /* Stat card hover */
        .stat-card { transition: all 0.25s ease; }
        .stat-card:hover { transform: translateY(-3px); border-color: rgba(59,130,246,0.4) !important; }

        /* Progress bar animation */
        @keyframes grow-bar { from{width:0} }
        .bar-anim { animation: grow-bar 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }

        /* Badge pulse */
        @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* Theme toggle */
        .theme-toggle-track { transition: background 0.3s ease; }
        .theme-toggle-thumb { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s ease; }

        /* Light theme overrides */
        .light-mode .glass {
          background: rgba(255,255,255,0.8);
          border-color: rgba(59,130,246,0.2);
        }
        .light-mode .glass-bright {
          background: rgba(236,242,255,0.97);
          border-color: rgba(59,130,246,0.25);
        }
        .light-mode .text-gray-100  { color: #0f172a !important; }
        .light-mode .text-gray-200  { color: #1e293b !important; }
        .light-mode .text-gray-300  { color: #334155 !important; }
        .light-mode .text-gray-400  { color: #475569 !important; }
        .light-mode .text-gray-500  { color: #64748b !important; }
        .light-mode .text-gray-600  { color: #64748b !important; }
        .light-mode .text-gray-700  { color: #94a3b8 !important; }
        .light-mode .text-white     { color: #0f172a !important; }
        .light-mode .bg-gray-800\/70 { background: rgba(203,213,225,0.5) !important; }
        .light-mode ::-webkit-scrollbar { background: #f0f4ff; }
        .light-mode ::-webkit-scrollbar-thumb { background: #93c5fd; }

        /* Sidebar */
        .sidebar { transition: width 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1); }
        .sidebar-label { transition: opacity 0.18s ease, width 0.18s ease; white-space: nowrap; overflow: hidden; }
        .nav-item { transition: all 0.18s ease; }
        .nav-item:hover { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.35) !important; }
        .nav-item.active { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.4) !important; color: #93c5fd; }
        .nav-item.active .nav-icon { color: #3b82f6; text-shadow: 0 0 10px rgba(59,130,246,0.7); }
        .nav-item.logout-item:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25) !important; }

        @media (max-width: 767px) {
          .sidebar-mobile-hidden { transform: translateX(-100%); }
          .sidebar-mobile-shown  { transform: translateX(0); }
        }
      `}</style>


      {/* ══════════════════════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 w-full glass-bright border-b border-blue-950/60 h-14 flex items-center justify-between px-4 sm:px-6" style={{ zIndex: 100 }}>
        {/* Logo + hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg glass border border-blue-900/40 hover:border-blue-600/60 transition-all mr-1"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            <span className="w-4 h-px bg-blue-400 block" />
            <span className="w-4 h-px bg-blue-400 block" />
            <span className="w-3 h-px bg-blue-400 block self-start ml-0.5" />
          </button>
          <span className=" sm:block text-gray-700">/</span>
          <span className=" sm:block text-xs text-gray-600 tracking-widest">Dashboard</span>
        </div>



        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {savedBadge && (
            <span className="text-xs text-green-400 border border-green-800/40 px-2.5 py-1 rounded-full glass" style={{ animation: "badge-pulse 1.2s ease infinite" }}>✓ Saved</span>
          )}
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-blue-400 glass border border-blue-950/50 hover:border-blue-700/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all">
            <span className="hidden sm:inline">← </span>LogOut
          </button>
          {/* Mini avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-600/50 cursor-pointer shrink-0 glow-blue" onClick={() => fileRef.current?.click()}>
            {avatarSrc ? <img src={avatarSrc} alt="av" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-xs font-black">{initials}</div>}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          SIDEBAR + MAIN CONTENT WRAPPER
      ══════════════════════════════════════════════════════ */}
      <div className="flex pt-14" style={{ minHeight: "100vh" }}>

        {/* ── SIDEBAR ── */}
        <aside
          className={`sidebar glass-bright border-r border-blue-950/60 flex flex-col shrink-0
            fixed md:sticky top-14 h-[calc(100vh-56px)] overflow-y-auto overflow-x-hidden
            ${sidebarOpen ? "sidebar-mobile-shown" : "sidebar-mobile-hidden"}
            md:translate-x-0
          `}
          style={{ zIndex: 60, width: sidebarCollapsed ? 56 : 220, top: 56 }}
        >
          {/* ── DEVIO branding header ── */}
          <div className="px-3 pt-4 pb-3 border-b border-blue-950/50"
            style={{ minHeight: sidebarCollapsed ? 56 : "auto" }}>
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black glow-blue">D/V</div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black shrink-0 glow-blue">D/V</div>
                  <span className="font-bold tracking-widest text-blue-400 text-sm text-glow">DEVIO</span>
                </div>
                {/* Collapse toggle — desktop only */}
                <button
                  className="hidden md:flex w-6 h-6 rounded-md glass border border-blue-900/40 hover:border-blue-600/60 items-center justify-center text-xs text-blue-400 hover:text-blue-300 transition-all"
                  onClick={() => setSidebarCollapsed(v => !v)}
                  title="Collapse"
                >‹</button>
              </div>
            )}
            {/* Expand button when collapsed — desktop only */}
            {sidebarCollapsed && (
              <button
                className="hidden md:flex w-6 h-6 rounded-md glass border border-blue-900/40 hover:border-blue-600/60 items-center justify-center text-xs text-blue-400 hover:text-blue-300 transition-all mx-auto mt-2"
                onClick={() => setSidebarCollapsed(v => !v)}
                title="Expand"
              >›</button>
            )}
          </div>

          {/* ── User identity block ── */}
          <div className="px-3 py-3 border-b border-blue-950/50">
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-600/50 shrink-0"
                  style={{ boxShadow: "0 0 10px rgba(59,130,246,0.3)" }}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt="av" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-xs font-black">{initials}</div>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-600/50 shrink-0"
                  style={{ boxShadow: "0 0 10px rgba(59,130,246,0.3)" }}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt="av" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-xs font-black">{initials}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-blue-400/70 tracking-wider truncate">@{user.name}</p>
                </div>
                <span className="text-xs font-bold text-cyan-300 glass border border-cyan-700/40 px-1.5 py-0.5 rounded-full shrink-0"
                  style={{ fontSize: 9, boxShadow: "0 0 8px rgba(6,182,212,0.2)" }}>FREE</span>
              </div>
            )}
          </div>

          {/* ── Nav items ── */}
          <nav className="flex flex-col gap-1 px-2 py-3 flex-1">
            {NAV_ITEMS.map(item => (
              <Link
              to={item.href}
                key={item.id}
                className={`nav-item flex items-center gap-3 px-2.5 py-2.5 rounded-xl border border-transparent text-left w-full ${activeTab === item.id ? "active" : "text-gray-500 hover:text-gray-200"}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : ""}
              >
                <span className="nav-icon text-base w-5 text-center shrink-0"
                  style={{ color: activeTab === item.id ? "#3b82f6" : "#4b5563" }}>{item.icon}</span>
                <span
                  className="sidebar-label text-xs font-bold tracking-widest uppercase"
                  style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : "auto", maxWidth: sidebarCollapsed ? 0 : 140 }}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            {/* ── Theme toggle ── */}
            <button
              className="nav-item flex items-center gap-3 px-2.5 py-2.5 rounded-xl border border-transparent w-full text-left text-gray-500 hover:text-gray-200 mt-1"
              onClick={() => setDarkMode(v => !v)}
              title={sidebarCollapsed ? (darkMode ? "Light Mode" : "Dark Mode") : ""}
            >
              {/* Icon */}
              <span className="text-base w-5 text-center shrink-0" style={{ color: darkMode ? "#f59e0b" : "#6366f1" }}>
                {darkMode ? "☀" : "☾"}
              </span>
              {/* Label + pill toggle track */}
              <span
                className="sidebar-label flex items-center justify-between flex-1"
                style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : "auto", maxWidth: sidebarCollapsed ? 0 : 140, overflow: "hidden" }}
              >
                <span className="text-xs font-bold tracking-widest uppercase" style={{ whiteSpace: "nowrap" }}>
                  {darkMode ? "Light" : "Dark"}
                </span>
                {/* Track */}
                <span
                  className="theme-toggle-track relative inline-flex items-center w-9 h-5 rounded-full ml-2 shrink-0"
                  style={{ background: darkMode ? "rgba(59,130,246,0.25)" : "rgba(99,102,241,0.25)", border: `1px solid ${darkMode ? "rgba(59,130,246,0.4)" : "rgba(99,102,241,0.4)"}` }}
                >
                  <span
                    className="theme-toggle-thumb absolute w-3.5 h-3.5 rounded-full"
                    style={{
                      transform: darkMode ? "translateX(2px)" : "translateX(18px)",
                      background: darkMode ? "#f59e0b" : "#6366f1",
                      boxShadow: darkMode ? "0 0 6px rgba(245,158,11,0.7)" : "0 0 6px rgba(99,102,241,0.7)"
                    }}
                  />
                </span>
              </span>
            </button>
          </nav>

          {/* ── Bottom: logout ── */}
          <div className="px-2 pb-4 pt-2 border-t border-blue-950/50 mt-auto">
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? "Log Out" : ""}
              className="nav-item logout-item flex items-center gap-3 px-2.5 py-2.5 rounded-xl border border-transparent w-full text-left text-gray-500 hover:text-red-400 group"
              style={{ transition: "all 0.18s ease" }}
            >
              <span className="text-base w-5 text-center shrink-0 group-hover:text-red-400" style={{ color: "#4b5563" }}>←</span>
              <span
                className="sidebar-label text-xs font-bold tracking-widest uppercase group-hover:text-red-400"
                style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : "auto", maxWidth: sidebarCollapsed ? 0 : 140 }}
              >Log Out</span>
            </button>
          </div>
        </aside>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
      <main className="relative flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8 pb-20 space-y-5" style={{ zIndex: 10 }}>

        {/* ── PROFILE HERO ────────────────────────────────────────
            Full-width banner with avatar, name, info + editor CTA
        ──────────────────────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden glass-bright fade-up" style={{ borderColor: "rgba(59,130,246,0.2)" }}>
          {/* Coloured banner strip */}
          <div className="h-24 sm:h-28 relative overflow-hidden" style={{
            background: "linear-gradient(120deg, #0d1b3e 0%, #0a1628 40%, #061224 100%)",
          }}>
            {/* Decorative horizontal lines */}
            {[10, 35, 60, 85].map(y => (
              <div key={y} style={{
                position: "absolute", left: 0, right: 0, top: `${y}%`, height: 1,
                background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.15),rgba(6,182,212,0.1),transparent)",
              }} />
            ))}
            {/* Glow orb */}
            <div style={{ position: "absolute", top: -40, left: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 65%)" }} />
            <div style={{ position: "absolute", top: -20, right: "10%", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 65%)" }} />
            {/* Top-right plan badge */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-1.5 text-xs font-bold text-cyan-300 glass border border-cyan-700/40 px-3 py-1 rounded-full"
              style={{ boxShadow: "0 0 14px rgba(6,182,212,0.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animation: "pulse-glow 1.5s ease infinite", boxShadow: "0 0 5px #22d3ee" }} />
              free Plan
            </div>
          </div>

          {/* Content row: overlaps the banner */}
          <div className="px-4 sm:px-7 pb-6 sm:pb-7 -mt-10 sm:-mt-12 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-5 sm:mb-6">

              {/* Avatar — overlaps banner */}
              <div className="av-wrap relative shrink-0 cursor-pointer" onClick={() => fileRef.current?.click()}
                onMouseEnter={() => setHovAvatar(true)} onMouseLeave={() => setHovAvatar(false)}>
                {/* Spinning ring */}
                <svg className="ring-spin absolute pointer-events-none" style={{ top: -6, left: -6, width: "calc(100% + 12px)", height: "calc(100% + 12px)" }} viewBox="0 0 108 108">
                  <circle cx="54" cy="54" r="50" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeDasharray="6 5" />
                </svg>
                {/* Second ring (counter) */}
                <svg style={{ position: "absolute", top: -10, left: -10, width: "calc(100% + 20px)", height: "calc(100% + 20px)", animation: "spin-ring 16s linear infinite reverse" }} viewBox="0 0 116 116">
                  <circle cx="58" cy="58" r="54" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="3 8" />
                </svg>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-blue-600/70"
                  style={{ boxShadow: "0 0 0 2px #04080f, 0 0 24px rgba(59,130,246,0.4)", borderWidth: 3 }}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-2xl sm:text-3xl font-black text-white">{initials}</div>}
                </div>
                <div className="av-hover-overlay absolute inset-0 rounded-full bg-gray-950/75 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base">📷</span>
                  <span className="text-xs text-blue-300 mt-0.5">Upload</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=> handleAvatar(e)} />

              {/* Name + meta — sits at bottom of avatar on mobile, right of avatar on sm+ */}
              <div className="flex-1 min-w-0 text-center sm:text-left pb-1">
              
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      Welcome back, <span className="text-blue-400 text-glow">{user.name.split(" ")[0]}</span> 👋
                    </h1>
                  </div>
                
                <p className="text-xs text-blue-500/60 tracking-widest mt-0.5 mb-3">@{user.name}</p>
                {/* Info chips */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {[
                    { icon: "✉", text: user.email },
                    { icon: "◷", text: `Joined ${formatDate(user.createdAt)}` },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full glass border border-blue-900/40 text-gray-400">
                      <span className="text-blue-400">{c.icon}</span>
                      <span className="truncate max-w-[160px] sm:max-w-none">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Change photo button */}
            <button onClick={() => fileRef.current?.click()}
              className="text-xs text-blue-400 hover:text-blue-300 glass border border-blue-800/40 hover:border-blue-600/60 px-3 py-1.5 rounded-full transition-all mb-5">
              ↑ Change profile photo
            </button>

            {/* ── Editor CTA ── */}
            <div
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "linear-gradient(120deg, rgba(29,78,216,0.25) 0%, rgba(6,182,212,0.12) 100%)", border: "1px solid rgba(59,130,246,0.3)" }}
              onClick={onOpenEditor}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(59,130,246,0.2)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              {/* Animated scanline */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.3),transparent)", animation: "scanline 3s linear infinite", top: 0 }} />
                <style>{`@keyframes scanline{0%{top:0%}100%{top:100%}}`}</style>
              </div>

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5">
                {/* Left: icon + text */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl glass border border-blue-700/50 group-hover:border-blue-400/60 flex items-center justify-center text-xl shrink-0 transition-all"
                    style={{ boxShadow: "0 0 16px rgba(59,130,246,0.2)" }}>⟨/⟩</div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors">Open Code Editor</p>
                    <p className="text-xs text-gray-500 mt-0.5">Write · Run · Share — HTML, CSS & JavaScript</p>
                  </div>
                </div>

                {/* Right: editor miniature */}
                <div className=" sm:block                    w-60 h-28 rounded-xl overflow-hidden glass border border-blue-800/30 p-3 shrink-0"
                  style={{ background: "rgba(4,8,15,0.8)",}}

                  >
                  <EditorPreview />
                </div>

                {/* Launch button */}
                
                <Link to="/editor" className="shine w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl text-white text-xs font-black tracking-wider transition-all glow-blue"
                  style={{ background: "linear-gradient(90deg, #1d4ed8, #2563eb)" }}>
                 <button>
                  Launch Editor →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK STATS ROW ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 fade-up" style={{ animationDelay: "0.1s" }}>
          {QUICK_STATS.map((s, i) => (
            <div key={s.label} className="stat-card glass rounded-2xl p-4 sm:p-5 text-center border border-blue-950/40">
              <div className="text-xl mb-1" style={{ color: s.color }}>{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: s.color, textShadow: `0 0 16px ${s.color}60` }}>
                <AnimNum target={s.val} />
              </div>
              <div className="text-xs text-gray-600 mt-1 tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SNIPPET GAUGE + ACCOUNT + ACTIVITY ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 fade-up" style={{ animationDelay: "0.2s" }}>

          {/* Snippet gauge — 2 cols */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 border border-blue-950/40 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-white">Snippet Storage</p>
                <p className="text-xs text-gray-600 mt-0.5">Saved out of 100 slots</p>
              </div>
              <div className="text-xs font-bold px-3 py-1.5 rounded-full border"
                style={{ color, borderColor: `${color}44`, background: `${color}12` }}>
                {percent >= 85 ? "⚠ Full" : percent >= 60 ? "↑ Growing" : "✓ Healthy"}
              </div>
            </div>

            <SnippetGauge saved={userData.length}  />

            {/* Stat tiles */}
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { l: "Saved",  v: userData.length,                      c: "#3b82f6" },
                { l: "Left",   v: 100 - userData.length,   c: "#22d3ee" },
                { l: "Limit",  v: 100,                        c: "#818cf8" },
              ].map(s => (
                <div key={s.l} className="rounded-xl p-2.5 text-center" style={{ background: `${s.c}0d`, border: `1px solid ${s.c}25` }}>
                  <p className="text-lg font-black" style={{ color: s.c }}>{s.v}</p>
                  <p className="text-xs text-gray-700 tracking-widest uppercase mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 rounded-full bg-gray-800/70 overflow-hidden">
                <div className="bar-anim h-full rounded-full" style={{ width: `${percent}%`, background: `linear-gradient(90deg, #1d4ed8, ${color})` }} />
              </div>
              <div className="flex justify-between text-xs mt-1.5 text-gray-700">
                <span>0</span><span style={{ color }}>{percent}%</span><span>100</span>
              </div>
            </div>
          </div>
          
                    {/* Recent activity — last col */}
          <div className="lg:col-span-1 glass rounded-2xl p-5 sm:p-6 border border-blue-950/40 flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase border-b border-white/5 pb-3">Activity/ savedCodes</p>
            {userData.map((code, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                  style={{ background: `#3b82f618`, border: `1px solid #3b82f630`, color: "#3b82f6" }}>☁</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate font-medium">{code.name}</p>
                  <p className="text-xs text-gray-600">{formatDate(code.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Account info — 1.5 cols */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 border border-blue-950/40 flex flex-col gap-4">
            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase border-b border-white/5 pb-3">Account Details</p>

            {/* User fields */}
            {[
              { icon: "✉", label: "Email",    value: user.email },
              { icon: "◷", label: "Joined",   value: formatDate(user.createdAt)},
              { icon: "◈", label: "Username", value: `@${user.name}` },
              { icon: "★", label: "Plan",     value: "free", highlight: true },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glass border border-blue-900/40 flex items-center justify-center text-sm shrink-0" style={{ color: "#3b82f6" }}>{row.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-0.5 tracking-widest uppercase">{row.label}</p>
                  {row.highlight
                    ? <span className="text-xs font-extrabold text-cyan-300 glass border border-cyan-700/40 px-2 py-0.5 rounded-full" style={{ boxShadow: "0 0 10px rgba(6,182,212,0.2)" }}>{row.value}</span>
                    : <p className="text-xs text-gray-200 truncate">{row.value}</p>
                  }
                </div>
              </div>
            ))}
          </div>


        </div>

      </main>
      </div>
    </div>
  );
}
