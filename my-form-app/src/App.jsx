import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';
import './App.css';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function Home() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="home">
      <h2>Welcome! Please Sign In or Sign Up</h2>
      <SignedOut>
        <SignInButton>
          <button className="btn">Sign In</button>
        </SignInButton>
        <SignUpButton
          mode="modal"
          afterSignUpUrl="/dashboard"
          afterSignInUrl="/dashboard"
        >
          <button
            className="btn"
            onClick={() => localStorage.setItem('showWelcome', 'true')}
          >
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}

function DashboardWrapper() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return <Dashboard />;
}

function AppRoutes() {
  return (
    <>
      <nav className="navbar">
        <SignedOut>
          <SignInButton>
            <button className="btn">Sign In</button>
          </SignInButton>
          <SignUpButton
            mode="modal"
            afterSignUpUrl="/dashboard"
            afterSignInUrl="/dashboard"
          >
            <button
              className="btn"
              onClick={() => localStorage.setItem('showWelcome', 'true')}
            >
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>

      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}
