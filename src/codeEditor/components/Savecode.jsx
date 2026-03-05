import { useAuthStore } from ".../store/authStore";
import React, { useState, useRef, useEffect } from 'react';
import toast from "react-hot-toast";
import '../App.css';
//{name, del}
const Saving = ({onclose, html, css, js, userId}) => {
  const { user, data, addcodes, codefiles,
  isLoading, message} = useAuthStore();
  const [name, setName] = useState("");
  
  function savecode() {
    addcodes(html, css, js, userId, name);
    if (isLoading) {
      toast.success("saving code.....")
    };
    if (message) {
      toast.success(message)
    }
  }
  return (
           <div className="modal-overlay" >
          <div className="modal-content" >
            <div className="modal-header">
              <h3>saving code</h3>
              <button className="close-btn"onClick={onclose} >×</button>
            </div>
            <div className="saved-list">
                  <div  className="saved-item">
                    <span className="saved-time">
                    <input
                    style={{"color":"black"}}
                    onChange={(e)=> setName(e.target.value)}
                    type="text"
                    placeholder="enter save name"/>
                    </span>
                    <div className="saved-actions">
                  
                      <button className="load-btn"
                      onClick={()=> savecode()}
                      >Add name
                      </button>
            
                    </div>
                  </div>
                
            </div>
          </div>
        </div>
  );
};

export default Saving;