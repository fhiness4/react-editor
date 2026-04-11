import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DevioExplore from "./appPages/GuestExplore.jsx"
import DevioSettings from "./appPages/settingPage.jsx"
import DevioExplorer from "./appPages/Explore.jsx"
import ProfilePage from "./appPages/profilePage.jsx"
import Codeapp from "./codeEditor/Editor";
import DevioPost from "./appPages/postPage.jsx"
import CodeShare from "./codeEditor/EditorShare.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DevioLanding from './pages/landingPage.jsx'
import LoadingSpinner from "./components/LoadingSpinner";
import DevioDashboard from './appPages/newDash.jsx'

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/' replace />;
	}

// 	if (!user.verified) {
// 		return <Navigate to='/verify-email' replace />;
// 	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.verified) {
		return <Navigate to='/dashboard' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<main style={{
		  backgroundSize: "cover"
		}}
			className='min-h-screen relative overflow-hidden'
		 >
			<FloatingShape color='bg-white-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-white-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-white-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

			<Routes>
			<Route
					path='/dashboard'
					element={
						<ProtectedRoute>
							<DevioDashboard />
						</ProtectedRoute>
					}
				/>
						<Route
					path='/setting'
					element={
						<ProtectedRoute>
							<DevioSettings />
						</ProtectedRoute>
					}
				/>
					<Route
					path='/editor'
					element={
						<ProtectedRoute>
							<Codeapp />
						</ProtectedRoute>
					}
				/>
					<Route
					path='/explorer'
					element={
						<ProtectedRoute>
							<DevioExplorer />
						</ProtectedRoute>
					}
				/>
					<Route
					path='/post'
					element={
						<ProtectedRoute>
							<DevioPost />
						</ProtectedRoute>
					}
				/>
					 <Route
					path='/profile'
					element={
						<RedirectAuthenticatedUser>
							<ProfilePage />
						</RedirectAuthenticatedUser>
					}
				/>
	        <Route
					path='/share'
					element={
						<RedirectAuthenticatedUser>
							<CodeShare />
						</RedirectAuthenticatedUser>
					}
				/>
					<Route
					path='/explore'
					element={
						<RedirectAuthenticatedUser>
							<DevioExplore />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/'
					element={
						<RedirectAuthenticatedUser>
							<DevioLanding/>
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</main>
	);
}

export default App;
