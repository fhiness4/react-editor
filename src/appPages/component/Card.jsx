export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(9,15,28,0.88)",
      border: "1px solid rgba(59,130,246,0.13)",
      borderRadius: 16, padding: "22px",
      ...style,
    }}>{children}</div>
  );
}
