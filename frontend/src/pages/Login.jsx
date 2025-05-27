import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Basic validation
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        toast.success('Welcome back! Login successful');
        navigate('/tasks');
      } else {
        // Handle specific error messages
        if (result.message.includes('not found')) {
          toast.error('User not found. Please sign up first');
        } else if (result.message.includes('Invalid password')) {
          toast.error('Incorrect password. Please try again');
        } else {
          toast.error(result.message || 'Login failed. Please try again');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('not found')) {
        toast.error('User not found. Please sign up first');
      } else if (error.message.includes('Invalid password')) {
        toast.error('Incorrect password. Please try again');
      } else {
        toast.error(error.message || 'Failed to sign in. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <h2 className="login-title">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/signup">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;