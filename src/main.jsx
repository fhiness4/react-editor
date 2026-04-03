import React from "react";
import ReactDOM from "react-dom/client";
import Codeapp from "./codeEditor/EditorShare.jsx";
import DevioPost from "./appPages/postPage.jsx"
 import DevioExplorer from "./appPages/GuestExplore.jsx"
import DevioPublicProfile from "./appPages/profilePage.jsx"
import DevioSettings from "./appPages/settingPage.jsx"
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
