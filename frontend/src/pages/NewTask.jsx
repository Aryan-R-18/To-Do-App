import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/tasks.css';

const NewTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newTask, setNewTask] = useState({
    title: '',
    body: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.addTask({
        ...newTask,
        email: user.email
      });
      toast.success('Task added successfully');
      navigate('/tasks');
    } catch (error) {
      toast.error(error.message || 'Failed to add task');
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Add New Task</h1>
        <p className="tasks-subtitle">Create a new task to manage</p>
      </div>

      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            required
            placeholder="Enter task title"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            value={newTask.body}
            onChange={(e) => setNewTask(prev => ({ ...prev, body: e.target.value }))}
            required
            placeholder="Enter task description"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input
            type="datetime-local"
            className="form-input"
            value={newTask.deadline}
            onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="form-submit-button">
            Add Task
          </button>
          <button
            type="button"
            className="task-button cancel-button"
            onClick={() => navigate('/tasks')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTask; 