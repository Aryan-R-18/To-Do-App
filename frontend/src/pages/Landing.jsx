import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/Home.css"

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
  <div className="landing-container">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="landing-content"
    >
      <h1 className="landing-title">Welcome to Task Manager</h1>
      <p className="landing-subtitle">
        Organize your tasks efficiently and boost your productivity
      </p>

      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="landing-buttons"
        >
          <Link to="/tasks" className="landing-btn btn-primary">
            Manage Your Tasks
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="landing-buttons"
        >
          <Link to="/login" className="landing-btn btn-primary">
            Sign In
          </Link>
          <Link to="/signup" className="landing-btn btn-secondary">
            Sign Up
          </Link>
        </motion.div>
      )}
    </motion.div>
  </div>
);

};

export default Landing; 