import { useState, useRef, useEffect } from "react";
import Avatar from "./avatar.jsx"
import { Trash2} from 'lucide-react';

import { useAuthStore } from "../../store/authStore";
import toast from 'react-hot-toast';
const url = `${import.meta.env.VITE_API_URL}`

export default function Comment({key, c , getcomment, project }) {
  const { addcodes, user, data, logout, getuser, uploadimg, codefiles } = useAuthStore();
  const [likeCount, setLikeCount] = useState(c?.likes ?? 0);
  const [liked, setLiked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  
  useEffect(() => {
    const isLiked = c?.likedBy?.includes(user?._id?.toString()) ?? false;
    const isCommented = c?.userId?._id === user?._id ? true: false;
    setLiked(isLiked);
    setIsAuth(isCommented);
    // project.likes already includes this user's like if they liked it
    setLikeCount(c?.likes ?? 0);
  }, [c, user]);

  const likeComment= async (e) => {
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
      const response = await fetch(`${url}/api/comment/like`, {
        method: "POST",
        mode: "cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ _id: c._id, userId: user._id }),
      });
      const res = await response.json();
      if (res.liked) {
        toast.success("comment liked");
      } else {
        setLiked(false); // revert on failure
        setLikeCount(c => c - 1);
        toast.error("error occured");
      }
    } else {
      // Currently liked → unlike it (optimistic update)
      setLiked(false);
      setLikeCount(c => c - 1);
      const response = await fetch(`${url}/api/comment/unlike`, {
        method: "PATCH",
        mode: "cors",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ _id: c._id, userId: user._id }),
      });
      const res = await response.json();
      if (res.liked) {
        
        toast.success("comment un-liked");
      } else {
        setLiked(true); // revert on failure
        setLikeCount(c => c + 1);
        toast.error("error un-liking comment");
      }
    }
  };
  
  
  const deleteComment = async(e) =>{
    e.stopPropagation()
    const response = await fetch(`${url}/api/comment/delete?_id=${c._id}&userId=${user._id}&codeId=${project.codeId}`, {
        method: "DELETE",
        mode: "cors",
        headers: { "content-Type": "application/json" }
      });
      const res = await response.json();
      if (res.success) {
        toast.success(res.message);
        getcomment();
      }else{
        toast.error(res.message);
      }
  }
  
  
  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  
  // Format time to show relative time or shortened format
  const formatTime = (timestamp) => {
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
  };
  
  // Function to get truncated or full comment text
  const getCommentText = () => {
    const maxLength = 150; // Adjust this value as needed
    if (expanded || c.comment.length <= maxLength) {
      return c.comment;
    }
    return c.comment.substring(0, maxLength) + "...";
  };
  
  const needsTruncation = c.comment.length > 150;
  
  return (
    <div key={key} style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <Avatar name={c.userId.name} src={c.userId.profilepic} color="#374151" size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Main comment display div */}
        <div style={{ 
          background: "rgba(255,255,255,0.03)", 
          borderRadius: 8, 
          padding: "8px 12px",
          marginBottom: 6
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd" }}>
              @{truncateText(c.userId.name, 15)}
            </span>
            <span style={{ fontSize: 10, color: "#374151" }}>
              {formatTime(c.createdAt)}
            </span>
          </div>
          
          {/* Comment text with see more/see less */}
          <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {getCommentText()}
          </p>
          
          {/* See more/see less button */}
          {needsTruncation && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0 0 0",
                color: "#93c5fd",
                fontSize: 11,
                fontWeight: 500,
                marginTop: 4,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.8"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              {expanded ? "See less" : "See more..."}
            </button>
          )}
        </div>
        
        <button onClick={(e) => likeComment(e)} style={{
          
          background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "flex", 
          justifyContent: "space-around",
          alignItems: "center", gap: 170,
          color: liked ? "#f472b6" : "#4b5563", fontSize: 11, marginTop: 6, transition: "color 0.2s",
        }}>
          <span style={{ fontSize: 13 }}>{liked ? "♥" : "♡"}  {likeCount}</span>
        
      
        </button>
          {
          isAuth &&
          <button 
          onClick={(e) => deleteComment(e)}
          style={{
            border: "1px solid gray",
            borderRadius: "5px",
          background: "none", cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center", gap: 5,
          color: "#4b5563", fontSize: 9, marginTop: 6, transition: "color 0.2s",
        }}>
          <Trash2/> 
          </button>
        }
      </div>
    </div>
  );
}