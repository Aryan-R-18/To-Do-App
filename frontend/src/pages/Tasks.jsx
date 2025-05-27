import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    body: '',
    deadline: ''
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user?._id) return;
    
    try {
      const response = await taskAPI.getTasks(user._id);
      setTasks(response.list || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskAPI.addTask({
        ...newTask,
        email: user.email
      });
      setTasks(prev => [response.list, ...prev]);
      setNewTask({ title: '', body: '', deadline: '' });
      toast.success('Task added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId, { email: user.email });
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await taskAPI.updateTask(taskId, {
        ...updatedData,
        email: user.email
      });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? response.task : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Your Tasks</h1>
        <p className="tasks-subtitle">Manage your tasks efficiently</p>
      </div>

      <form onSubmit={handleAddTask} className="add-task-form">
        <h2 className="form-title">Add New Task</h2>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            value={newTask.body}
            onChange={(e) => setNewTask(prev => ({ ...prev, body: e.target.value }))}
            required
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
        <button type="submit" className="task-button edit-button">
          Add Task
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No tasks yet. Add your first task above!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-content">
                {editingTask?._id === task._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateTask(task._id, editingTask);
                  }}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        className="form-input form-textarea"
                        value={editingTask.body}
                        onChange={(e) => setEditingTask(prev => ({ ...prev, body: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={editingTask.deadline}
                        onChange={(e) => setEditingTask(prev => ({ ...prev, deadline: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="task-actions">
                      <button type="submit" className="task-button edit-button">
                        Save
                      </button>
                      <button
                        type="button"
                        className="task-button cancel-button"
                        onClick={() => setEditingTask(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-body">{task.body}</p>
                    <div className="task-deadline">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                    <div className="task-actions">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="task-button edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="task-button delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks; 