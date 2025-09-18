export interface Task {
  id: string;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: Date;
}

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

export interface TimerSettings {
  pomodoro: number; // em minutos
  shortBreak: number; // em minutos
  longBreak: number; // em minutos
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number; // quantos pomodoros antes da pausa longa
}

export interface AppState {
  currentMode: TimerMode;
  timeLeft: number; // em segundos
  isRunning: boolean;
  isPaused: boolean;
  completedPomodoros: number;
  tasks: Task[];
  settings: TimerSettings;
}
