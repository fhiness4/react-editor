import React, { useState, useRef, useEffect } from 'react';
import toast from "react-hot-toast";
import './App.css';
const Saving = ({onclose, html, css, js, userId}) => {
  const [name, setName] = useState("");
  const [saving, setsaving]= useState(false)
  
  const url = import.meta.env.VITE_API_URL;
   async function createhtml() {
     setsaving(true)
    try {
        const response = await fetch(
        `${url}/api/code/add-html`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            html: html,
            name: name,
            css: css,
            js: js,
            userId: userId
   })
        });
        const data = await response.json();

        if (data.success) {
          setsaving(false)
          onclose()
          toast.success('code added')
        }else{
          setsaving(false)
          onclose()
          toast.error("error adding code")
        }
    } catch (error) {
        setsaving(false)
        console.error('Error:', error);
        throw error;
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
                      onClick={()=> createhtml()}
                      >{saving ? "saving...": "Add name"}
                      </button>
            
                    </div>
                  </div>
                
            </div>
          </div>
        </div>
  );
};

export default Saving;