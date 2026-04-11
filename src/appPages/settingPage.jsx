import { useState, useRef } from "react";
import Avatar from "./component/avatar.jsx"
import "./styles/settingPage.css"
import Card from "./component/Card.jsx"
import { Link, useNavigate , useSearchParams } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import toast from 'react-hot-toast';
const url = `${import.meta.env.VITE_API_URL}`
// ─── data ──────────────────────────────────────────────────────────────────────


// Skill suggestions grouped by category
const SKILL_GROUPS = [
  {
    label: "Languages",
    color: "#fbbf24",
    skills: ["JavaScript", "TypeScript", "Python", "Rust", "Go", "PHP", "Ruby", "Swift", "Kotlin", "C++"],
  },
  {
    label: "Frontend",
    color: "#60a5fa",
    skills: ["React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Astro", "HTML", "CSS", "Tailwind", "SCSS"],
  },
  {
    label: "Backend",
    color: "#4ade80",
    skills: ["Node.js", "Express", "Fastify", "Django", "FastAPI", "Rails", "Laravel", "Spring"],
  },
  {
    label: "Tools & Other",
    color: "#c084fc",
    skills: ["Git", "Docker", "Figma", "Webpack", "Vite", "GraphQL", "REST APIs", "PostgreSQL", "MongoDB", "Redis"],
  },
];

const ALL_SKILLS = SKILL_GROUPS.flatMap(g => g.skills.map(s => ({ name: s, color: g.color, group: g.label })));
const SKILL_MAP  = Object.fromEntries(ALL_SKILLS.map(s => [s.name, s]));

const DEFAULT_SKILLS = ["JavaScript", "CSS", "React", "Node.js", "Git", "TypeScript"];


function FieldLabel({ text, required }) {
  return (
    <label style={{
      display: "block", fontSize: 11, fontWeight: 700,
      color: "#fff", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6,
    }}>
      {text}
      {required && <span style={{ color: "#3b82f6", marginLeft: 3 }}>*</span>}
    </label>
  );
}


function SectionHead({ icon, label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 20, paddingBottom: 14,
      borderBottom: "1px solid rgba(59,130,246,0.1)",
    }}>
      <span style={{ fontSize: 15, color: "#3b82f6" }}>{icon}</span>
      <h2 style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{label}</h2>
    </div>
  );
}

// ─── skill tag (removable) ────────────────────────────────────────────────────
function SkillTag({ name, onRemove }) {
  const meta = SKILL_MAP[name];
  const color = meta?.color || "#94a3b8";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px 5px 10px", borderRadius: 99,
      background: `${color}14`,
      border: `1px solid ${color}40`,
      fontSize: 12, fontWeight: 600, color,
      userSelect: "none",
      transition: "all 0.15s",
    }}>
      {name}
      {onRemove && (
        <button
          onClick={() => onRemove(name)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: `${color}90`, fontSize: 14, padding: 0, lineHeight: 1,
            display: "flex", alignItems: "center",
          }}
          title={`Remove ${name}`}
        >×</button>
      )}
    </span>
  );
}

// ─── skill suggestion pill ────────────────────────────────────────────────────
function SkillPill({ name, onClick }) {
  const meta = SKILL_MAP[name];
  const color = meta?.color || "#3b82f6";
  return (
    <button
      onClick={() => onClick(name)}
      style={{
        padding: "4px 11px", borderRadius: 99,
        background: "rgba(14,22,44,0.9)",
        border: `1px solid rgba(59,130,246,0.1)`,
        color: "#94a3b8", fontSize: 11,
        fontFamily: "inherit", cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}60`;
        e.currentTarget.style.color = color;
        e.currentTarget.style.background = `${color}0f`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.1)";
        e.currentTarget.style.color = "#475569";
        e.currentTarget.style.background = "rgba(14,22,44,0.9)";
      }}
    >+ {name}</button>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────
export default function DevioSettings({ onBack }) {
  const { addcodes, user, data,  logout, getuser, uploadimg, codefiles } = useAuthStore();
  
  const [avatarSrc, setAvatarSrc] = useState(user.profilepic);
  const [activeTab, setActiveTab] = useState("profile");
  const [skills,    setSkills]    = useState(DEFAULT_SKILLS);
  const [bio,    setBio]    = useState("");
    const [website,    setWebsite]    = useState("");
      const [github,    setGithub]    = useState("");
        const [location,    setLocation]    = useState("");
  const [skillInput,setSkillInput]= useState("");
  const [skillSearch,setSkillSearch] = useState("");
  const [savedToast,setSavedToast]= useState(false);
  const [pwForm,    setPwForm]    = useState({ current: "", next: "", confirm: "" });
  const [pwError,   setPwError]   = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [emailVal,  setEmailVal]  = useState("");
  const fileRef = useRef(null);

  

  const handleAvatar = async(e) => {
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
			const respons = await fetch(`${url}/api/auth/upload-img`, {
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
	
		  if(res.success === true){
			  setAvatarSrc(uploaaded.url);
			  toast.success("Profile picture uploaded successfully");
		  }else{
			toast.error("profile picture upload failed");
		  }
		}else{
		   toast.error("Error uploading profile picture");
		}
  };

  const save = async() => {
    toast.success("updating post......")
    try {
      const response = await fetch(`${url}/api/profile/update`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json"
            },
            body:JSON.stringify({
                bio: bio,
                website: website,
                github: github,
                location: location ,
                userId: user._id,
                skills: skills
            })
          });
          const res = await response.json();
        if (res.success) {
            toast.success("settings updated")
        }else{
          toast.success("error occured")
        }
            
    } catch (e) {
      console.log(e)
      
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const addSkill = name => {
    if (!name.trim()) return;
    const clean = name.trim();
    if (!skills.includes(clean) && skills.length < 20) {
      setSkills(s => [...s, clean]);
    }
    setSkillInput("");
    setSkillSearch("");
  };

  const removeSkill = name => setSkills(s => s.filter(x => x !== name));

  const changePassword = async() => {
    if (!pwForm.current) { setPwError("Enter your current password"); return; }
    if (pwForm.next.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords don't match"); return; }
    
    toast.success("Password uploading....")
    // changePassword Backend
    const respons = await fetch(`${url}/api/auth/changepassword`, {
            method: "PATCH",
            mode: "cors",
            headers:{
                "content-Type": "application/json",
                "authorization": `Bearer ${data.token}`,
                "client": "not-browser"
            }, 
			body:JSON.stringify({
                 oldPassword: pwForm.current,
                 newPassword: pwForm.next
            })
          });
          const res = await respons.json();
          if (res.success) {
            setPwError("");
            setPwSuccess(true);
             setPwForm({ current: "", next: "", confirm: "" });
            setTimeout(() => setPwSuccess(false), 3000);
          }else{
            setPwError("password must contain atleast 8 characters, Capital text, number and special characters or wrong current password");
          }
    
    
  };

  // filtered suggestions
  const q = skillSearch.toLowerCase();
  const suggestions = ALL_SKILLS
    .filter(s => !skills.includes(s.name) && (!q || s.name.toLowerCase().includes(q)))
    .slice(0, 24);

  const inputStyle = {
    width: "100%",
    background: "rgba(9,15,28,0.9)",
    border: "1px solid rgba(59,130,246,0.15)",
    borderRadius: 9, padding: "9px 13px",
    color: "#e2e8f0", fontSize: 13,
    fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s",
  };

  const TABS = [
    { id: "profile", icon: "◈", label: "Profile" },
    { id: "account", icon: "★", label: "Account" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04080f",
      color: "#94a3b8",
      fontFamily: "'JetBrains Mono','Fira Code',monospace",
    }}>

      {/* ── background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 55% 35% at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 55%)",
        }} />
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="sg" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="rgba(59,130,246,0.033)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sg)" />
        </svg>
      </div>

      {/* ── header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(4,8,15,0.93)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        height: 54, display: "flex", alignItems: "center",
        padding: "0 20px", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: "#1d4ed8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, color: "#fff",
            boxShadow: "0 0 10px rgba(29,78,216,0.55)",
          }}>D/V</div>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa", letterSpacing: "0.1em" }}>DEVIO</span>
          <span style={{ color: "#94a3b8", fontSize: 14 }}>/</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>settings</span>
        </div>

        {savedToast && <div className="saved-toast">✓ Changes saved!</div>}

        {onBack && (
          <button className="btn-ghost" onClick={onBack} style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 12 }}>
            ← Back
          </button>
        )}
      </header>

      {/* ── layout ── */}
      <div className="settings-wrap">

        {/* sidebar */}
        <aside className="settings-nav">
          <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
            Settings
          </p>
          <div className="tab-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span style={{ fontSize: 15 }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* content */}
        <div>

          {/* ══════════════════════════════
              PROFILE TAB
          ══════════════════════════════ */}
          {activeTab === "profile" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Avatar + basic info */}
              <Card>
                <SectionHead icon="◈" label="Public Profile" />

                {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 24, flexWrap: "wrap" }}>
                  <Avatar name={user.name} src={avatarSrc} size={172} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 5 }}>Profile photo</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12, lineHeight: 1.6 }}>
                      JPG or PNG. Shown on your posts, comments, and profile page .
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="btn-ghost" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => fileRef.current?.click()}>
                        Upload photo
                      </button>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleAvatar(e)} />
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: 16 }}>
                  <FieldLabel text="Bio" />
                  <textarea
                    className="field-input"
                    onChange={e => setBio(e.target.value.slice(0, 200))}
                    rows={3}
                    style={{ ...inputStyle, resize: "none" }}
                    placeholder="A short bio about yourself…"
                  />
                  <p style={{ fontSize: 10, color: "#1e3a6e", textAlign: "right", marginTop: 4 }}>{bio.length}/200</p>
                </div>

                {/* Website + location */}
                <div className="two-col" style={{ marginBottom: 16 }}>
                  <div>
                    <FieldLabel text="Website" />
                    <input
                      className="field-input"
                      
                      onChange={e => setWebsite(e.target.value)}
                      style={inputStyle}
                      placeholder="https://yoursite.com"
                    />
                  </div>
                  <div>
                    <FieldLabel text="Location" />
                    <input
                      className="field-input"
                      onChange={e => setLocation(e.target.value)}
                      style={inputStyle}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Github*/}
                <div className="two-col">
                  <div>
                    <FieldLabel text="GitHub" />
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 13, pointerEvents: "none" }}>⌥</span>
                      <input
                        className="field-input"
                        onChange={e => setGithub(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 28 }}
                        placeholder="GitHub link"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
                  <button className="btn-primary" onClick={save}>Save profile</button>
                </div>
              </Card>

              {/* ── Skills section ── */}
              <Card>
                <SectionHead icon="✦" label="Skills & Technologies" />

                <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65, marginBottom: 18 }}>
                  Add the languages, frameworks, and tools you work with. These show on your public profile and help others find your snippets.
                </p>

                {/* Current skills */}
                {skills.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    {skills.map(s => (
                      <SkillTag key={s} name={s} onRemove={removeSkill} />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    borderRadius: 10, padding: "14px 16px", marginBottom: 20,
                    background: "rgba(59,130,246,0.04)", border: "1px dashed rgba(59,130,246,0.15)",
                    color: "#94a3b8", fontSize: 12, textAlign: "center",
                  }}>
                    No skills added yet — pick some below or type your own.
                  </div>
                )}

                {/* Custom skill input */}
                <div style={{ marginBottom: 20 }}>
                  <FieldLabel text="Add a custom skill" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="field-input"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); }
                      }}
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Type a skill and press Enter…"
                      maxLength={30}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => addSkill(skillInput)}
                      style={{ padding: "9px 16px", fontSize: 12, flexShrink: 0 }}
                    >Add</button>
                  </div>
                </div>

                {/* Search + suggestions */}
                <div>
                  <FieldLabel text="Browse suggestions" />
                  <input
                    className="field-input"
                    value={skillSearch}
                    onChange={e => setSkillSearch(e.target.value)}
                    style={{ ...inputStyle, marginBottom: 14 }}
                    placeholder="Filter suggestions…"
                  />

                  {/* Grouped suggestions */}
                  {skillSearch
                    ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {suggestions.map(s => (
                          <SkillPill key={s.name} name={s.name} onClick={addSkill} />
                        ))}
                        {suggestions.length === 0 && (
                          <p style={{ fontSize: 12, color: "#94a3b8" }}>No matches — press Enter to add "{skillSearch}" as a custom skill.</p>
                        )}
                      </div>
                    )
                    : SKILL_GROUPS.map(group => {
                        const available = group.skills.filter(s => !skills.includes(s));
                        if (available.length === 0) return null;
                        return (
                          <div key={group.label} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: group.color, display: "inline-block", flexShrink: 0 }} />
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.07em", textTransform: "uppercase" }}>{group.label}</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                              {available.map(s => (
                                <SkillPill key={s} name={s} onClick={addSkill} />
                              ))}
                            </div>
                          </div>
                        );
                      })
                  }
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, flexWrap: "wrap", gap: 10 }}>
                  <p style={{ fontSize: 11, color: "#94a3b8" }}>{skills.length}/20 skills added</p>
                  <button className="btn-primary" onClick={save}>Save skills</button>
                </div>
              </Card>

            </div>
          )}

          {/* ══════════════════════════════
              ACCOUNT TAB
          ══════════════════════════════ */}
          {activeTab === "account" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Password */}
              <Card>
                <SectionHead icon="🔒" label="Change password" />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Current password", key: "current" },
                    { label: "New password",     key: "next"    },
                    { label: "Confirm new",      key: "confirm" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <FieldLabel text={label} />
                      <input
                        className="field-input"
                        type="password"
                        value={pwForm[key]}
                        onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                        style={inputStyle}
                        placeholder="••••••••"
                      />
                    </div>
                  ))}

                  {pwError   && <p style={{ fontSize: 11, color: "#f87171", marginTop: -4 }}>{pwError}</p>}
                  {pwSuccess && <p style={{ fontSize: 11, color: "#4ade80", marginTop: -4 }}>✓ Password updated successfully</p>}

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                    <button className="btn-primary" onClick={changePassword}>Update password</button>
                  </div>
                </div>
              </Card>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
