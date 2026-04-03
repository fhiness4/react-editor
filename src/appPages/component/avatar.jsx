export default function Avatar({ name, src, size = 80, color = "#1d4ed8" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
      border: "2px solid rgba(59,130,246,0.35)",
      boxShadow: "0 0 20px rgba(59,130,246,0.25)",
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${color}, #0d1b3e)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.32, fontWeight: 900, color: "#fff", userSelect: "none",
          }}>{name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</div>
      }
    </div>
  );
}