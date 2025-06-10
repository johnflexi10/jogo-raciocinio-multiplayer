// frontend/src/App.js (COM A LÓGICA DE VOLTAR)

import React, { useState } from 'react';
import JogoSinglePlayer from './JogoSinglePlayer'; // Certifique-se que este arquivo existe
import JogoMultiplayer from './JogoMultiplayer';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState(null);

  // Função para ser chamada pelos componentes filhos para voltar ao menu
  const handleBackToMenu = () => {
    setGameMode(null);
  };

  if (gameMode === 'single') {
    return <JogoSinglePlayer onBackToMenu={handleBackToMenu} />;
  }

  if (gameMode === 'multi') {
    // Passamos a função como uma "prop" para o JogoMultiplayer
    return <JogoMultiplayer onBackToMenu={handleBackToMenu} />;
  }

  // Menu principal
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