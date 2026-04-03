import { useEffect } from 'react';


// Define TAGS_ALL - you can expand this list
const TAGS_ALL = [
  "All",
  "animation", "hooks", "gradient", "dark", "utility", "scroll", "card", "text", "button",
  "api",
  "sass",
  "three.js",
  "tailwind",
  "gsap",
  "javascript",
  "css",
  "html"
];

function FilterDrawer({ 
  open, 
  onClose, 
  sort, 
  setSort,
  activeTag, 
  setActiveTag,
  setSearch
}) {
  
  // Add animation keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

 if (!open) return null;

  // Sort options
  const sortOptions = [
    { id: "recents", label: "🕐 Recent" },
    { id: "likes", label: "♥ Liked" }
  ];


  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 150, 
          background: "rgba(0,0,0,0.6)", 
          backdropFilter: "blur(0px)" 
        }} 
      />
      
      {/* Drawer */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 160,
        background: "#09111f",
        borderTop: "1px solid rgba(59,130,246,0.2)",
        borderRadius: "18px 18px 0 0",
        padding: "20px 20px 32px",
        maxHeight: "75vh",
        overflowY: "auto",
        animation: "slide-up 0.25s ease",
      }}>
        {/* Handle bar */}
        <div style={{ 
          width: 40, 
          height: 4, 
          borderRadius: 2, 
          background: "#1e3a6e", 
          margin: "0 auto 20px" 
        }} />

        {/* Sort Section */}
        <p style={{ 
          fontSize: 11, 
          fontWeight: 700, 
          color: "#94a3b8", 
          letterSpacing: "0.08em", 
          textTransform: "uppercase", 
          marginBottom: 10 
        }}>
          hint: wait till load before closing<br/><br/>
          Sort by 
        </p>
        <div style={{ 
          display: "flex", 
          gap: 8, 
          flexWrap: "wrap", 
          marginBottom: 20 
        }}>
          {sortOptions.map(option => (
            <button 
              key={option.id} 
              onClick={() => {
                setSearch()
                setSort(option.id)
                
              }} 
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
                fontWeight: 600,
                background: sort === option.id ? "rgba(59,130,246,0.18)" : "rgba(14,22,44,0.8)",
                border: `1px solid ${sort === option.id ? "rgba(59,130,246,0.45)" : "rgba(59,130,246,0.1)"}`,
                color: sort === option.id ? "#93c5fd" : "#475569",
                transition: "all 0.2s ease",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Tags Section */}
        <p style={{ 
          fontSize: 11, 
          fontWeight: 700, 
          color: "#94a3b8", 
          letterSpacing: "0.08em", 
          textTransform: "uppercase", 
          marginBottom: 10 
        }}>
          Tags
        </p>
        <div style={{ 
          display: "flex", 
          gap: 8, 
          flexWrap: "wrap" 
        }}>
          {TAGS_ALL.map(tag => (
            <button 
              key={tag} 
              onClick={() => { 
                setSearch()
                setActiveTag(tag)
                
              }} 
              style={{
                padding: "6px 12px",
                borderRadius: 99,
                fontSize: 11,
                fontFamily: "inherit",
                cursor: "pointer",
                background: activeTag === tag ? "rgba(59,130,246,0.18)" : "rgba(14,22,44,0.8)",
                border: `1px solid ${activeTag === tag ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.08)"}`,
                color: activeTag === tag ? "#93c5fd" : "#475569",
                fontWeight: activeTag === tag ? 700 : 400,
                transition: "all 0.2s ease",
              }}
            >
              {tag === "All" ? "All tags" : `#${tag}`}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default FilterDrawer;