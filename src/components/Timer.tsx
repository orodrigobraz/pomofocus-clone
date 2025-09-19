import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import './Timer.css';

const Timer: React.FC = () => {
  const {
    currentMode,
    timeLeft,
    isRunning,
    completedPomodoros,
    startTimer,
    pauseTimer,
    switchMode,
  } = useTimer();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = (): string => {
    if (currentMode === 'pomodoro') {
      return `#${completedPomodoros + 1} Hora de focar!`;
    } else if (currentMode === 'short-break') {
      return `#${completedPomodoros} Hora de uma pausa!`;
    } else {
      return `#${completedPomodoros} Hora de uma pausa longa!`;
    }
  };

  const playStartSound = () => {
    try {
      let audioFile = '/pomofocus-clone/sounds/e-la-vamos-nos-hd.mp3'; // Som padrão para Pomodoro
      
      // Som diferente para pausas
      if (currentMode === 'short-break' || currentMode === 'long-break') {
        audioFile = '/pomofocus-clone/sounds/pica-pau-bolinha-de-golfe.mp3';
      }
      
      const audio = new Audio(audioFile);
      audio.volume = 0.5; // Volume em 50%
      audio.play().catch(error => {
        console.log('Erro ao reproduzir áudio:', error);
      });
    } catch (error) {
      console.log('Erro ao carregar áudio:', error);
    }
  };

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      // Solicitar permissão de notificação quando o usuário iniciar o timer
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Tocar som de início
      playStartSound();
      
      startTimer();
    }
  };

  const handleModeChange = (mode: 'pomodoro' | 'short-break' | 'long-break') => {
    switchMode(mode);
  };

  const handleNextMode = () => {
    if (currentMode === 'pomodoro') {
      switchMode('short-break');
    } else if (currentMode === 'short-break') {
      switchMode('pomodoro');
    } else {
      switchMode('pomodoro');
    }
  };

  return (
    <div className="timer-container">
      <div className={`timer-card ${currentMode}`}>
        <div className="mode-tabs">
          <button
            className={`mode-tab ${currentMode === 'pomodoro' ? 'active' : ''}`}
            onClick={() => handleModeChange('pomodoro')}
          >
            Pomodoro
          </button>
          <button
            className={`mode-tab ${currentMode === 'short-break' ? 'active' : ''}`}
            onClick={() => handleModeChange('short-break')}
          >
            Pausa Curta
          </button>
          <button
            className={`mode-tab ${currentMode === 'long-break' ? 'active' : ''}`}
            onClick={() => handleModeChange('long-break')}
          >
            Pausa Longa
          </button>
        </div>

        <div className="timer-display">
          <span>{formatTime(timeLeft)}</span>
        </div>

        <div className="timer-controls">
          <button className="start-btn" onClick={handleStartPause}>
            {isRunning ? 'PAUSAR' : 'INICIAR'}
          </button>
          {isRunning && (
            <button className="next-btn" onClick={handleNextMode}>
              <i className="fas fa-step-forward"></i>
            </button>
          )}
        </div>
      </div>

      <div className="status-message">
        <span>{getStatusText()}</span>
      </div>
    </div>
  );
};

export default Timer;
