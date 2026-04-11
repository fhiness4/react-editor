import { useState, useEffect, useRef } from "react";
import "./styles/profile.css"
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from '../store/authStore';
const url = import.meta.env.VITE_API_URL;
import ProjectCard from "./component/projectCard.jsx"
import ProjectModal from "./component/projectModal.jsx"
import Overlay from "./component/Overlay.jsx"
import NavDropdown from "./component/drop-down.jsx"
import Avatar from "./component/avatar.jsx"
import {formatDate} from "../utils/date"

import toast from "react-hot-toast";
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
/* ── reveal hook ── */
const NAV_PAGES = [
  { label: "Home",       icon: "⌂",  desc: "Back to landing page" , to : "/"     },
  { label: "Sign-up",  icon: "◈",  desc: "sign up to Devio"   , to: "/Signup" },
    { label: "Sign-in",   icon: "◉",  desc: "Sign in to Devio", to:"/login" },
  { label: "Editor",     icon: "⟨/⟩",desc: "Write & run code"   , to:"/codeEditor"       },
  { label: "Explore",    icon: "✦",  desc: "Browse the community", to:"/explore"},
];

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



function ago(timestamp) {
  if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
}



export default function DevioPublicProfile({onNavigate}) {
  const {addcodes, data,  logout, getuser, uploadimg, codefiles} = useAuthStore();
  const [searchParams] = useSearchParams();
  const [id, setId] = useState(searchParams.get('id'));
  const [user, setUser] = useState();
  const [userPost, setUserPost] = useState([]);
  const [openProject, setOpenProject] = useState(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [mob,       setMob]       = useState(false);
  const [tab,       setTab]       = useState("posts");
  const [followed,  setFollowed]  = useState(false);
  
  const [likes,     setLikes]     = useState({});
  const [isloading,     setisloading]     = useState(false);
  const [pageloading,     setpageloading]     = useState(false);
  const [toasts,     setToast]     = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toast_ = (msg, icon = "✓") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2500);
  };
  
    // get posts
  async function getPosts() {
    setisloading(true)
      const response = await
      fetch(`${url}/api/posts/single-user-post?userId=${id}`,{
      method: "GET",
        mode: "cors",
        headers:{
                "content-Type": "application/json"
            }
      });
      const res = await response.json();
      if(res.success){
        setisloading(false)
        setUserPost(res.data)
      
        
      }else{
        setUserPost([])
        setisloading(false)
        toast.error("fetching data failed")
      }
      
  }
  // get data
  
  async function getData() {
    setpageloading(true)
      const response = await
      fetch(`${url}/api/profile/get?userId=${id}`,{
      method: "GET",
        mode: "cors",
        headers:{
                "content-Type": "application/json"
            }
      });
      const res = await response.json();
      if(res.success){
        if (res.data) {
          setpageloading(false)
          setUser(res.data)
          getPosts();
        }else{
          setUser(res)
        }
       
        
      }else{
        setpageloading(false)
        setToast({msg:"error"})
        toast.error("fetching data failed")
      }
      
  }
  const total = userPost.reduce((acc, item) => {
  return {
    likes: acc.likes + item.likes,
    comments: acc.comments + item.comments
  };
}, { likes: 0, comments: 0 });

  // Function to copy current page link
  const copyPageLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
    }).catch((e) => {
      console.error(e)
    });
  };
// hand copy
const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  useEffect(() => {
    getData();
  }, []);

  
  const TABS = [
    { id: "posts",    label: "Posts",    count: userPost.length },
    { id: "about",    label: "About",    count: null },
  ];

  return (
    <>
     {pageloading &&   <Overlay email={user?.userId?.email || user?.email || "guest"}/>}
     
     
     
    { !data && <div style={{
      zIndex:9999999999,
      position: "absolute",
      right: "5px"
        }}>
    <NavDropdown onNavigate={onNavigate} NAV_PAGES={NAV_PAGES} />
    </div>}
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
          
         <div 
          style={{
            zIndex: 123
          }}
          className="av-shell">
      <Avatar name={user?.name || user?.userId?.name || "guest"} size={96} src={user?.profilepic || user?.userId?.profilepic || "profilepic"}/>
    
          
          </div>

          
         <Reveal delay={0.1} x={12} y={0}>
            <div className="act-row">
              <button className="btn-ic" onClick={() =>{
                copyPageLink()
                toast_("Link copied", "🔗")}}>⎘</button>
              <button className="btn-ic">···</button>
    
            </div>
          </Reveal>
        </div>

        {/* Name / bio */}
       <Reveal delay={0.07} y={18}>
          <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <div className="psub">
            <div className="pname">{user?.name || user?.userId?.name}</div>
              
              <span className="pbadge">@{user?.email || user?.userId?.email}</span>

            </div>
            <div className="pmeta">
             <span className="pmeta-i"
             >📍 {user?.location || "no location added"}</span>
              <a className="pmeta-i" href={`${user?.website}`} target="_blank" rel="noreferrer">
                🔗 {user?.website?.slice(0, 20) || "no website added"}...
              </a>
              <a className="pmeta-i" href={`${user?.github}`} target="_blank" rel="noreferrer">
                ⑂ {user?.github?.slice(0, 20) || "no github link added...."}
              </a>
              <span className="pmeta-i">
                📅 Joined {ago(user?.userId?.createdAt || user?.createdAt)}
                <br/>
                 🟢 active {ago(user?.updatedAt || user?.userId?.updatedAt)}
                 
                 
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

      <div className="body">

        {/* MAIN */}
        <div>
          {/* POSTS */}
         {tab === "posts" && (
            <Reveal>
           <div className="exp-grid">
              {userPost?.map((p, i) => (
                <div key={i+1} className="fade-in" style={{ animationDelay: `${i * 55}ms` }}>
             <ProjectCard project={p} onOpen={setOpenProject} />
                </div>
              ))}
            </div>
          </Reveal>
          )}
          
            {isloading &&  <LoadingSpinner/>}
           

          

          {/* ABOUT */}
          {tab === "about" && (
           <Reveal>
              <div>
                <div className="ab-block">
                  <div className="sec-lbl">BIO</div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--t2)", lineHeight: 1.95 }}>
                    {user?.bio || "no bio yet...."}
                  </p>
                </div>

                <div className="ab-block">
                  <div className="sec-lbl">SKILLS & LANGUAGES</div>
                  <div className="sk-list">
                   {user?.skills?.map((s, i) => (
                      <div key={i} className="sk">
                        <div className="sk-dot" style={{ background: "#61DAFB"}} />
                        {s}
                      </div>
                    ))}
                    
                    {!user?.skills && <p
                    style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--t2)", lineHeight: 1.95 }}>no skill added</p>}
                  </div>
                </div>



                <div className="ab-block">
                  <div className="sec-lbl">LINKS</div>
                  <div className="lk-list">
                  {  [
                      { icon: "🌐", lbl: "WEBSITE", val: `${user?.website?.slice(0, 20)+ "..." || "no website added"}`, li:user?.website },
                      { icon: "⑂",  lbl: "GITHUB",  val: `${user?.github?.slice(0, 20)+ "..." || "github link not added"}`, li:user?.github }
                    ].map(l => (
                      <div key={l.lbl} className="lk-row" onClick={() => {
                        handleCopy(l.li)
                        toast_("Copied", "🔗")}}>
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
                  { icon: "✦", l: "Total posts",    v: userPost.length },
                  { icon: "♥", l: "Total likes",    v:total.likes },
                  { icon: "💬", l: "Reviews given",  v:total.comments},
                  { icon: "📅", l: "Joined",         v: ago(user?.userId?.createdAt || user?.createdAt )},
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
                
                  {user?.skills?.map((s, i) => (
                    <div key={i} className="skp">
                      <div className="skpd" />✦ {s}
                    </div>
                  ))}
              
               {!user?.skills && (
              <div>
               no skill added
              </div>
            )}
                
                
                
                </div>
              </div>
            </div>
          </Reveal>


        </aside>
      </div>
       {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}

      {/* TOAST */}
      {toasts && (
        <div className="toast">
          <span style={{ fontSize: 14 }}>{toasts.icon}</span>
          {toasts.msg}
        </div>
      )}
    </>
  );
}
