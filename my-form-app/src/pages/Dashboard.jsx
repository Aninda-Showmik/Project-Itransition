import React, { useEffect, useState } from 'react';
import FormComponent from '../FormComponent';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

function Dashboard() {
  const { user } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [role, setRole] = useState(""); // "admin" or "user"
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Register the user to your Express backend
    const registerUserToBackend = async () => {
      if (!user) return;

      // Log to ensure we're sending the right data
      console.log("📤 Sending to backend:", {
        username: user.username || user.firstName || user.id,
        password: 'default-password-123',
      });

      try {
        await axios.post(
          'http://localhost:5000/api/register',
          {
            username: user.username || user.firstName || user.id, // Send unique username or ID
            email: user.primaryEmailAddress?.emailAddress, // Optionally send email if needed
            password: 'default-password-123',
          },
          { withCredentials: true }
        );
        console.log("✅ Backend user registered");
      } catch (err) {
        if (
          err.response?.data?.message === "Validation error" ||
          err.response?.data?.message === "SequelizeUniqueConstraintError"
        ) {
          console.log("ℹ️ User already exists in backend");
        } else {
          console.error("❌ Backend registration failed:", err);
        }
      }
    };

    registerUserToBackend();
  }, [user]);

  useEffect(() => {
    // Fetch the user's role from the backend
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true,
        });
        setRole(response.data.role); // "admin" or "user"
      } catch (err) {
        console.error("❌ Failed to fetch user role:", err);
      }
    };

    fetchUserRole();

    // Show welcome banner after successful registration
    if (localStorage.getItem("showWelcome") === "true") {
      setShowWelcome(true);
      localStorage.removeItem("showWelcome");
    }
  }, [user]);

  const handleCreateFormClick = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      {showWelcome && (
        <div className="welcome-banner">
          🎉 Welcome! Your account has been successfully created.
        </div>
      )}

      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="role-label">
          Role: <strong>{role === "admin" ? "Administrator 🛠️" : "User 🙋"}</strong>
        </p>
      </div>

      <div className="dashboard-buttons">
        {role === "admin" && (
          <>
            <button className="dashboard-btn">👥 Users</button>
            <button className="dashboard-btn">📋 All Forms</button>
          </>
        )}
        <button className="dashboard-btn primary" onClick={handleCreateFormClick}>
          {showForm ? "🔽 Hide Form" : "➕ Create Form"}
        </button>
      </div>

      {showForm && <FormComponent />}
    </div>
  );
}

export default Dashboard;
