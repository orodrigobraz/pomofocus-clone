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
import { useEffect } from 'react';
import { TimerProvider, useTimer } from './contexts/TimerContext';
import Header from './components/Header';
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import Footer from './components/Footer';
import './App.css';
function AppContent() {
    var _a = useTimer(), currentMode = _a.currentMode, timeLeft = _a.timeLeft;
    // Aplicar classe CSS baseada no modo atual
    useEffect(function () {
        document.body.className = currentMode;
    }, [currentMode]);
    // Atualizar título da aba e favicon com o timer
    useEffect(function () {
        var updateTitleAndFavicon = function () {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;
            var timeString = "".concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
            var statusText = '';
            var faviconColor = '#BA4949'; // Cor padrão
            if (currentMode === 'pomodoro') {
                statusText = 'Hora de focar!';
                faviconColor = '#BA4949'; // Vermelho
            }
            else if (currentMode === 'short-break') {
                statusText = 'Hora de uma pausa!';
                faviconColor = '#38858A'; // Teal
            }
            else {
                statusText = 'Hora de uma pausa longa!';
                faviconColor = '#397097'; // Azul
            }
            document.title = "".concat(timeString, " - ").concat(statusText);
            // Atualizar favicon com cor dinâmica
            var favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                // Criar um canvas para gerar o favicon com a cor correta
                var canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                var ctx = canvas.getContext('2d');
                if (ctx) {
                    // Desenhar um círculo com a cor do modo atual
                    ctx.fillStyle = faviconColor;
                    ctx.beginPath();
                    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
                    ctx.fill();
                    // Adicionar um checkmark branco
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(10, 16);
                    ctx.lineTo(14, 20);
                    ctx.lineTo(22, 12);
                    ctx.stroke();
                    // Converter para data URL e atualizar favicon
                    favicon.href = canvas.toDataURL('image/png');
                }
            }
        };
        updateTitleAndFavicon();
        var interval = setInterval(updateTitleAndFavicon, 1000);
        return function () { return clearInterval(interval); };
    }, [currentMode, timeLeft]);
    return (_jsxs("div", __assign({ className: "app" }, { children: [_jsx(Header, {}), _jsxs("main", __assign({ className: "main" }, { children: [_jsx(Timer, {}), _jsx(Tasks, {})] })), _jsx(Footer, {})] })));
}
function App() {
    return (_jsx(TimerProvider, { children: _jsx(AppContent, {}) }));
}
export default App;
