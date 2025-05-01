import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

// Styled component for the full page container
const FullPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e7c7c, #f8f9fa);
  font-family: 'Arial', sans-serif;
  color: #333;
  text-align: center;
`;

// Styled component for the navigation links at the top
const NavBar = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px 30px;
  border-radius: 10px;
`;

// Styled Link component for navigation buttons
const NavButton = styled(Link)`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Styled component for regular buttons like Logout
const Button = styled.button`
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const DashboardContent = styled.div`
  max-width: 500px;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 120px;
`;

const Title = styled.h2`
  font-size: 30px;
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 18px;
  color: #666;
`;

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <FullPageContainer>
      <NavBar>
        <NavButton to="/login">Login</NavButton>
        <NavButton to="/register">Register</NavButton>
        <Button onClick={handleLogout}>Logout</Button>
      </NavBar>

      <DashboardContent>
        <Title>Welcome to the Dashboard</Title>
        <Description>
          This is the dashboard for logged-in users. You can manage your profile,
          settings, and more here.
        </Description>
      </DashboardContent>
    </FullPageContainer>
  );
}

export default Dashboard;
