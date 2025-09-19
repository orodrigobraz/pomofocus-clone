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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTimer } from '../contexts/TimerContext';
import './Timer.css';
var Timer = function () {
    var _a = useTimer(), currentMode = _a.currentMode, timeLeft = _a.timeLeft, isRunning = _a.isRunning, completedPomodoros = _a.completedPomodoros, startTimer = _a.startTimer, pauseTimer = _a.pauseTimer, switchMode = _a.switchMode;
    var formatTime = function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return "".concat(minutes.toString().padStart(2, '0'), ":").concat(remainingSeconds.toString().padStart(2, '0'));
    };
    var getStatusText = function () {
        if (currentMode === 'pomodoro') {
            return "#".concat(completedPomodoros + 1, " Hora de focar!");
        }
        else if (currentMode === 'short-break') {
            return "#".concat(completedPomodoros, " Hora de uma pausa!");
        }
        else {
            return "#".concat(completedPomodoros, " Hora de uma pausa longa!");
        }
    };
    var playStartSound = function () {
        try {
            var audioFile = '/pomofocus-clone/sounds/e-la-vamos-nos-hd.mp3'; // Som padrão para Pomodoro
            // Som diferente para pausas
            if (currentMode === 'short-break' || currentMode === 'long-break') {
                audioFile = '/pomofocus-clone/sounds/pica-pau-bolinha-de-golfe.mp3';
            }
            var audio = new Audio(audioFile);
            audio.volume = 0.5; // Volume em 50%
            audio.play().catch(function (error) {
                console.log('Erro ao reproduzir áudio:', error);
            });
        }
        catch (error) {
            console.log('Erro ao carregar áudio:', error);
        }
    };
    var handleStartPause = function () {
        if (isRunning) {
            pauseTimer();
        }
        else {
            // Solicitar permissão de notificação quando o usuário iniciar o timer
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            // Tocar som de início
            playStartSound();
            startTimer();
        }
    };
    var handleModeChange = function (mode) {
        switchMode(mode);
    };
    var handleNextMode = function () {
        if (currentMode === 'pomodoro') {
            switchMode('short-break');
        }
        else if (currentMode === 'short-break') {
            switchMode('pomodoro');
        }
        else {
            switchMode('pomodoro');
        }
    };
    return (_jsxs("div", __assign({ className: "timer-container" }, { children: [_jsxs("div", __assign({ className: "timer-card ".concat(currentMode) }, { children: [_jsxs("div", __assign({ className: "mode-tabs" }, { children: [_jsx("button", __assign({ className: "mode-tab ".concat(currentMode === 'pomodoro' ? 'active' : ''), onClick: function () { return handleModeChange('pomodoro'); } }, { children: "Pomodoro" })), _jsx("button", __assign({ className: "mode-tab ".concat(currentMode === 'short-break' ? 'active' : ''), onClick: function () { return handleModeChange('short-break'); } }, { children: "Pausa Curta" })), _jsx("button", __assign({ className: "mode-tab ".concat(currentMode === 'long-break' ? 'active' : ''), onClick: function () { return handleModeChange('long-break'); } }, { children: "Pausa Longa" }))] })), _jsx("div", __assign({ className: "timer-display" }, { children: _jsx("span", { children: formatTime(timeLeft) }) })), _jsxs("div", __assign({ className: "timer-controls" }, { children: [_jsx("button", __assign({ className: "start-btn", onClick: handleStartPause }, { children: isRunning ? 'PAUSAR' : 'INICIAR' })), isRunning && (_jsx("button", __assign({ className: "next-btn", onClick: handleNextMode }, { children: _jsx("i", { className: "fas fa-step-forward" }) })))] }))] })), _jsx("div", __assign({ className: "status-message" }, { children: _jsx("span", { children: getStatusText() }) }))] })));
};
export default Timer;
