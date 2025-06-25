// frontend/src/App.js (VERSÃO FINAL E COMPLETA)

import React, { useState } from 'react';
import JogoSinglePlayer from './JogoSinglePlayer';
import JogoMultiplayer from './JogoMultiplayer';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState(null);

  // Função para voltar ao menu principal
  const handleBackToMenu = () => {
    setGameMode(null);
  };

  if (gameMode === 'single') {
    // Para adicionar um botão de voltar aqui, a lógica seria similar:
    // Passar a função handleBackToMenu como prop para JogoSinglePlayer.
    return <JogoSinglePlayer onBackToMenu={handleBackToMenu} />;
  }

  // Em App.js, dentro da função App

  if (gameMode === 'multi') {
    // REMOVA a prop 'onBackToMenu' daqui
    return <JogoMultiplayer />; 
  }

  return (
    <div className="main-container">
      <h1 className="title">Bem-vindo ao Jogo de Raciocínio</h1>
      <p className="subtitle">Escolha um modo para jogar:</p>
      
      <button 
        className="btn btn-primary" 
        style={{ marginBottom: '1rem' }} 
        onClick={() => setGameMode('single')}
      >
        Jogar Sozinho (Original)
      </button>

      <button 
        className="btn btn-start" 
        onClick={() => setGameMode('multi')}
        
      >
        Jogar Multiplayer
      </button>
    </div>
  );
}

export default App;