import React, { useState, useRef, useEffect } from 'react';
import toast from "react-hot-toast";
import './navbar.css';

const Navbar = ({ userImage, logout, data, uploadimg}) => {
  const [image, setImage] = useState(userImage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const url = 'https://auth-dusky-rho.vercel.app/api/auth';
  const [isloading, setisloading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
// upload image
  const handleuploadchange = async (e)=>{
       const file = e.target.files[0];
	   setisloading(true);
	   toast.success("uploading image....")
	   if(!file){
		   toast.error("Please select a file");
		   return;

	   }
	   const dat = new FormData();	
	   dat.append("file", file);
	   dat.append("upload_preset","finesse");
	   dat.append("cloud_name","db4x6r4zm");
	   const res = await fetch("https://api.cloudinary.com/v1_1/db4x6r4zm/image/upload", {
		   method: "POST",
		   body: dat
	   })
	    const uploaaded = await res.json();
		if (uploaaded.url) {
			console.log(uploaaded, uploaaded.url);

			// update user profile picture
			const respons = await fetch(`${url}/upload-img`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json",
                "authorization": `Bearer ${data.token}`,
                "client": "not-browser"
            }, 
			body:JSON.stringify({
                email: data.user.email,
                url: uploaaded.url
            })
          });
          const res = await respons.json();
		  console.log(res);
		  if(res.success === true){
			  uploadimg(res);
			  setImage(uploaaded.url);
			  setisloading(false);
			  toast.success("Profile picture uploaded successfully");
		  }else{
		    setisloading(false)
			toast.error("profile picture upload failed");
		  }
		   
		}else{
		  setisloading(false)
            console.log(err);
		   toast.error("Error uploading profile picture");
		}

	};

  const handleLogout = async() => {
		const response = await fetch(`${url}/signout`, {
            method: "POST",
            mode: "cors",
            headers:{
                "content-Type": "application/json",
                "authorization": `Bearer ${data.token}`,
                "client": "not-browser"
            }
          });
          const res = await response.json();
			if (res.success) {
				toast.success("Logged out successfully");
			} else {
				toast.error(res.message || "Error logging out");
			}
			setTimeout(() => {
				logout(res);
			}, 1000);
		  console.log(res)
	};

  return (
    <nav className="navbar bg-gradient-to-br from-gray-900 via-gray-900
    to-gray-800">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Devio editor</h2>
        </div>

        <div className="navbar-right">

          {/* Profile section with dropdown */}
          <div className="profile-dropdown" ref={dropdownRef}>
            <div 
              className="profile-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img 
                src={image || 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="profile-image"
              />
              <span className="dropdown-arrow">▼</span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {/* Upload Image Option */}
                <div className="dropdown-item">
                  <label htmlFor="imageUpload" className="dropdown-label">
                    <span className="icon">📸</span>
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={(e)=> handleuploadchange(e)}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="dropdown-divider"></div>

                {/* Logout Option */}
                <button 
                  className="dropdown-item logout-item"
                  onClick={()=> handleLogout()}
                >
                  <span className="icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;