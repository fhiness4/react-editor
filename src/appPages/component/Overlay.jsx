import "../../codeEditor/Editor.css"
import {
  Loader
} from 'lucide-react';
export default function Overlay({ email}){
  return (
    <div className="email-loading-overlay">
      <div className="email-loading-content">
        <Loader className="email-loading-spinner" size={40} />
        <h3>Loading profile</h3>
        <p>geting, @{email} profile</p>
        <div className="email-loading-progress">
          <div className="email-loading-bar"></div>
        </div>
        <span className="email-loading-text">Setting up profile...</span>
      </div>
    </div>
  );
};