import React, { useState, useRef, useEffect } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { Task } from '../types';
import './Tasks.css';

const Tasks: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask,
    deleteAllTasks,
    deleteCompletedTasks,
    deleteIncompleteTasks,
    markAllTasksComplete,
    markAllTasksIncomplete
  } = useTimer();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [isImportant, setIsImportant] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddTask = () => {
    if (taskName.trim()) {
      addTask({
        name: taskName.trim(),
        estimatedPomodoros,
        isImportant,
      });
      setTaskName('');
      setEstimatedPomodoros(1);
      setIsImportant(false);
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

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDeleteAllTasks = () => {
    if (window.confirm('Tem certeza que deseja deletar todas as tarefas?')) {
      deleteAllTasks();
    }
    setShowDropdown(false);
  };

  const handleDeleteCompletedTasks = () => {
    if (window.confirm('Tem certeza que deseja deletar todas as tarefas concluídas?')) {
      deleteCompletedTasks();
    }
    setShowDropdown(false);
  };

  const handleDeleteIncompleteTasks = () => {
    if (window.confirm('Tem certeza que deseja deletar todas as tarefas não concluídas?')) {
      deleteIncompleteTasks();
    }
    setShowDropdown(false);
  };

  const handleMarkAllComplete = () => {
    markAllTasksComplete();
    setShowDropdown(false);
  };

  const handleMarkAllIncomplete = () => {
    markAllTasksIncomplete();
    setShowDropdown(false);
  };

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h3>Tarefas</h3>
        <div className="tasks-options-container" ref={dropdownRef}>
          <button 
            className="tasks-options"
            onClick={handleDropdownToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
          {showDropdown && (
            <div className="tasks-dropdown">
              <button 
                className="dropdown-item"
                onClick={handleDeleteAllTasks}
              >
                <i className="fas fa-trash"></i>
                Deletar todas as tarefas
              </button>
              <button 
                className="dropdown-item"
                onClick={handleDeleteCompletedTasks}
              >
                <i className="fas fa-check-circle"></i>
                Deletar tarefas concluídas
              </button>
              <button 
                className="dropdown-item"
                onClick={handleDeleteIncompleteTasks}
              >
                <i className="fas fa-circle"></i>
                Deletar tarefas não concluídas
              </button>
              <button 
                className="dropdown-item"
                onClick={handleMarkAllComplete}
              >
                <i className="fas fa-check-double"></i>
                Marcar todas como concluídas
              </button>
              <button 
                className="dropdown-item"
                onClick={handleMarkAllIncomplete}
              >
                <i className="fas fa-undo"></i>
                Desmarcar todas as concluídas
              </button>
            </div>
          )}
        </div>
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
                  <div className="task-name-container">
                    <span className="task-name">{task.name}</span>
                    {task.isImportant && (
                      <span className="importance-indicator" title="Tarefa importante">
                        <i className="fas fa-exclamation-triangle"></i>
                      </span>
                    )}
                  </div>
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
              <div className="importance-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Marcar como importante</span>
                </label>
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
