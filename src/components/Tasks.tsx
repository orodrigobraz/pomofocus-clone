import React, { useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { Task } from '../types';
import './Tasks.css';

const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useTimer();
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);

  const handleAddTask = () => {
    if (taskName.trim()) {
      addTask({
        name: taskName.trim(),
        estimatedPomodoros,
      });
      setTaskName('');
      setEstimatedPomodoros(1);
      setShowModal(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h3>Tarefas</h3>
        <button className="tasks-options">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>

      <div className="add-task">
        <button 
          className="add-task-btn" 
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i>
          <span>Adicionar Tarefa</span>
        </button>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <p>Nenhuma tarefa adicionada ainda</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
              <div className="task-content">
                <button
                  className="task-checkbox"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <i className={`fas ${task.isCompleted ? 'fa-check' : 'fa-circle'}`}></i>
                </button>
                <div className="task-info">
                  <span className="task-name">{task.name}</span>
                  <span className="task-pomodoros">
                    {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
                  </span>
                </div>
              </div>
              <button
                className="task-delete"
                onClick={() => handleDeleteTask(task.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal para adicionar tarefa */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Nova Tarefa</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Nome da tarefa"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <div className="pomodoro-estimate">
                <label htmlFor="pomodoroEstimate">Estimativa de Pomodoros:</label>
                <input
                  type="number"
                  id="pomodoroEstimate"
                  min="1"
                  max="10"
                  value={estimatedPomodoros}
                  onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddTask}
                disabled={!taskName.trim()}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
