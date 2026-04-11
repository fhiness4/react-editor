import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function NavDropdown({ onNavigate, NAV_PAGES }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: open ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 9, padding: "6px 12px", cursor: "pointer",
          color: open ? "#93c5fd" : "#64748b",
          fontSize: 12, fontFamily: "inherit", fontWeight: 600,
          transition: "all 0.18s",
        }}
      >
        <span style={{ fontSize: 15, lineHeight: 1 }}>☰</span>
        <span style={{ display: "none" }} className="nav-label">Pages</span>
        <span style={{
          fontSize: 9, display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s", marginLeft: 2,
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: 220, 
          background: "#09111f",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 12,
          boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.05)",
          overflow: "hidden",
          animation: "dd-in 0.18s ease",
        }}>
          <div style={{zIndex: 786669000000000000000000000000000000000000000000000000000000, padding: "8px 0" }}>
            <div style={{ padding: "6px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>Navigate</span>
            </div>
            {NAV_PAGES.map((page) => (
              <Link
                to={page.to}
                key={page.label}
                onClick={() => { setOpen(false); onNavigate?.(page.label); }}
                style={{
                  zIndex: 900000000000000000000000099999999999900000,
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "9px 14px", border: "none", cursor: "pointer", textAlign: "left",
                  background: page.active ? "rgba(59,130,246,0.1)" : "transparent",
                  borderLeft: `2px solid ${page.active ? "#3b82f6" : "transparent"}`,
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => { if (!page.active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!page.active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0, color: page.active ? "#60a5fa" : "#475569" }}>
                  {page.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: page.active ? "#93c5fd" : "#e2e8f0", marginBottom: 1 }}>{page.label}</div>
                  <div style={{ fontSize: 10, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{page.desc}</div>
                </div>
                {page.active && <span style={{ fontSize: 9, color: "#3b82f6", fontWeight: 700, flexShrink: 0 }}>HERE</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
