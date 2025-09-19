import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, TimerMode, Task, TimerSettings } from '../types';

interface TimerContextType extends AppState {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros' | 'isCompleted'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const defaultSettings: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

// Função para mapear TimerMode para propriedades do TimerSettings
const getTimeForMode = (mode: TimerMode, settings: TimerSettings): number => {
  switch (mode) {
    case 'pomodoro':
      return settings.pomodoro;
    case 'short-break':
      return settings.shortBreak;
    case 'long-break':
      return settings.longBreak;
    default:
      return settings.pomodoro;
  }
};

const initialState: AppState = {
  currentMode: 'pomodoro',
  timeLeft: defaultSettings.pomodoro * 60,
  isRunning: false,
  isPaused: false,
  completedPomodoros: 0,
  tasks: [],
  settings: defaultSettings,
};

type TimerAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'SWITCH_MODE'; payload: TimerMode }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'COMPLETE_POMODORO' }
  | { type: 'TRANSITION_TO_NEXT_MODE' };

function timerReducer(state: AppState, action: TimerAction): AppState {
  switch (action.type) {
    case 'START_TIMER':
      return { ...state, isRunning: true, isPaused: false };
    
    case 'PAUSE_TIMER':
      return { ...state, isRunning: false, isPaused: true };
    
    case 'RESET_TIMER':
      const timeInMinutes = getTimeForMode(state.currentMode, state.settings);
      return {
        ...state,
        timeLeft: timeInMinutes * 60,
        isRunning: false,
        isPaused: false,
      };
    
    case 'TICK':
      if (state.timeLeft <= 1) {
        // Timer acabou - parar o timer mas manter o modo atual por um momento
        return {
          ...state,
          timeLeft: 0,
          isRunning: false,
          isPaused: false,
        };
      }
      
      return { ...state, timeLeft: state.timeLeft - 1 };
    
    case 'SWITCH_MODE':
      const timeInMinutesForMode = getTimeForMode(action.payload, state.settings);
      return {
        ...state,
        currentMode: action.payload,
        timeLeft: timeInMinutesForMode * 60,
        isRunning: false,
        isPaused: false,
      };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        ),
      };
    
    case 'TRANSITION_TO_NEXT_MODE':
      const newCompletedPomodoros = state.currentMode === 'pomodoro' 
        ? state.completedPomodoros + 1 
        : state.completedPomodoros;
      
      // Determinar próximo modo
      let nextMode: TimerMode = 'pomodoro';
      if (state.currentMode === 'pomodoro') {
        nextMode = newCompletedPomodoros % state.settings.longBreakInterval === 0 
          ? 'long-break' 
          : 'short-break';
      }
      
      const nextTimeInMinutes = getTimeForMode(nextMode, state.settings);
      
      return {
        ...state,
        timeLeft: nextTimeInMinutes * 60,
        isRunning: false,
        isPaused: false,
        currentMode: nextMode,
        completedPomodoros: newCompletedPomodoros,
      };
    
    default:
      return state;
  }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRunning]);

  // Notificação e som quando o timer acaba
  useEffect(() => {
    console.log('Timer state:', { timeLeft: state.timeLeft, isRunning: state.isRunning, currentMode: state.currentMode });
    if (state.timeLeft === 0 && !state.isRunning) {
      console.log('Timer finalizado! Reproduzindo som...');
      // Notificação do navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Finalizado!', {
          body: `Tempo de ${state.currentMode === 'pomodoro' ? 'foco' : 'pausa'} terminou!`,
          icon: '/favicon.ico',
        });
      }
      
      // Som de finalização baseado no modo
      try {
        let audioFile = '/pomofocus-clone/sounds/kassinao.mp3'; // Som para Pomodoro
        
        // Som diferente para pausas
        if (state.currentMode === 'short-break' || state.currentMode === 'long-break') {
          audioFile = '/pomofocus-clone/sounds/chaves-tema-triste.mp3';
        }
        
        console.log('Tentando reproduzir áudio:', audioFile, 'para modo:', state.currentMode);
        
        const audio = new Audio(audioFile);
        audio.volume = 0.7; // Volume um pouco mais alto para finalização
        audio.loop = true; // Tocar em loop
        
        // Função para parar o áudio quando o mouse se mover
        const stopAudioOnMouseMove = () => {
          console.log('Parando áudio por movimento do mouse');
          audio.pause();
          audio.currentTime = 0;
          document.removeEventListener('mousemove', stopAudioOnMouseMove);
          // Fazer transição após parar o áudio
          dispatch({ type: 'TRANSITION_TO_NEXT_MODE' });
        };
        
        // Adicionar listener para parar o áudio quando o mouse se mover
        document.addEventListener('mousemove', stopAudioOnMouseMove);
        
        audio.play().then(() => {
          console.log('Áudio reproduzido com sucesso:', audioFile);
        }).catch(error => {
          console.log('Erro ao reproduzir áudio de finalização:', error);
          document.removeEventListener('mousemove', stopAudioOnMouseMove);
          // Fazer transição mesmo se o áudio falhar
          dispatch({ type: 'TRANSITION_TO_NEXT_MODE' });
        });
      } catch (error) {
        console.log('Erro ao carregar áudio de finalização:', error);
        // Fazer transição mesmo se houver erro
        dispatch({ type: 'TRANSITION_TO_NEXT_MODE' });
      }
    }
  }, [state.timeLeft, state.isRunning, state.currentMode]);

  const startTimer = () => dispatch({ type: 'START_TIMER' });
  const pauseTimer = () => dispatch({ type: 'PAUSE_TIMER' });
  const resetTimer = () => dispatch({ type: 'RESET_TIMER' });
  const switchMode = (mode: TimerMode) => dispatch({ type: 'SWITCH_MODE', payload: mode });
  
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      completedPomodoros: 0,
      isCompleted: false,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };
  
  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };
  
  const completeTask = (id: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: id });
  };

  return (
    <TimerContext.Provider
      value={{
        ...state,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
