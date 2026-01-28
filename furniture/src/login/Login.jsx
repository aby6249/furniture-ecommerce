import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) navigate('/', { replace: true });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${email}&password=${password}`
      );

      if (res.data.length > 0) {
        const loggedInUser = res.data[0];

        if (loggedInUser.isBlocked || loggedInUser.isDeleted) {
          toast.error('Access denied! You are blocked or deleted.');
          return;
        }

        localStorage.setItem('user', JSON.stringify(loggedInUser));
        window.dispatchEvent(new Event('userUpdated'));

        toast.success('Login successful!', {
          autoClose: 1500,
          onClose: () => {
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
              localStorage.removeItem('redirectAfterLogin');
              navigate(redirectPath, { replace: true });
            } else {


              if (loggedInUser.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
              } else {
                navigate('/user/dashboard', { replace: true });
              }

            }
          },
        });
      } else {
        toast.error('Invalid email or password!');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong.');
    }
  };

  const goToRegister = () => {
    navigate('/register', { replace: true });
  };

  return (
    <div className="body-login">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h1 className="title"><b>Login</b></h1>

          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">Login</button>

          <p className="register-text"><strong>Don't have an account?</strong></p>
          <button
            type="button"
            className="signup-button"
            onClick={goToRegister}
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
