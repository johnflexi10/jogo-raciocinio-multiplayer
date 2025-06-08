// frontend/src/App.js - Versão Multiplayer
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
// O App.css já foi configurado no Passo 1

const socket = io('http://localhost:4000');

// Componente para a tela de Lobby (criar/entrar na sala)
function Lobby({ setRoomData }) {
    const [playerName, setPlayerName] = useState('');
    const [inputRoomCode, setInputRoomCode] = useState('');

    const handleCreateRoom = () => {
        if (playerName) socket.emit('createRoom', playerName);
    };

    const handleJoinRoom = () => {
        if (playerName && inputRoomCode) {
            socket.emit('joinRoom', { roomCode: inputRoomCode, playerName });
        }
    };
    
    // Efeito para ouvir a resposta do servidor e atualizar o estado principal
    useEffect(() => {
        socket.on('roomUpdate', (data) => {
            setRoomData(data);
        });
        socket.on('error', (msg) => alert(msg));
        
        return () => {
            socket.off('roomUpdate');
            socket.off('error');
        };
    }, [setRoomData]);

    return (
        <div className="lobby-container p-6">
            <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Jogo!</h1>
            <input
                type="text"
                placeholder="Seu nome"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <button onClick={handleCreateRoom} className="bg-blue-600 text-white w-full py-2 rounded-md mb-4">Criar Sala</button>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Código da Sala"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button onClick={handleJoinRoom} className="bg-green-500 text-white py-2 px-4 rounded-md">Entrar</button>
            </div>
        </div>
    );
}

// Componente principal do jogo
function GameScreen({ roomData }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { roomCode, players, host, gameState } = roomData;
    const { gameStarted, difficulty, puzzles, currentPuzzleIndex, scores, feedback } = gameState;
    const isHost = socket.id === host;

    const handleStartGame = (level) => {
        socket.emit('startGame', { roomCode, difficulty: level });
    };

    const handleSubmitAnswer = () => {
        socket.emit('submitAnswer', { roomCode, answer: userAnswer });
        setUserAnswer('');
    };

    // Se o jogo ainda não começou, mostra a tela de espera e seleção de dificuldade
    if (!gameStarted) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-bold">Sala: {roomCode}</h2>
                <div className="my-4">
                    <h3 className="font-semibold">Jogadores:</h3>
                    <ul>{players.map(p => <li key={p.id}>{p.name} {p.id === host && '(Host)'}</li>)}</ul>
                </div>
                {isHost ? (
                    <div>
                        <p>Você é o host. Escolha a dificuldade e comece o jogo!</p>
                        {/* Simplificado para apenas um botão por enquanto */}
                        <button onClick={() => handleStartGame('easy')} className="bg-purple-700 text-white py-2 px-4 rounded-md mt-4">Começar Jogo (Fácil)</button>
                    </div>
                ) : (
                    <p>Aguardando o host iniciar o jogo...</p>
                )}
            </div>
        );
    }
    
    // Se o jogo terminou
    if (gameState.winner) {
        const winnerPlayer = players.find(p => p.id === gameState.winner);
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-green-600">Fim de Jogo!</h2>
                <p className="text-xl mt-4">O vencedor é: {winnerPlayer?.name || 'Desconhecido'}</p>
                {/* Aqui você pode mostrar o placar final completo */}
            </div>
        );
    }

    const currentPuzzle = puzzles[currentPuzzleIndex];

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold">Sala: {roomCode}</h2>
            
            {/* Placar */}
            <div className="my-4">
                <h3 className="font-semibold">Placar:</h3>
                <ul>{players.map(p => <li key={p.id}>{p.name}: {scores[p.id] || 0} pontos</li>)}</ul>
            </div>

            {/* Jogo */}
            {currentPuzzle ? (
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Desafio {currentPuzzleIndex + 1}:</h2>
                    <p className="text-lg mb-6">{currentPuzzle.question}</p>
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Sua resposta"
                    />
                    <button onClick={handleSubmitAnswer} className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4">Enviar Resposta</button>
                    
                    {/* Feedback visual */}
                    {feedback[socket.id] && (
                         <div className={`mt-4 p-3 rounded-md ${feedback[socket.id] === 'correto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            Sua última resposta foi {feedback[socket.id]}!
                         </div>
                    )}
                </div>
            ) : (
                <p>Carregando próximo desafio...</p>
            )}
        </div>
    );
}


// Componente Raiz que decide o que mostrar: Lobby ou Jogo
function App() {
    // roomData vai guardar todo o estado que vem do servidor
    const [roomData, setRoomData] = useState(null);

    // Se não temos dados da sala, mostramos o Lobby
    if (!roomData) {
        return <Lobby setRoomData={setRoomData} />;
    }

    // Se temos dados, mostramos a tela do jogo
    return <GameScreen roomData={roomData} />;
}

export default App;