import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(res.data.data);
    } catch (err) {
      console.error('Failed fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchTasks();
      } catch (err) {
        alert('Action unauthorized or error caught');
      }
    }
  };

  // Summary Metrics
  const totalTasks = tasks.length;

  const inProgressCount = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length;

  const highPriorityCount = tasks.filter(
    (task) => task.priority === 'High'
  ).length;

  // Filtered Tasks
  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Task Control Center Dashboard</h2>

        <button
          className="btn btn-success"
          onClick={() => navigate('/task/new')}
        >
          + Add Task
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm rounded-3 bg-light">
            <div className="card-body">
              <h6 className="text-muted">Total Tasks</h6>
              <h3>{totalTasks}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm rounded-3 bg-primary-subtle">
            <div className="card-body">
              <h6 className="text-muted">In Progress</h6>
              <h3>{inProgressCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-12 col-lg-4">
          <div className="card shadow-sm rounded-3 bg-danger-subtle">
            <div className="card-body">
              <h6 className="text-muted">High Priority</h6>
              <h3>{highPriorityCount}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Row */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

        <h5 className="mb-0">Task Status Filters</h5>

        <div className="btn-group">
          <button
            className={`btn ${
              filter === 'All'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter('All')}
          >
            All
          </button>

          <button
            className={`btn ${
              filter === 'Pending'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>

          <button
            className={`btn ${
              filter === 'In Progress'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter('In Progress')}
          >
            In Progress
          </button>

          <button
            className={`btn ${
              filter === 'Completed'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="pt-3">
        {filteredTasks.length === 0 ? (
          <p>No active workspace records matched.</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onEdit={(t) =>
                navigate(`/task/edit/${t._id}`, {
                  state: { task: t }
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;