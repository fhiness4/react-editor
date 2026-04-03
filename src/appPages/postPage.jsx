import { useState, useRef, useEffect } from "react";
import Avatar from "./component/avatar.jsx"
import "./styles/postPage.css"
import { Link, useNavigate , useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
const url = `${import.meta.env.VITE_API_URL}`
// ─── constants ────────────────────────────────────────────────────────────────

const SUGGESTED_TAGS = ["animation", "hooks", "gradient", "dark", "utility", "scroll", "card", "text", "button",
  "api",
  "sass",
  "three.js",
  "tailwind",
  "gsap",
  "javascript",
  "css",
  "html"];

const LANG_COLOR = {
  HTML: "#60a5fa", CSS: "#f472b6", JavaScript: "#fbbf24",
  TypeScript: "#60a5fa", React: "#06b6d4", Vue: "#4ade80", SCSS: "#f472b6",
};



// ─── helper: line numbers ─────────────────────────────────────────────────────
function LineNumbers({ code }) {
  const lines = code.split("\n").length;
  return (
    <div style={{
      padding: "14px 0 14px 0", minWidth: 36, textAlign: "right",
      fontFamily: "inherit", fontSize: 12, lineHeight: "20px",
      color: "#94a3b8", userSelect: "none", borderRight: "1px solid rgba(59,130,246,0.1)",
      paddingRight: 10,
    }}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

// ─── step pill ────────────────────────────────────────────────────────────────
function StepPill({ n, label, active, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800,
        background: done ? "#1d4ed8" : active ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${done ? "#3b82f6" : active ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
        color: done ? "#fff" : active ? "#93c5fd" : "#334155",
        boxShadow: done || active ? "0 0 10px rgba(59,130,246,0.3)" : "none",
        transition: "all 0.25s",
      }}>
        {done ? "✓" : n}
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700, color: active ? "#93c5fd" : done ? "#60a5fa" : "#334155",
        display: "none", transition: "color 0.25s",
      }} className="step-label">{label}</span>
    </div>
  );
}

// ─── tag chip ────────────────────────────────────────────────────────────────
function TagChip({ tag, onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
      color: "#93c5fd", fontSize: 11, fontWeight: 600,
      padding: "3px 10px 3px 8px", borderRadius: 99,
    }}>
      #{tag}
      <button onClick={() => onRemove(tag)} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#475569", fontSize: 12, padding: 0, lineHeight: 1,
        display: "flex", alignItems: "center",
      }}>×</button>
    </span>
  );
}

// ─── field wrapper ────────────────────────────────────────────────────────────
function Field({ label, hint, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: "#3b82f6", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{hint}</p>}
    </div>
  );
}

// ─── main post page ───────────────────────────────────────────────────────────
export default function DevioPost({ onBack, onPublish }) {
  const [step, setStep]           = useState(1); // 1 = details, 2 = code, 3 = publish
  const [title, setTitle]         = useState("");
  const [desc, setDesc]           = useState("");
  const [imgSrc,   setImgSrc]   = useState("");
  const [tags, setTags]           = useState([]);
  const [tagInput, setTagInput]   = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [errors, setErrors]       = useState({});
  const fileRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [id, setId]  = useState(searchParams.get('id'));
  const [name, setname]  = useState(searchParams.get('name'));
  const [pic, setpic]  = useState(searchParams.get('pic'));
  const [userId, setuserId]  = useState(searchParams.get('userId'));
  
  const handleAvatar = async(e) => {
    toast.success("uploading...");
    const file = e.target.files?.[0];
    if(!file){
		   toast.error("Please select a file");
		   return;
	   }else{
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
		  toast.success("Post picture uploaded");
			console.log(uploaaded, uploaaded.url);
      setImgSrc(uploaaded.url)
     }else{
       toast.error("error uploading file");
     };
	   }
}
	   
  const addTag = (raw) => {
    const t = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20);
    if (t && !tags.includes(t) && tags.length < 6) setTags(p => [...p, t]);
    setTagInput("");
  };

  const validate1 = () => {
    const e = {};
    if (!title.trim())        e.title = "Title is required";
    if (!desc.trim())         e.desc  = "Description is required";
    if (!imgSrc.trim())         e.imgSrc  = "postimage is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const next = () => {
    if (step === 1 && !validate1()) return;
    setErrors({});
    setStep(s => Math.min(s + 1, 2));
  };
  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };

  const publish = async () => {
    setPublishing(true);
    try {
      const response = await fetch(`${url}/api/posts/create-post`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json"
            },
            body:JSON.stringify({
                title: title,
                description: desc,
                codeId: id,
                postPic: imgSrc,
                tags: tags,
                userId: userId,
            })
          });
          const res = await response.json();
        if (res.success) {
            setPublishing(false);
            setPublished(true);
            setTimeout(() => { onPublish?.({ title, desc, tags }); }, 1600);
        }else{
          setPublishing(false);
          toast.error("failed uploading post")
        }
            
    } catch (e) {
      console.log(e)
      setPublishing(false);
    }
    
  };

  

  if (published) {
    return (
      <div style={{
        minHeight: "100vh", background: "#04080f", fontFamily: "'JetBrains Mono','Fira Code',monospace",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 56, marginBottom: 20, animation: "pop 0.4s ease" }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#94a3b8", marginBottom: 8 }}>Your snippet is live!</h2>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 24 }}>
            <span style={{ color: "#94a3b8", fontWeight: 700 }}>"{title}"</span> has been published to the community.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
            to="/explorer"
            onClick={() => onPublish?.()} style={{
              background: "#1d4ed8", border: "none", borderRadius: 10, padding: "10px 22px",
              color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 0 16px rgba(29,78,216,0.5)",
            }}>View in Explorer →</Link>
            <Link
            to="/dashboard"
            onClick={onBack} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "10px 22px",
              color: "#64748b", fontSize: 13, fontFamily: "inherit", cursor: "pointer",
            }}>Back to Dashboard</Link>
          </div>
        </div>
        <style>{`@keyframes pop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#04080f",
      color: "#94a3b8", fontFamily: "'JetBrains Mono','Fira Code',monospace",
    }}>
    

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 40% at 20% 0%, rgba(29,78,216,0.09) 0%, transparent 55%)",
        }} />
        <svg width="100%" height="100%">
          <defs>
            <pattern id="post-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(59,130,246,0.035)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#post-grid)" />
        </svg>
      </div>

      {/* Top bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(4,8,15,0.93)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        height: 54, display: "flex", alignItems: "center",
        padding: "0 20px", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7, background: "#1d4ed8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, color: "#fff",
            boxShadow: "0 0 10px rgba(29,78,216,0.55)",
          }}>D/V</div>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa", letterSpacing: "0.1em" }}></span>
          <span style={{ color: "#94a3b8" }}>/</span>
          <span style={{ fontSize: 11, color: "#334155" }}>new post</span>
        </div>
       
          <Link
          to="/editor"
          onClick={onBack} className="btn-ghost" style={{
            color: "#94a3b8" ,padding: "5px 12px", marginLeft: "auto", fontSize: 12 }}>
            ← Back
          </Link>
      
      </header>

      {/* Page */}
      <main style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 4 }}>
            Create a new post
          </h1>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>Share a snippet, component, or trick with the community.</p>
        </div>

        {/* Step indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 28,
          background: "rgba(10,18,32,0.8)", border: "1px solid rgba(59,130,246,0.1)",
          borderRadius: 12, padding: "10px 16px",
        }}>
          {[["1","Details"],["2","Publish"]].map(([n, label], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, flex: i < 1 ? 1 : 0 }}>
              <StepPill n={n} label={label} active={step === +n} done={step > +n} />
              {i < 1 && (
                <div style={{
                  flex: 1, height: 1,
                  background: step > +n ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.05)",
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="step-card fade-up">
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9", marginBottom: 22 }}>Post details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
               <Field label="upload post image" required hint="screenshot of project, project visualization">
                 {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 24, flexWrap: "wrap" }}>
                      <div className="pc-img">
                        <img src={imgSrc} alt="post pic" loading="lazy" />
                      </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: "#334155", marginBottom: 12, lineHeight: 1.55 }}>
                      JPG or PNG, at least 200×200px. Displayed across DEVIO.
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => fileRef.current?.click()} className="btn-ghost" style={{ fontSize: 12, padding: "7px 14px" }}>Upload photo</button>
                    </div>
                     {errors.imgSrc && <span className="err">{errors.imgSrc}</span>}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
                  </div>
                </div>

              </Field>
            
            
              <Field label="Title" required hint="Keep it clear and specific — max 80 characters">
                <input
                  className="post-input"
                  value={title}
                  onChange={e => setTitle(e.target.value.slice(0, 80))}
                  placeholder="e.g. Dark glassmorphism card with hover glow"
                  maxLength={80}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  {errors.title && <span className="err">{errors.title}</span>}
                  <span style={{ fontSize: 10, color: "#1e3a6e", marginLeft: "auto" }}>{title.length}/80</span>
                </div>
              </Field>

              <Field label="Description" required hint="Explain what it does and why you built it">
                <textarea
                  className="post-input"
                  value={desc}
                  onChange={e => setDesc(e.target.value.slice(0, 300))}
                  placeholder="A short blurb about your snippet…"
                  rows={3}
                  style={{ resize: "none" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  {errors.desc && <span className="err">{errors.desc}</span>}
                  <span style={{ fontSize: 10, color: "#1e3a6e", marginLeft: "auto" }}>{desc.length}/300</span>
                </div>
              </Field>


              <Field label="Tags" hint="Up to 6 tags — press Enter or comma to add">
                {tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {tags.map(t => <TagChip key={t} tag={t} onRemove={tag => setTags(p => p.filter(x => x !== tag))} />)}
                  </div>
                )}
                <input
                  className="post-input"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                      e.preventDefault(); addTag(tagInput);
                    }
                    if (e.key === "Backspace" && !tagInput && tags.length) {
                      setTags(p => p.slice(0, -1));
                    }
                  }}
                  placeholder={tags.length >= 6 ? "Max 6 tags" : "Add a tag…"}
                  disabled={tags.length >= 6}
                />
                <div style={{
                  color: "#94a3b8", display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                  {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 30).map(t => (
                    <button
                    style={{color: "#94a3b8"}}
                    key={t} className="tag-sug" onClick={() => addTag(t)}>#{t}</button>
                  ))}
                </div>
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
              <button className="btn-primary" onClick={next}>Continue to Code →</button>
            </div>
          </div>
        )}


        {/* ── Step 2: Review & Publish ── */}
        {step === 2 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Preview card */}
            <div className="step-card">
              <p style={{ fontSize: 11, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Preview</p>

              {/* Card preview */}
              <div style={{
                background: "#0a1220", border: "1px solid rgba(59,130,246,0.15)",
                borderRadius: 12, overflow: "hidden",
              }}>
                   <div className="pc-img">
                        <img src={imgSrc} alt="post pic" loading="lazy" />
                      </div>
                <div style={{ height: 3, background: `linear-gradient(90deg,whitesmoke transparent)` }} />
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Avatar name={name} src={pic} size={38}/>
                    <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>@{name}</span>
                    <span style={{ fontSize: 10, color: "#1e3a6e", marginLeft: "auto" }}>just now</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9", marginBottom: 5 }}>{title || "Untitled"}</h3>
                  <p style={{ fontSize: 12, color: "#475569", marginBottom: 10, lineHeight: 1.55 }}>{desc || "No description."}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {tags.map(t => <span key={t} style={{ fontSize: 10, color: "#334155", border: "1px solid rgba(51,65,85,0.2)", padding: "2px 7px", borderRadius: 99, background: "rgba(51,65,85,0.12)" }}>#{t}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="step-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em" }}>Summary</p>
              {[
                ["Tags", tags.length ? tags.map(t => `#${t}`).join(", ") : "None"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#475569" }}>{k}</span>
                  <span style={{ fontSize: 12, color: "#93c5fd", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <button className="btn-ghost" onClick={back}>← Edit</button>
              <button className="btn-primary" onClick={publish} style={{ minWidth: 140, opacity: publishing ? 0.7 : 1 }}>
                {publishing ? "Publishing…" : "🚀 Publish now"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
