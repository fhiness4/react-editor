import { useState, useRef, useEffect, useCallback } from "react";
import NavDropdown from "./component/drop-down.jsx"
import Avatar from "./component/avatar.jsx"
import ProjectModal from "./component/projectModal.jsx"
import ProjectCard from "./component/projectCard.jsx"
import FilterDrawer from "./component/filterDrawer.jsx"
import "./styles/explore.css"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {formatDate} from "../utils/secondDate"
const url = `${import.meta.env.VITE_API_URL}`;
import LoadingSpinner from "../components/LoadingSpinner";

const TAGS_ALL = ["All",
  "animation", "hooks", "gradient", "dark", "utility", "scroll", "card", "text", "button",
  "api",
  "sass",
  "three.js",
  "tailwind",
  "gsap",
  "javascript",
  "css",
  "html"];

// ─── Nav links for the dropdown ───────────────────────────────────────────────
const NAV_PAGES = [
  { label: "Home",       icon: "⌂",  desc: "Back to landing page" , to : "/"     },
  { label: "Sign-up",  icon: "◈",  desc: "sign up to Devio"   , to: "/Signup" },
    { label: "Sign-in",   icon: "◉",  desc: "Sign in to Devio", to:"/login" },
  { label: "Editor",     icon: "⟨/⟩",desc: "Write & run code"   , to:"/codeEditor"       },
  { label: "Explore",    icon: "✦",  desc: "Browse the community", to:"/explore",  active: true },
];

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ─── Auth Popup Modal ──────────────────────────────────────────────────────────
function AuthPopup({ onClose }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // "login" | "signup"

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(4,8,15,0.82)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "linear-gradient(160deg,#0d1a2e 0%,#060e1c 100%)",
        border: "1px solid rgba(59,130,246,0.25)",
        borderRadius: 18, padding: "36px 32px", width: "100%", maxWidth: 400,
        boxShadow: "0 0 60px rgba(29,78,216,0.18), 0 24px 48px rgba(0,0,0,0.6)",
        position: "relative",
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 16,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 7, width: 28, height: 28, cursor: "pointer",
            color: "#94a3b8", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
            lineHeight: 1,
          }}
        >×</button>

        {/* Logo + headline */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "#1d4ed8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#fff",
            boxShadow: "0 0 18px rgba(29,78,216,0.6)",
            margin: "0 auto 14px",
          }}>D/V</div>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: "#f1f5f9",
            letterSpacing: "-0.02em", margin: "0 0 6px",
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
          }}>
            {tab === "login" ? "Welcome back" : "Join DEVIO"}
          </h2>
          <p style={{
            fontSize: 12, color: "#94a3b8", margin: 0,
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
          }}>
            {tab === "login"
              ? "Sign in to like, comment & save projects."
              : "Create an account to start building & sharing."}
          </p>
        </div>

        {/* Tab toggle */}
        <div style={{
          display: "flex", background: "rgba(14,22,44,0.8)",
          borderRadius: 10, padding: 3, marginBottom: 22,
          border: "1px solid rgba(59,130,246,0.12)",
        }}>
          {["login","signup"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8,
                background: tab === t ? "rgba(59,130,246,0.2)" : "transparent",
                border: tab === t ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
                color: tab === t ? "#93c5fd" : "#64748b",
                fontSize: 12, fontWeight: tab === t ? 700 : 400,
                cursor: "pointer", fontFamily: "'JetBrains Mono','Fira Code',monospace",
                transition: "all 0.18s",
              }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate(tab === "login" ? "/login" : "/Signup")}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 10,
              background: "linear-gradient(90deg,#1d4ed8,#2563eb)",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'JetBrains Mono','Fira Code',monospace",
              boxShadow: "0 0 18px rgba(29,78,216,0.35)",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={e => e.target.style.opacity = "0.88"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            {tab === "login" ? "→ Sign In to DEVIO" : "→ Create my account"}
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "10px 0", borderRadius: 10,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#64748b", fontSize: 12,
              cursor: "pointer", fontFamily: "'JetBrains Mono','Fira Code',monospace",
              transition: "color 0.18s",
            }}
            onMouseEnter={e => e.target.style.color = "#94a3b8"}
            onMouseLeave={e => e.target.style.color = "#64748b"}
          >
            Maybe later
          </button>
        </div>

        <p style={{
          textAlign: "center", marginTop: 16, fontSize: 10,
          color: "#475569", fontFamily: "'JetBrains Mono','Fira Code',monospace",
        }}>
          By joining you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
}

// ─── Main Explorer page ───────────────────────────────────────────────────────
export default function DevioExplorer({ onNavigate }) {
  const [query,       setQuery]       = useState("");
  const [activeTag,   setActiveTag]   = useState("");
  const [sort,        setSort]        = useState("recents");
  const [page,        setPage]        = useState(1);
  const [openProject, setOpenProject] = useState(null);
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  
  // Refs to track current values
  const queryRef = useRef(query);
  const sortRef = useRef(sort);
  const tagRef = useRef(activeTag);
  const pageRef = useRef(page);
  
  // Update refs when state changes
  useEffect(() => {
    queryRef.current = query;
  }, [query]);
  
  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);
  
  useEffect(() => {
    tagRef.current = activeTag;
  }, [activeTag]);
  
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // ─── Show auth popup after 30 seconds ─────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuthPopup(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);
  
  // Main search function that uses refs for current values
  const performSearch = useCallback(async (searchQuery, sortBy, tag, page) => {
    // Use provided values or fallback to refs
    const finalQuery = searchQuery !== undefined ? searchQuery : queryRef.current;
    const finalSort = sortBy !== undefined ? sortBy : sortRef.current;
    const finalTag = tag !== undefined ? tag : tagRef.current;
    const finalpage = page !== undefined ? page : pageRef.current;
    
    setLoading(true);
    try {
      // Build URL with proper encoding
      let urlString = `${url}/api/posts/search?`;
      if (finalQuery) {
        urlString += `search=${encodeURIComponent(finalQuery)}&`;
      }
      if (finalpage) {
        urlString += `page=${encodeURIComponent(finalpage)}&`;
      }
      urlString += `sortBy=${finalSort}&`;
      if (finalTag && finalTag !== "All") {
        urlString += `tags=${encodeURIComponent(finalTag)}`;
      } else {
        urlString += `tags=`;
      }
      
      const response = await fetch(urlString, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const res = await response.json();
      if (res.success) {
        setProjects(res.data);
      } else {
        setProjects([]);
        if (res.message) {
          toast.error(res.message);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Debounced search for input changes
  const debouncedSearch = useRef(
    debounce((searchQuery) => {
      performSearch(searchQuery, sortRef.current, tagRef.current, pageRef.current);
    }, 500)
  ).current;
  
  // Get all posts — accepts page number directly to avoid stale closure
  async function getAllPosts(pageNum = 1) {
    pageNum === 1 ? setLoading(true) : setLoadingMore(true);
    setPage(pageNum)
    try {
      const response = await fetch(`${url}/api/posts/all-posts?page=${pageNum}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const res = await response.json();
      if (res.success) {
        setProjects(res.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialLoad(false);
    }
  }

  // Re-fetch whenever page changes
  useEffect(() => {
    getAllPosts(page);
  }, [page]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };
  
  // Handle sort change
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setTimeout(() => {
      performSearch(queryRef.current, newSort, tagRef.current, pageRef.current);
    }, 0);
  };
  
  // Handle tag change
  const handleTagChange = (newTag) => {
    setActiveTag(newTag);
    setTimeout(() => {
      performSearch(queryRef.current, sortRef.current, newTag, pageRef.current);
    }, 0);
  };
  
  // Handle clear filters
  const handleClearTag = () => {
    setActiveTag("");
    setTimeout(() => {
      performSearch(queryRef.current, sortRef.current, "", pageRef.current);
    }, 0);
  };
  
  const handleClearSort = () => {
    setSort("recents");
    setTimeout(() => {
      performSearch(queryRef.current, "recents", tagRef.current, pageRef.current);
    }, 0);
  };

  const activeFilters = (activeTag !== "" && activeTag !== "All" ? 1 : 0) + (sort !== "recents" ? 1 : 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04080f",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono','Fira Code',monospace",
    }}>

      {/* Auth popup after 30s */}
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-30%", left: "60%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)",
        }} />
        <svg width="100%" height="100%">
          <defs>
            <pattern id="exp-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(59,130,246,0.035)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#exp-grid)" />
        </svg>
      </div>

      {/* ── Topbar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(4,8,15,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        height: 56, display: "flex", alignItems: "center",
        padding: "0 20px", gap: 12,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7, background: "#1d4ed8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, color: "#fff",
            boxShadow: "0 0 10px rgba(29,78,216,0.55)",
          }}>D/V</div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
          {/* Search icon — was #334155, now visible */}
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 13, pointerEvents: "none" }}>⌕</span>
          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="search projects, authors, tags…"
            style={{
              width: "100%", background: "rgba(14,22,44,0.8)",
              border: "1px solid rgba(59,130,246,0.14)", borderRadius: 10,
              padding: "7px 12px 7px 30px", color: "#e2e8f0", fontSize: 12,
              fontFamily: "inherit", outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.14)"}
          />
        </div>

        {/* Mobile filter button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="exp-mobile-filter"
          style={{
            display: "none",
            alignItems: "center", gap: 6,
            background: activeFilters > 0 ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${activeFilters > 0 ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 9, padding: "6px 12px", cursor: "pointer",
            color: activeFilters > 0 ? "#93c5fd" : "#94a3b8", /* was #64748b */
            fontSize: 12, fontFamily: "inherit",
          }}
        >
          <span>⚙</span>
          {activeFilters > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeFilters}</span>}
        </button>

        <style>{`
          @media (max-width: 900px) {
            .exp-mobile-filter { display: flex !important; }
          }
        `}</style>

        {/* Result count — was #1e3a6e (near-invisible), now readable */}
        <span style={{ fontSize: 11, color: "#64748b", flexShrink: 0, marginLeft: "auto" }}>
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>

        {/* Nav dropdown */}
        <NavDropdown onNavigate={onNavigate} NAV_PAGES={NAV_PAGES} />
      </header>

      {/* ── Layout ── */}
      <div className="exp-layout" style={{ position: "relative", zIndex: 10 }}>

        {/* ── Sidebar (desktop only) ── */}
        <aside className="exp-sidebar">
          <div>
            {/* Sidebar section headings — was #334155, now #64748b for readability */}
            <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 8 }}>Sort by</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[{id:"recents",label:"🕐 Recent"},{id:"likes",label:"♥ Most liked"}].map(o => (
                <button key={o.id} onClick={() => handleSortChange(o.id)} className="sidebar-btn" style={{
                  background: sort === o.id ? "rgba(59,130,246,0.15)" : "rgba(14,22,44,0.7)",
                  border: `1px solid ${sort === o.id ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.08)"}`,
                  borderRadius: 8, padding: "8px 11px", fontSize: 11,
                  color: sort === o.id ? "#93c5fd" : "#94a3b8", /* was #475569 */
                  fontFamily: "inherit", cursor: "pointer", textAlign: "left",
                  fontWeight: sort === o.id ? 700 : 400,
                }}>{o.label}</button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 8 }}>Topics</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {TAGS_ALL.map(tag => (
                <button key={tag} onClick={() => handleTagChange(tag)} className="sidebar-btn" style={{
                  background: activeTag === tag ? "rgba(59,130,246,0.15)" : "rgba(14,22,44,0.7)",
                  border: `1px solid ${activeTag === tag ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.06)"}`,
                  borderRadius: 8, padding: "7px 11px", fontSize: 11,
                  color: activeTag === tag ? "#93c5fd" : "#64748b", /* was #334155 */
                  fontFamily: "inherit", cursor: "pointer", textAlign: "left",
                  fontWeight: activeTag === tag ? 700 : 400,
                }}>{tag === "All" ? "All topics" : `#${tag}`}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Grid ── */}
        <div>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 3 }}>Explore Projects</h1>
            {/* Subtitle — was #334155, now #94a3b8 */}
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Browse what the community is building — like, comment, share.</p>
          </div>

          {/* Active filter chips (mobile) */}
          {activeFilters > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {activeTag !== "" && activeTag !== "All" && (
                <button onClick={handleClearTag} className="filter-pill" style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 99,
                  background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
                  color: "#94a3b8", fontFamily: "inherit", cursor: "pointer",
                }}>#{activeTag} ×</button>
              )}
              {sort !== "recents" && (
                <button onClick={handleClearSort} className="filter-pill" style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 99,
                  background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
                  color: "#94a3b8", fontFamily: "inherit", cursor: "pointer",
                }}>{sort === "likes" ? "Most liked" : sort} ×</button>
              )}
            </div>
          )}

          {/* Empty state — was #334155, now #94a3b8 */}
          {projects.length === 0 && !loading ? (
            <div style={{ textAlign: "center", padding: "56px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 14 }}>Nothing matched. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="exp-grid">
              {projects.map((p, i) => (
                <div key={i+1} className="fade-in" style={{ animationDelay: `${i * 55}ms` }}>
                  <ProjectCard project={p} onOpen={setOpenProject} />
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {(page > 1 || projects.length === 10) && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 40 }}>

              {/* Previous */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: page === 1 ? "rgba(14,22,44,0.4)" : "rgba(14,22,44,0.8)",
                  border: `1px solid ${page === 1 ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.15)"}`,
                  borderRadius: 10, padding: "10px 20px",
                  color: page === 1 ? "#334155" : "#94a3b8",
                  fontSize: 12, fontFamily: "inherit",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { if (page > 1) { e.target.style.borderColor = "rgba(59,130,246,0.4)"; e.target.style.color = "#e2e8f0"; }}}
                onMouseLeave={e => { if (page > 1) { e.target.style.borderColor = "rgba(59,130,246,0.15)"; e.target.style.color = "#94a3b8"; }}}
              >← Prev</button>

              {/* Page indicator */}
              <span style={{ fontSize: 11, color: "#475569", fontFamily: "inherit", minWidth: 60, textAlign: "center" }}>
                page {page}
              </span>

              {/* Next — disabled while fetching OR when last page returned < 10 results */}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loadingMore || projects.length < 10}
                style={{
                  background: (loadingMore || projects.length < 10) ? "rgba(14,22,44,0.4)" : "rgba(14,22,44,0.8)",
                  border: `1px solid ${(loadingMore || projects.length < 10) ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.15)"}`,
                  borderRadius: 10, padding: "10px 20px",
                  color: (loadingMore || projects.length < 10) ? "#334155" : "#94a3b8",
                  fontSize: 12, fontFamily: "inherit",
                  cursor: (loadingMore || projects.length < 10) ? "not-allowed" : "pointer",
                  transition: "all 0.18s",
                  minWidth: 90, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
                onMouseEnter={e => { if (!loadingMore && projects.length === 10) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.color = "#e2e8f0"; }}}
                onMouseLeave={e => { if (!loadingMore && projects.length === 10) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)"; e.currentTarget.style.color = "#94a3b8"; }}}
              >
                {loadingMore
                  ? <><span style={{ width: 10, height: 10, border: "2px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> loading</>
                  : "Next →"
                }
              </button>

            </div>
          )}

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        setSearch={() => performSearch(queryRef.current, sortRef.current, tagRef.current, pageRef.current)}
        open={filterOpen} 
        onClose={() => {
          setFilterOpen(false)
        }
        }
        sort={sort} 
        setSort={(newSort) => {
          setSort(newSort);
          setTimeout(() => {
            performSearch(queryRef.current, newSort, tagRef.current, pageRef.current);
          }, 0);
        }}
        activeTag={activeTag} 
        setActiveTag={(newTag) => {
          setActiveTag(newTag);
          setTimeout(() => {
            performSearch(queryRef.current, sortRef.current, newTag, pageRef.current);
          }, 0);
        }}
      />

     {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
     
     {loading &&
     <div style={{position: "fixed", top:0, width: "100%"}}>
         <LoadingSpinner/>
      </div>}
    </div>
  );
}
