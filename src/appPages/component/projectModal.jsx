import { useState, useRef, useEffect } from "react";
import Avatar from "./avatar.jsx"
import Comment from "./comment.jsx"
const url = `${import.meta.env.VITE_API_URL}`;
import { formatDate } from "../../utils/secondDate";
import { useAuthStore } from "../../store/authStore";
import toast from 'react-hot-toast';

export default function ProjectModal({ project, onClose }) {
  const { addcodes, user, data, logout, getuser, uploadimg, codefiles } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project?.likes ?? 0);
  const [likes, setLikes] = useState(project.likes);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  
  async function getcomment() {
    const response = await fetch(
      `${url}/api/comment/get?codeId=${project.codeId}`,
      { method: 'GET', mode: 'cors', headers: { 'content-Type': 'application/json' } }
    );
    const res = await response.json();
    if (res.success) {
      setComments(res.data)
    }else{
      setComments(null)
    }
  }
  useEffect(
    () => { 
      const isLiked = project?.likedBy?.includes(user?._id?.toString()) ?? false;
    setLiked(isLiked);
    setLikeCount(project?.likes ?? 0);
      getcomment();
      }
    , [project, user]
    );
    
const likePost = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("error occured");
      return;
    }

    // Fix 2: Use current `liked` value BEFORE toggling to decide which endpoint to call
    if (!liked) {
      // Currently not liked → like it (optimistic update)
      setLiked(true);
      setLikeCount(c => c + 1);
      const response = await fetch(`${url}/api/posts/like-post`, {
        method: "POST",
        mode: "cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ codeId: project._id, userId: user._id }),
      });
      const res = await response.json();
      if (res.liked) {
        toast.success("post liked");
      } else {
        setLiked(false); // revert on failure
        setLikeCount(c => c - 1);
        toast.error(res.message);
      }
    } else {
      // Currently liked → unlike it (optimistic update)
      setLiked(false);
      setLikeCount(c => c - 1);
      const response = await fetch(`${url}/api/posts/unlike-post`, {
        method: "PATCH",
        mode: "cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ codeId: project._id, userId: user._id }),
      });
      const res = await response.json();
      if (res.liked) {
        toast.success("post un-liked");
      } else {
        setLiked(true); // revert on failure
        setLikeCount(c => c + 1);
        toast.error("error un-liking code");
      }
    }
  };

  const submit = async() => {
    setPosting(true);
    if (user) {
      const response = await fetch(`${url}/api/comment/add`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json"
            },
            body:JSON.stringify({
                comment: text,
                codeId: project.codeId,
                userId: user._id,
            })
          });
          const res = await response.json();
          if (res.success) {
            toast.success("comment wdded")
            setPosting(false);
            setText("");
            getcomment();
            textareaRef.current?.focus();
          }
    }else{
      setPosting(false)
      toast.error("error adding comment")
    }
    // if (!text.trim() || posting) return;
    // setPosting(true);
    // setTimeout(() => {
    //   setComments(prev => [...prev, { user: "you", text: text.trim(), time: "just now", likes: 0 }]);
    //   setText(""); setPosting(false);
    //   textareaRef.current?.focus();
    // }, 380);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(2,5,12,0.88)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 660, maxHeight: "92vh", overflowY: "auto",
          background: "#090f1e", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 18, display: "flex", flexDirection: "column",
          animation: "modal-in 0.22s ease",
        }}
      >
        {/* Sticky header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "sticky", top: 0, background: "#090f1e", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
           <Avatar name={project.userId.name} src={project.userId.profilepic} size={32} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd" }}>@{project.userId.name}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{formatDate(project.createdAt)}</div>
            </div>

          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer", color: "#64748b", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ padding: "18px 18px 0" }}>
          {/* Image preview — large */}
          <div style={{
            height: 200, borderRadius: 12, overflow: "hidden",
            background: project.gradient, marginBottom: 16, position: "relative",
          }}>
                   <div className="pc-img">
                        <img src={project.postPic} alt="post pic" loading="lazy" />
                </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent)` }} />
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f1f5f9", margin: "0 0 6px" }}>{project.title}</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px", lineHeight: 1.6 }}>{project.description}</p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {project.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, color: "#475569",
                background: "rgba(71,85,105,0.12)", border: "1px solid rgba(71,85,105,0.18)",
                padding: "3px 10px", borderRadius: 99,
              }}>#{t}</span>
            ))}
          </div>

          {/* Actions */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 18,
          }}>
            <button onClick={(e) => likePost(e)} style={{
              background: liked ? "rgba(244,114,182,0.1)" : "none",
              border: liked ? "1px solid rgba(244,114,182,0.3)" : "1px solid transparent",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              color: liked ? "#f472b6" : "#64748b",
              fontSize: 13, fontFamily: "inherit", fontWeight: 700, transition: "all 0.18s",
            }}>
              <span style={{ fontSize: 16 }}>{liked ? "♥" : "♡"}</span>{likeCount}
            </button>
            <span style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 5 }}>💬 {comments.length}</span>
          </div>

          {/* Comments */}
          <p style={{ fontSize: 11, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            Comments
          </p>
        <div style={{ marginBottom: 16 }}>
           {
              comments ? (
                comments.map((c, i) => (
                  <Comment key={i} c={c} getcomment={getcomment} project={project}/>
                ))
              ) : (
                
                <p>getting comments....</p>
              )
            }
          </div>
          {comments.length === 0 &&  <p style={{textAlign:"center"}}>no comment yet, be the first to comment</p>}
          
        </div>

        {/* Comment composer */}
        <div style={{
          padding: "12px 18px 18px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          position: "sticky", bottom: 0, background: "#090f1e",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
           <Avatar name={user ? user.name: "guest"} src={user? user.profilepic: ""} color="#1d4ed8" size={28} />
            <div style={{ flex: 1 }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                placeholder="Write a comment… (Enter to post)"
                rows={2}
                style={{
                  width: "100%", background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(59,130,246,0.18)", borderRadius: 10,
                  padding: "9px 12px", color: "#e2e8f0", fontSize: 12,
                  fontFamily: "inherit", resize: "none", outline: "none",
                  transition: "border-color 0.2s", boxSizing: "border-box",
                  marginBottom: 8,
                }}
                onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.18)"}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={submit} disabled={!text.trim() || posting} style={{
                  background: text.trim() ? "#1d4ed8" : "rgba(29,78,216,0.25)",
                  border: "none", borderRadius: 8, padding: "7px 18px",
                  color: text.trim() ? "#fff" : "#4b5563",
                  fontSize: 12, fontWeight: 700, fontFamily: "inherit",
                  cursor: text.trim() ? "pointer" : "default",
                  boxShadow: text.trim() ? "0 0 14px rgba(29,78,216,0.4)" : "none",
                  transition: "all 0.18s",
                }}>{posting ? "Posting…" : "Post"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
