import React, { useEffect } from 'react';
import { TimerProvider, useTimer } from './contexts/TimerContext';
import Header from './components/Header';
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import Footer from './components/Footer';
import './App.css';

function AppContent() {
  const { currentMode, timeLeft } = useTimer();


  // Aplicar classe CSS baseada no modo atual
  useEffect(() => {
    document.body.className = currentMode;
  }, [currentMode]);

  // Atualizar título da aba e favicon com o timer
  useEffect(() => {
    const updateTitleAndFavicon = () => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      let statusText = '';
      let faviconColor = '#BA4949'; // Cor padrão
      
      if (currentMode === 'pomodoro') {
        statusText = 'Hora de focar!';
        faviconColor = '#BA4949'; // Vermelho
      } else if (currentMode === 'short-break') {
        statusText = 'Hora de uma pausa!';
        faviconColor = '#38858A'; // Teal
      } else {
        statusText = 'Hora de uma pausa longa!';
        faviconColor = '#397097'; // Azul
      }
      
      document.title = `${timeString} - ${statusText}`;
      
      // Atualizar favicon com cor dinâmica
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        // Criar um canvas para gerar o favicon com a cor correta
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
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
    
    const interval = setInterval(updateTitleAndFavicon, 1000);
    
    return () => clearInterval(interval);
  }, [currentMode, timeLeft]);

  return (
    <div className="app">
      <Header />
      <main className="main">
        <Timer />
        <Tasks />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

export default App;
