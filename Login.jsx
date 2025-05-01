import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Define styled components for the elements
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e7c7c, #f8f9fa); /* Modern gradient background */
`;

const Card = styled.div`
  background-color: #fff;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff; /* Focus effect for inputs */
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const SubText = styled.p`
  margin-top: 15px;
  color: #666;
  font-size: 14px;
`;

const LinkText = styled.span`
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Simple email regex for validation
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(''); // Clear any previous errors
    setIsLoading(true); // Show loading state

    // Simulate a login process (replace this with real login logic)
    setTimeout(() => {
      const mockToken = 'your-jwt-token-here';
      localStorage.setItem('token', mockToken);
      console.log('Logged in:', { email, password });
      navigate('/'); // Redirect to Dashboard
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <Card>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={togglePasswordVisibility} style={{ margin: '10px 0', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </Button>
        <SubText>
          Don't have an account? <LinkText onClick={() => navigate('/register')}>Register</LinkText>
        </SubText>
      </Card>
    </Container>
  );
}

export default Login;
