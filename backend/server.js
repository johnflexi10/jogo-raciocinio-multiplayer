// server.js - Versão Mestre do Jogo
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// --- Puzzle Data (cole os dados do seu jogo aqui) ---
// Para simplificar, vou usar apenas os puzzles fáceis. Cole os seus aqui!
const allPuzzles = {
    easy: [
        { question: "Qual é o próximo número nesta sequência: 2, 4, 8, 16, __?", answer: "32", hint: "Pense em como cada número se relaciona com o anterior." },
        { question: "Se um trem viaja a 60 km/h, quanto tempo levará para percorrer 150 km?", answer: "2,5", hint: "Use a fórmula tempo = distância ÷ velocidade." },
    ],
    // ... cole os outros níveis aqui
};

const rooms = {}; // Armazena o estado de todas as salas

function createInitialGameState() {
    return {
        gameStarted: false,
        difficulty: null,
        currentPuzzleIndex: -1,
        puzzles: [],
        scores: {}, // { playerId: score }
        feedback: {}, // { playerId: 'correto' | 'incorreto' }
        winner: null,
    };
}

io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Cria uma sala
    socket.on('createRoom', (playerName) => {
        const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        socket.join(roomCode);
        rooms[roomCode] = {
            players: [{ id: socket.id, name: playerName || `Jogador ${Math.floor(Math.random() * 100)}` }],
            host: socket.id,
            gameState: createInitialGameState(),
        };
        // Envia para o criador da sala o estado completo
        io.to(socket.id).emit('roomUpdate', { roomCode, ...rooms[roomCode] });
        console.log(`Sala ${roomCode} criada pelo jogador ${playerName} (${socket.id})`);
    });

    // Entra em uma sala
    socket.on('joinRoom', ({ roomCode, playerName }) => {
        if (rooms[roomCode]) {
            socket.join(roomCode);
            const newPlayer = { id: socket.id, name: playerName || `Jogador ${Math.floor(Math.random() * 100)}` };
            rooms[roomCode].players.push(newPlayer);
            rooms[roomCode].gameState.scores[socket.id] = 0; // Inicializa o score do novo jogador

            // Envia o estado atualizado para todos na sala
            io.to(roomCode).emit('roomUpdate', { roomCode, ...rooms[roomCode] });
            console.log(`Jogador ${playerName} (${socket.id}) entrou na sala ${roomCode}`);
        } else {
            socket.emit('error', 'Sala não encontrada!');
        }
    });

    // Inicia o jogo (geralmente chamado pelo host)
    socket.on('startGame', ({ roomCode, difficulty }) => {
        const room = rooms[roomCode];
        if (room && room.host === socket.id) {
            const gameState = room.gameState;
            gameState.gameStarted = true;
            gameState.difficulty = difficulty;
            gameState.puzzles = allPuzzles[difficulty] || [];
            gameState.currentPuzzleIndex = 0;
            // Inicializa scores
            room.players.forEach(p => { gameState.scores[p.id] = 0; });
            
            // Envia o estado atualizado para todos na sala
            io.to(roomCode).emit('roomUpdate', { roomCode, ...room });
            console.log(`Jogo iniciado na sala ${roomCode} com dificuldade ${difficulty}`);
        }
    });

    // Recebe a resposta de um jogador
    socket.on('submitAnswer', ({ roomCode, answer }) => {
        const room = rooms[roomCode];
        if (!room || !room.gameState.gameStarted) return;
        
        const gameState = room.gameState;
        const puzzle = gameState.puzzles[gameState.currentPuzzleIndex];
        
        if (answer.trim().toLowerCase() === puzzle.answer.toLowerCase()) {
            gameState.scores[socket.id] = (gameState.scores[socket.id] || 0) + 1;
            gameState.feedback[socket.id] = 'correto';
            
            // Lógica para próximo puzzle (ex: todos responderam ou o primeiro a acertar avança)
            // Vamos fazer o primeiro a acertar avançar o puzzle para todos
            gameState.currentPuzzleIndex++;
            if (gameState.currentPuzzleIndex >= gameState.puzzles.length) {
                // Fim de jogo
                gameState.winner = Object.keys(gameState.scores).reduce((a, b) => gameState.scores[a] > gameState.scores[b] ? a : b);
            }
        } else {
            gameState.feedback[socket.id] = 'incorreto';
        }
        
        // Limpa o feedback após alguns segundos e envia atualização
        setTimeout(() => {
            gameState.feedback = {};
            io.to(roomCode).emit('roomUpdate', { roomCode, ...room });
        }, 2000);
        
        io.to(roomCode).emit('roomUpdate', { roomCode, ...room });
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
        // Implementar a lógica de remover jogador da sala (similar à que fizemos antes)
    });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Servidor Multiplayer rodando na porta ${PORT}`));