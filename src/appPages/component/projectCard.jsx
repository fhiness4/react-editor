import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./avatar.jsx"
import { formatDate } from "../../utils/secondDate";
import { useAuthStore } from "../../store/authStore";
import toast from 'react-hot-toast';
const url = `${import.meta.env.VITE_API_URL}`


export default function ProjectCard({ project, onOpen }) {
  const { addcodes, user, data, logout, getuser, uploadimg, codefiles } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project?.likes ?? 0);

  // Sync liked + likeCount when project or user changes
  useEffect(() => {
    const isLiked = project?.likedBy?.includes(user?._id?.toString()) ?? false;
    setLiked(isLiked);
    // project.likes already includes this user's like if they liked it
    setLikeCount(project?.likes ?? 0);
  }, [project, user]);

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

  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onOpen(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0a1220",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.1)"}`,
        borderRadius: 14, overflow: "hidden", cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Image / visual preview */}
      <div style={{ height: 160, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div className="pc-img">
          <img src={project.postPic} alt="post pic" loading="lazy" />
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(to top, rgba(10,18,32,0.9), transparent)" }} />
        <div style={{ position: "absolute", top: 10, right: 10 }} />
      </div>

      {/* Content */}
      <div style={{ padding: "13px 14px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        
            <Link
            to={`/profile?id=${project.userId._id}`}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}>
          <Avatar name={project.userId.name} src={project.userId.profilepic} size={44} />
          </Link>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>@{project.userId.name}</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8" }}>{formatDate(project.createdAt)}</span>
        </div>

        <h3 style={{ fontSize: 13, fontWeight: 800, color: "#f1f5f9", margin: "0 0 5px", lineHeight: 1.3 }}>{project.title}</h3>
        <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.55, margin: "0 0 10px", flex: 1 }}>{project.description}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {project.tags.slice(0, 10).map(t => (
            <span key={t} style={{
              fontSize: 10, color: "#334155",
              background: "rgba(51,65,85,0.2)", border: "1px solid rgba(51,65,85,0.2)",
              padding: "2px 7px", borderRadius: 99,
            }}>#{t}</span>
          ))}
        </div>

        {/* Action row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          <button
            onClick={(e) => likePost(e)}
            style={{
              background: liked ? "rgba(244,114,182,0.1)" : "none",
              border: liked ? "1px solid rgba(244,114,182,0.25)" : "1px solid transparent",
              borderRadius: 6, padding: "4px 9px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
              color: liked ? "#f472b6" : "#475569", fontSize: 12,
              fontFamily: "inherit", fontWeight: 600, transition: "all 0.18s",
            }}
          >
            <span style={{ fontSize: 14, transition: "transform 0.15s", transform: liked ? "scale(1.2)" : "scale(1)", display: "inline-block" }}>
              {liked ? "♥" : "♡"}
            </span>
            {likeCount}
          </button>
            <span style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 5 }}>💬 {project.comments}</span>


          <Link
            to={`/share?id=${project.codeId}`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 13 }}>see project</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
