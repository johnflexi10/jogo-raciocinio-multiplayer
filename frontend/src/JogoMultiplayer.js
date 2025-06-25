// frontend/src/JogoMultiplayer.js (VERSÃO FINAL SEM DUPLICATAS)

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// frontend/src/JogoMultiplayer.js

const socket = io('https://mindplex-game-joao-024e2dfea727.herokuapp.com/');

// --- Componente: Tela de Lobby ---
function LobbyScreen({ handleCreateRoom, handleJoinRoom, error, setError }) {
    const [nameInput, setNameInput] = useState('');
    const [roomInput, setRoomInput] = useState('');
    const tryCreateRoom = () => { setError(''); handleCreateRoom(nameInput); };
    const tryJoinRoom = () => { setError(''); handleJoinRoom(nameInput, roomInput); };
    const handleBack = () => { window.location.reload(); };
    return (
        <div className="lobby-container">
            <button onClick={handleBack} className="btn-back">← Voltar</button>
            <h1 className="title">Raciocínio Multiplayer</h1>
            <p className="subtitle">Digite seu nome e crie ou entre em uma sala.</p>
            <input type="text" placeholder="Seu nome" className="input-field" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
            <button className="btn btn-primary" onClick={tryCreateRoom} disabled={!nameInput}>Criar Sala</button>
            <div className="divider">ou</div>
            <div className="join-section">
                <input type="text" placeholder="Código da Sala" className="input-field" value={roomInput} onChange={(e) => setRoomInput(e.target.value.toUpperCase())} />
                <button className="btn btn-secondary" onClick={tryJoinRoom} disabled={!nameInput || !roomInput}>Entrar</button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

// --- Componente: Tela de Espera ---
function WaitingRoomScreen({ roomData, handleStartGame, handleLeaveRoom }) {
    const { roomCode, players, host } = roomData;
    const isHost = socket.id === host;
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyCode = () => { navigator.clipboard.writeText(roomCode); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); };
    return (
        <div className="waiting-room-container">
            <button onClick={handleLeaveRoom} className="btn-back">← Sair da Sala</button>
            <h2 className="title">Sala de Espera</h2>
            <div className="room-code-container">
                <p className="room-code-display">Código da Sala: <span>{roomCode}</span></p>
                <button onClick={handleCopyCode} className="btn-copy">{isCopied ? 'Copiado! ✓' : 'Copiar'}</button>
            </div>
            <div className="player-list">
                <h3>Jogadores ({players.length}):</h3>
                <ul>{players.map(p => (<li key={p.id}>{p.name}{p.id === host && <span className="host-tag">(Dono da Sala)</span>}</li>))}</ul>
            </div>
            {isHost ? (
                <div className="host-controls">
                    <p>Você é o dono da sala. Escolha a dificuldade para começar!</p>
                    <div className="difficulty-buttons">
                        <button onClick={() => handleStartGame('easy')} className="btn-difficulty-easy">Fácil</button>
                        <button onClick={() => handleStartGame('medium')} className="btn-difficulty-medium">Médio</button>
                        <button onClick={() => handleStartGame('hard')} className="btn-difficulty-hard">Difícil</button>
                        <button onClick={() => handleStartGame('extreme')} className="btn-difficulty-extreme">Extremo</button>
                    </div>
                </div>
            ) : (<p className="waiting-message">Aguardando o dono da sala escolher a dificuldade e iniciar o jogo...</p>)}
        </div>
    );
}

// --- Componente: Tela de Jogo ---
function GameScreen({ roomData, handleSubmitAnswer }) {
    const [userAnswer, setUserAnswer] = useState('');
    const [localFeedback, setLocalFeedback] = useState(null);
    const [hint, setHint] = useState('');
    const { roomCode, players, gameState } = roomData;
    const { puzzles, currentPuzzleIndex, scores, feedback, winner } = gameState;
    const currentPuzzle = puzzles?.[currentPuzzleIndex];
    useEffect(() => {
        if (feedback && feedback[socket.id]) {
            setLocalFeedback(feedback[socket.id]);
            const timer = setTimeout(() => { setLocalFeedback(null); }, 2500);
            return () => clearTimeout(timer);
        }
    }, [feedback]);
    useEffect(() => {
        const handleHint = (hintText) => { setHint(hintText); };
        socket.on('hintReceived', handleHint);
        return () => { socket.off('hintReceived', handleHint); };
    }, []);
    useEffect(() => { setHint(''); }, [currentPuzzleIndex]);
    const handleRequestHint = () => { socket.emit('requestHint', { roomCode }); };
    if (winner) {
        const winnerPlayer = players.find(p => p.id === winner);
        return (<div className="game-over-container"><h2 className="title">Fim de Jogo!</h2><p className="winner-announcement">O vencedor é: <strong>{winnerPlayer?.name || 'Desconhecido'}</strong></p></div>);
    }
    return (
        <div className="game-screen-container">
            <div className="game-header"><h3>Sala: {roomCode}</h3><h4>Desafio {currentPuzzleIndex + 1} de {puzzles.length}</h4></div>
            <div className="scoreboard">{players.map(p => (<div key={p.id} className="score-item"><span>{p.name}:</span><span>{scores[p.id] || 0}</span></div>))}</div>
            <div className="puzzle-area">
                <p className="question">{currentPuzzle?.question || "Carregando pergunta..."}</p>
                <div className="actions-container">
                    <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="input-field" placeholder="Sua resposta..." />
                    <button onClick={() => { handleSubmitAnswer(userAnswer); setUserAnswer(''); }} className="btn btn-primary">Enviar</button>
                    <button onClick={handleRequestHint} className="btn-secondary" disabled={!!hint}>Mostrar Dica</button>
                </div>
                {hint && (<div className="hint-box"><strong>Dica:</strong> {hint}</div>)}
                {localFeedback && (<div className={`feedback-message ${localFeedback}`}>Sua resposta foi {localFeedback}!</div>)}
            </div>
        </div>
    );
}

// --- Componente Principal (Gerencia tudo) ---
function JogoMultiplayer() {
    const [roomData, setRoomData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        const onRoomUpdate = (data) => setRoomData(data);
        const onError = (message) => { setError(message); setRoomData(null); };
        socket.on('roomUpdate', onRoomUpdate);
        socket.on('error', onError);
        return () => { socket.off('roomUpdate', onRoomUpdate); socket.off('error', onError); };
    }, []);
    const handleCreateRoom = (playerName) => { if (playerName) socket.emit('createRoom', playerName); };
    const handleJoinRoom = (playerName, roomCode) => { if (playerName && roomCode) socket.emit('joinRoom', { roomCode, playerName }); };
    const handleStartGame = (difficulty) => { if (roomData?.roomCode) socket.emit('startGame', { roomCode: roomData.roomCode, difficulty }); };
    const handleSubmitAnswer = (answer) => { if (roomData?.roomCode && answer) socket.emit('submitAnswer', { roomCode: roomData.roomCode, answer }); };
    const handleLeaveRoom = () => {
        if (socket.connected) {
            socket.disconnect();
        }
        setTimeout(() => {
            socket.connect();
            setRoomData(null);
        }, 100);
    };
    const renderContent = () => {
        if (!roomData) {
            return <LobbyScreen handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom} error={error} setError={setError} />;
        }
        if (!roomData.gameState.gameStarted) {
            return <WaitingRoomScreen roomData={roomData} handleStartGame={handleStartGame} handleLeaveRoom={handleLeaveRoom} />;
        }
        return <GameScreen roomData={roomData} handleSubmitAnswer={handleSubmitAnswer} />;
    };
    return <div className="main-container">{renderContent()}</div>;
}

export default JogoMultiplayer;