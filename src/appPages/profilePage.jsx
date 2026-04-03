import { useState, useEffect, useRef } from "react";
import "./styles/profile.css"
/* ── reveal hook ── */
function useReveal(t = 0.08) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: t }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}
function Reveal({ children, delay = 0, y = 24, x = 0, style = {} }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : `translate(${x}px,${y}px)`,
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1),transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
      ...style,
    }}>{children}</div>
  );
}

/* ── avatar ── */
const AV_COLS = ["#60A5FA","#34D399","#FBBF24","#F472B6","#A78BFA","#22D3EE","#FCA5A5","#4ADE80","#FB923C"];
const avc = (n) => { let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) % AV_COLS.length; return AV_COLS[h]; };
function Av({ name, size = 36 }) {
  const col = avc(name);
  const ini = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: col + "14", border: `1.5px solid ${col}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * .35, fontWeight: 800, color: col,
      fontFamily: "'Syne',sans-serif", flexShrink: 0,
    }}>{ini}</div>
  );
}

function ago(d) {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── data ── */
const USER = {
  name: "Ryo Tanaka", handle: "@ryo.dev", role: "PRO",
  bio: "I build developer tools that live at the edge of what browsers can do. Real-time systems, creative coding, making complex things feel effortless. Previously at Stripe · Vercel.",
  location: "Tokyo, Japan", website: "ryo.dev", github: "ryotanaka", twitter: "ryo_codes",
  joinedAt: "2024-09-01T00:00:00Z",
  skills: [
    { n: "JavaScript", c: "#F7DF1E" }, { n: "TypeScript", c: "#3178C6" },
    { n: "React",      c: "#61DAFB" }, { n: "Rust",       c: "#F97316" },
    { n: "Node.js",    c: "#68D391" }, { n: "WebSockets", c: "#A78BFA" },
    { n: "WebGL/GLSL", c: "#F472B6" }, { n: "CSS",        c: "#60A5FA" },
  ],
  stats: { posts: 6, followers: 1248, following: 312, views: 89400, likes: 2140, reviews: 126 },
};

const POSTS = [
  { _id:"p1", pinned:true, hot:true,
    title:"Real-Time Collaborative Code Editor",
    description:"WebSockets + Operational Transformation + React. Live cursors, conflict resolution, multi-user sync — no locking, no dropped ops.",
    postPic:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    codeId:{ language:"JavaScript" }, tags:["JavaScript","React","WebSockets"],
    likes:284, views:12400, comments:41, createdAt:"2026-03-24T10:00:00Z" },
  { _id:"p2", hot:true,
    title:"WebGL Particle System — 10K at 60fps",
    description:"Raw WebGL, zero libraries. Custom GLSL shaders, GPU-side physics and full mouse interaction. 10,000 particles at a constant 60fps.",
    postPic:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    codeId:{ language:"GLSL" }, tags:["WebGL","JavaScript"],
    likes:421, views:18900, comments:67, createdAt:"2026-03-18T16:00:00Z" },
  { _id:"p3", hot:true,
    title:"Rust → WASM: 40× Faster Than JS",
    description:"Rewrote an image processing pipeline in Rust + WebAssembly. Benchmarked a 40× speedup. Source and integration guide included.",
    postPic:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    codeId:{ language:"Rust" }, tags:["Rust","WASM"],
    likes:388, views:20100, comments:73, createdAt:"2026-03-10T06:00:00Z" },
  { _id:"p4",
    title:"Micro-Frontend with Module Federation",
    description:"Splitting a 200k-LOC React monolith into independently deployable micro-frontends using Webpack 5. Zero-downtime migration.",
    postPic:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    codeId:{ language:"JavaScript" }, tags:["React","Architecture"],
    likes:189, views:11300, comments:44, createdAt:"2026-03-16T09:00:00Z" },
  { _id:"p5",
    title:"TypeScript Deep Utility Types",
    description:"12 advanced utility types — DeepPartial, StrictOmit, ValueOf — with real-world usage patterns for large TypeScript codebases.",
    postPic:"https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80",
    codeId:{ language:"TypeScript" }, tags:["TypeScript","JavaScript"],
    likes:247, views:13600, comments:52, createdAt:"2026-03-05T10:00:00Z" },
  { _id:"p6",
    title:"CSS Grid System for Editorial Layouts",
    description:"Zero-dependency, zero-build CSS grid. Asymmetric columns, responsive breakpoints, magazine-style compositions.",
    postPic:"https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
    codeId:{ language:"CSS" }, tags:["CSS","HTML"],
    likes:97, views:4200, comments:11, createdAt:"2026-03-19T07:00:00Z" },
];

const FOLLOWERS = ["Zara Lin","Dev Santos","Mika Torres","Chen Wei","Lena Fischer","Priya Nair","Sofia Reyes","Tom Nakashima"];
const LC = {
  JavaScript:"#F7DF1E", TypeScript:"#3178C6", React:"#61DAFB",
  CSS:"#60A5FA", HTML:"#E2622B", "Node.js":"#68D391",
  WebGL:"#F472B6", GLSL:"#F472B6", Rust:"#F97316",
  WASM:"#7C3AED", WebSockets:"#A78BFA", Architecture:"#E879F9",
};

/* ── styles ── */

export default function DevioPublicProfile() {
  const [scrolled,  setScrolled]  = useState(false);
  const [mob,       setMob]       = useState(false);
  const [tab,       setTab]       = useState("posts");
  const [followed,  setFollowed]  = useState(false);
  const [fc,        setFc]        = useState(USER.stats.followers);
  const [likes,     setLikes]     = useState({});
  const [toast,     setToast]     = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toast_ = (msg, icon = "✓") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2500);
  };

  const follow = () => {
    const next = !followed;
    setFollowed(next);
    setFc(n => next ? n + 1 : n - 1);
    toast_(next ? `Following ${USER.name}` : "Unfollowed", next ? "✓" : "·");
  };

  const like = (id, e) => {
    e.stopPropagation();
    setLikes(l => ({ ...l, [id]: !l[id] }));
  };

  
  const TABS = [
    { id: "posts",    label: "Posts",    count: POSTS.length },
    { id: "about",    label: "About",    count: null },
  ];

  return (
    <>
    



      {/* mobile menu */}
      <div className={`mob${mob ? " op" : ""}`}>
        {["Features","Explore","Pricing","Docs"].map(l => (
          <a key={l} href="#" onClick={() => setMob(false)}>{l}</a>
        ))}
        <div className="mob-btns">
          <button className="nbg">Log in</button>
          <button className="nbs">Post code</button>
        </div>
      </div>

      {/* ── COVER BAND ── */}
      <div className="cover">
        <div className="cover-grid" />
        <div className="cover-scan" />

        {/* DEVIO watermark */}
        <div className="cover-devio">
          <span className="cover-devio-text">DEVIO</span>
        </div>

        <div className="cover-fade" />
      </div>

      {/* ── IDENTITY ── */}
      <div className="id-wrap">
        <div className="id-row">
          {/* Avatar */}
          <div className="av-shell">
            <Av name={USER.name} size={96} />
            
          
          </div>

          {/* Actions */}
          <Reveal delay={0.1} x={12} y={0}>
            <div className="act-row">
              <button className="btn-ic" onClick={() => toast_("Link copied", "🔗")}>⎘</button>
              <button className="btn-ic">···</button>
            </div>
          </Reveal>
        </div>

        {/* Name / bio */}
        <Reveal delay={0.07} y={18}>
          <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <div className="pname">{USER.name}</div>
            <div className="psub">
              <span className="phandle">{USER.handle}</span>
              <span className="pbadge">{USER.name.trim(1, 7)}</span>

            </div>
            <div className="pmeta">
              <span className="pmeta-i">📍 {USER.location}</span>
              <a className="pmeta-i" href={`https://${USER.website}`} target="_blank" rel="noreferrer">
                🔗 {USER.website}
              </a>
              <a className="pmeta-i" href={`https://github.com/${USER.github}`} target="_blank" rel="noreferrer">
                ⑂ {USER.github}
              </a>
              <span className="pmeta-i">
                📅 Joined {new Date(USER.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </Reveal>
      </div>


      {/* ── TABS ── */}
      <Reveal delay={0.15} y={12}>
        <div className="tabs-strip">
          <div className="tabs-in">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab${tab === t.id ? " on" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {t.count !== null && <span className="tchip">{t.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── BODY ── */}
      <div className="body">

        {/* MAIN */}
        <div>

          {/* POSTS */}
          {tab === "posts" && (
            <Reveal>
              <div className="pgrid">
                {POSTS.map((p, i) => (
                  <Reveal key={p._id} delay={i * 0.06}>
                    <div className="pc">
                      <div className="pc-img">
                        <img src={p.postPic} alt={p.title} loading="lazy" />
                        <div className="pc-lc">
                          <div className="lcdot" style={{ background: LC[p.codeId.language] || "#888" }} />
                          {p.codeId.language}
                        </div>
                        {p.pinned && <div className="pc-pin">✦ PINNED</div>}
                      </div>
                      <div className="pc-body">
                        <div className="pc-tags">
                          {p.tags.map(t => <span key={t} className="pc-tag">{t}</span>)}
                          {p.hot && <span className="pc-hot">🔥</span>}
                        </div>
                        <div className="pc-title">{p.title}</div>
                        <div className="pc-desc">{p.description}</div>
                        <div className="pc-foot">
                          <div className="pc-time">{ago(p.createdAt)}</div>
                          <div className="pc-acts">
                            <button
                              className={`pa${likes[p._id] ? " lk" : ""}`}
                              onClick={e => like(p._id, e)}
                            >
                              {likes[p._id] ? "♥" : "♡"} {p.likes + (likes[p._id] ? 1 : 0)}
                            </button>
                            <button className="pa">💬 {p.comments}</button>
                            <button className="pa" onClick={e => { e.stopPropagation(); toast_("Copied", "🔗"); }}>⎘</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          )}

          {/* ABOUT */}
          {tab === "about" && (
            <Reveal>
              <div>
                <div className="ab-block">
                  <div className="sec-lbl">BIO</div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--t2)", lineHeight: 1.95 }}>
                    {USER.bio}
                  </p>
                </div>

                <div className="ab-block">
                  <div className="sec-lbl">SKILLS & LANGUAGES</div>
                  <div className="sk-list">
                    {USER.skills.map(s => (
                      <div key={s.n} className="sk">
                        <div className="sk-dot" style={{ background: s.c }} />
                        {s.n}
                      </div>
                    ))}
                  </div>
                </div>



                <div className="ab-block">
                  <div className="sec-lbl">LINKS</div>
                  <div className="lk-list">
                    {[
                      { icon: "🌐", lbl: "WEBSITE", val: USER.website },
                      { icon: "⑂",  lbl: "GITHUB",  val: `github.com/${USER.github}` },
                      { icon: "✦",  lbl: "TWITTER", val: `@${USER.twitter}` },
                      { icon: "✉",  lbl: "CONTACT",  val: `${USER.handle.slice(1)}@devio.io` },
                    ].map(l => (
                      <div key={l.lbl} className="lk-row" onClick={() => toast_("Copied", "🔗")}>
                        <div className="lk-ico">{l.icon}</div>
                        <div className="lk-lbl">{l.lbl}</div>
                        <div className="lk-val">{l.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="sb">

          <Reveal delay={0.15} x={14} y={0}>
            <div className="sbc">
              <div className="sbc-h">OVERVIEW</div>
              <div className="sbc-b" style={{ padding: "4px 16px" }}>
                {[
                  { icon: "✦", l: "Total posts",    v: POSTS.length },
                  { icon: "👁", l: "Total views",    v: (USER.stats.views / 1000).toFixed(1) + "K" },
                  { icon: "♥", l: "Total likes",    v: USER.stats.likes.toLocaleString() },
                  { icon: "⑂", l: "Forks received", v: "84" },
                  { icon: "💬", l: "Reviews given",  v: USER.stats.reviews },
                  { icon: "📅", l: "Joined",         v: new Date(USER.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
                ].map(r => (
                  <div key={r.l} className="sb-row">
                    <div className="sb-lbl"><span>{r.icon}</span>{r.l}</div>
                    <div className="sb-val">{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} x={14} y={0}>
            <div className="sbc">
              <div className="sbc-h">SKILLS</div>
              <div className="sbc-b">
                <div className="sk-cg">
                  {USER.skills.map(s => (
                    <div key={s.n} className="skp">
                      <div className="skpd" style={{ background: s.c }} />{s.n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>


        </aside>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span style={{ fontSize: 14 }}>{toast.icon}</span>
          {toast.msg}
        </div>
      )}
    </>
  );
}
