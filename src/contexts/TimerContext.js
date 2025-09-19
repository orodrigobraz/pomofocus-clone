var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
var TimerContext = createContext(undefined);
var defaultSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
};
// Função para mapear TimerMode para propriedades do TimerSettings
var getTimeForMode = function (mode, settings) {
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
var initialState = {
    currentMode: 'pomodoro',
    timeLeft: defaultSettings.pomodoro * 60,
    isRunning: false,
    isPaused: false,
    completedPomodoros: 0,
    tasks: [],
    settings: defaultSettings,
};
function timerReducer(state, action) {
    switch (action.type) {
        case 'START_TIMER':
            return __assign(__assign({}, state), { isRunning: true, isPaused: false });
        case 'PAUSE_TIMER':
            return __assign(__assign({}, state), { isRunning: false, isPaused: true });
        case 'RESET_TIMER':
            var timeInMinutes = getTimeForMode(state.currentMode, state.settings);
            return __assign(__assign({}, state), { timeLeft: timeInMinutes * 60, isRunning: false, isPaused: false });
        case 'TICK':
            if (state.timeLeft <= 1) {
                // Timer acabou - parar o timer mas manter o modo atual por um momento
                return __assign(__assign({}, state), { timeLeft: 0, isRunning: false, isPaused: false });
            }
            return __assign(__assign({}, state), { timeLeft: state.timeLeft - 1 });
        case 'SWITCH_MODE':
            var timeInMinutesForMode = getTimeForMode(action.payload, state.settings);
            return __assign(__assign({}, state), { currentMode: action.payload, timeLeft: timeInMinutesForMode * 60, isRunning: false, isPaused: false });
        case 'ADD_TASK':
            return __assign(__assign({}, state), { tasks: __spreadArray(__spreadArray([], state.tasks, true), [action.payload], false) });
        case 'UPDATE_TASK':
            return __assign(__assign({}, state), { tasks: state.tasks.map(function (task) {
                    return task.id === action.payload.id
                        ? __assign(__assign({}, task), action.payload.updates) : task;
                }) });
        case 'DELETE_TASK':
            return __assign(__assign({}, state), { tasks: state.tasks.filter(function (task) { return task.id !== action.payload; }) });
        case 'COMPLETE_TASK':
            return __assign(__assign({}, state), { tasks: state.tasks.map(function (task) {
                    return task.id === action.payload
                        ? __assign(__assign({}, task), { isCompleted: !task.isCompleted }) : task;
                }) });
        case 'TRANSITION_TO_NEXT_MODE':
            var newCompletedPomodoros = state.currentMode === 'pomodoro'
                ? state.completedPomodoros + 1
                : state.completedPomodoros;
            // Determinar próximo modo
            var nextMode = 'pomodoro';
            if (state.currentMode === 'pomodoro') {
                nextMode = newCompletedPomodoros % state.settings.longBreakInterval === 0
                    ? 'long-break'
                    : 'short-break';
            }
            var nextTimeInMinutes = getTimeForMode(nextMode, state.settings);
            return __assign(__assign({}, state), { timeLeft: nextTimeInMinutes * 60, isRunning: false, isPaused: false, currentMode: nextMode, completedPomodoros: newCompletedPomodoros });
        default:
            return state;
    }
}
export function TimerProvider(_a) {
    var children = _a.children;
    var _b = useReducer(timerReducer, initialState), state = _b[0], dispatch = _b[1];
    // Timer effect
    useEffect(function () {
        var interval;
        if (state.isRunning) {
            interval = setInterval(function () {
                dispatch({ type: 'TICK' });
            }, 1000);
        }
        return function () {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [state.isRunning]);
    // Notificação e som quando o timer acaba
    useEffect(function () {
        console.log('Timer state:', { timeLeft: state.timeLeft, isRunning: state.isRunning, currentMode: state.currentMode });
        if (state.timeLeft === 0 && !state.isRunning) {
            console.log('Timer finalizado! Reproduzindo som...');
            // Notificação do navegador
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Timer Finalizado!', {
                    body: "Tempo de ".concat(state.currentMode === 'pomodoro' ? 'foco' : 'pausa', " terminou!"),
                    icon: '/favicon.ico',
                });
            }
            // Som de finalização baseado no modo
            try {
                var audioFile_1 = '/sounds/kassinao.mp3'; // Som para Pomodoro
                // Som diferente para pausas
                if (state.currentMode === 'short-break' || state.currentMode === 'long-break') {
                    audioFile_1 = '/sounds/chaves-tema-triste.mp3';
                }
                console.log('Tentando reproduzir áudio:', audioFile_1, 'para modo:', state.currentMode);
                var audio_1 = new Audio(audioFile_1);
                audio_1.volume = 0.7; // Volume um pouco mais alto para finalização
                audio_1.loop = true; // Tocar em loop
                // Função para parar o áudio quando o mouse se mover
                var stopAudioOnMouseMove_1 = function () {
                    console.log('Parando áudio por movimento do mouse');
                    audio_1.pause();
                    audio_1.currentTime = 0;
                    document.removeEventListener('mousemove', stopAudioOnMouseMove_1);
                    // Fazer transição após parar o áudio
                    dispatch({ type: 'TRANSITION_TO_NEXT_MODE' });
                };
                // Adicionar listener para parar o áudio quando o mouse se mover
                document.addEventListener('mousemove', stopAudioOnMouseMove_1);
                audio_1.play().then(function () {
                    console.log('Áudio reproduzido com sucesso:', audioFile_1);
                }).catch(function (error) {
                    console.log('Erro ao reproduzir áudio de finalização:', error);
                    document.removeEventListener('mousemove', stopAudioOnMouseMove_1);
                    // Fazer transição mesmo se o áudio falhar
                    dispatch({ type: 'TRANSITION_TO_NEXT_MODE' });
                });
            }
            catch (error) {
                console.log('Erro ao carregar áudio de finalização:', error);
                // Fazer transição mesmo se houver erro
                dispatch({ type: 'TRANSITION_TO_NEXT_MODE' });
            }
        }
    }, [state.timeLeft, state.isRunning, state.currentMode]);
    var startTimer = function () { return dispatch({ type: 'START_TIMER' }); };
    var pauseTimer = function () { return dispatch({ type: 'PAUSE_TIMER' }); };
    var resetTimer = function () { return dispatch({ type: 'RESET_TIMER' }); };
    var switchMode = function (mode) { return dispatch({ type: 'SWITCH_MODE', payload: mode }); };
    var addTask = function (taskData) {
        var newTask = __assign(__assign({}, taskData), { id: Date.now().toString(), createdAt: new Date(), completedPomodoros: 0, isCompleted: false });
        dispatch({ type: 'ADD_TASK', payload: newTask });
    };
    var updateTask = function (id, updates) {
        dispatch({ type: 'UPDATE_TASK', payload: { id: id, updates: updates } });
    };
    var deleteTask = function (id) {
        dispatch({ type: 'DELETE_TASK', payload: id });
    };
    var completeTask = function (id) {
        dispatch({ type: 'COMPLETE_TASK', payload: id });
    };
    return (_jsx(TimerContext.Provider, __assign({ value: __assign(__assign({}, state), { startTimer: startTimer, pauseTimer: pauseTimer, resetTimer: resetTimer, switchMode: switchMode, addTask: addTask, updateTask: updateTask, deleteTask: deleteTask, completeTask: completeTask }) }, { children: children })));
}
export function useTimer() {
    var context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
}
