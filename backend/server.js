// backend/server.js (VERSÃO FINAL E 100% CORRIGIDA)
// backend/server.js
// Forçando uma nova atualização para o Render
// ... resto do código
const express = require('express');
// ... resto do código
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const MAX_PLAYERS = 8;
const allPuzzles = {
    easy: [
        { question: "Qual animal faz 'miau'?", answer: "gato", hint: "É um felino doméstico." },
        { question: "O que o sol nos dá durante o dia?", answer: "luz", hint: "É o contrário de escuridão." },
        { question: "Quantos dedos você tem em uma mão?", answer: "5", hint: "Conte-os!" },
        { question: "Qual é a cor do céu em um dia claro?", answer: "azul", hint: "É a cor do mar também." },
        { question: "O que você usa nos pés para não andar descalço?", answer: "sapato", hint: "Pode ser um tênis ou uma sandália." },
        { question: "Qual é o oposto de 'quente'?", answer: "frio", hint: "O que sentimos no inverno." },
        { question: "O que bebemos quando estamos com sede?", answer: "agua", hint: "É transparente e essencial para a vida." },
        { question: "Quantas rodas tem uma bicicleta?", answer: "2", hint: "É menos que um carro." },
        { question: "Qual é o som que a ovelha faz?", answer: "be", hint: "É um som curto, 'bééé'." },
        { question: "O que usamos para escrever em um papel?", answer: "lapis", hint: "Pode ser de grafite ou de cor." },
    ],
    medium: [
        { question: "Se um trem elétrico viaja para o sul, para que lado vai a fumaça?", answer: "nenhum", hint: "Leia o tipo de trem com atenção." },
        { question: "O que é que quanto mais se tira, maior fica?", answer: "buraco", hint: "Pense em cavar." },
        { question: "O pai de Maria tem 5 filhas: Lalá, Lelê, Lili, Loló e...?", answer: "maria", hint: "A resposta está na própria pergunta." },
        { question: "Um homem pode se casar com a irmã da sua viúva?", answer: "nao", hint: "Se a esposa dele é uma viúva, o que aconteceu com ele?" },
        { question: "Quantos animais de cada espécie Moisés colocou na arca?", answer: "nenhum", hint: "Quem construiu a arca na história bíblica?" },
        { question: "O que está no meio do ovo?", answer: "v", hint: "Pense na palavra 'ovo', não no objeto." },
        { question: "Eu tenho cidades, mas não casas. Tenho montanhas, mas não árvores. Tenho água, mas não peixes. O que sou eu?", answer: "mapa", hint: "É uma representação de lugares." },
        { question: "O que sobe e nunca desce?", answer: "idade", hint: "É algo que ganhamos a cada ano." },
        { question: "Se você tem 3 maçãs e tira 2, com quantas maçãs você fica?", answer: "2", hint: "Com quantas maçãs você ficou na sua mão?" },
        { question: "O que o 0 disse para o 8?", answer: "belo cinto", hint: "É uma piada visual sobre a forma dos números." },
    ],
    hard: [
        { question: "O que vem uma vez em um minuto, duas vezes em um momento, mas nunca em cem anos?", answer: "m", hint: "A resposta é uma letra do alfabeto." },
        { question: "Um avião cai na fronteira entre o Brasil e a Argentina. Onde os sobreviventes são enterrados?", answer: "nao enterra", hint: "Preste atenção na palavra 'sobreviventes'." },
        { question: "Alimentado, eu vivo. Se me derem de beber, eu morro. Quem sou eu?", answer: "fogo", hint: "Pense no que apaga as chamas." },
        { question: "O que é que tem um olho mas não pode ver?", answer: "agulha", hint: "É usado para costurar." },
        { question: "Se ontem fosse amanhã, hoje seria sexta-feira. Que dia é hoje?", answer: "quarta", hint: "Pense para trás a partir de sexta." },
        { question: "Você entra em uma sala escura com um fósforo na mão. Há uma vela, um lampião e uma lareira. O que você acende primeiro?", answer: "fosforo", hint: "Você não pode acender nada sem ele." },
        { question: "Qual a pergunta que você nunca pode responder 'sim'?", answer: "voce esta dormindo", hint: "Se você responder, você não está." },
        { question: "O que é que anda com os pés na cabeça?", answer: "piolho", hint: "É um pequeno inseto que vive no cabelo." },
        { question: "Eu não tenho voz, mas conto histórias. Não tenho pernas, mas viajo o mundo. O que sou eu?", answer: "livro", hint: "É feito de papel." },
        { question: "Se um médico te dá 3 pílulas para tomar uma a cada meia hora, quanto tempo levará para tomar todas?", answer: "1 hora", hint: "Você toma a primeira agora, a segunda em 30 min, e a terceira em 60 min." },
    ],
    extreme: [
        { question: "Um homem está em um elevador no 10º andar. Todos os dias ele desce de elevador até o térreo. Ao voltar, ele pega o elevador até o 7º e sobe 3 de escada. Por quê?", answer: "ele e anao", hint: "Ele não alcança o botão do 10º andar." },
        { question: "David é o pai de quem, se David é o único filho do avô deste alguém?", answer: "pai", hint: "É uma relação de parentesco direta, 'o filho do meu pai'..." },
        { question: "Você tem um jarro de 5 litros e um de 3 litros sem marcações. Como você mede exatamente 4 litros?", answer: "enche 5 passa 3 esvazia 3 passa 2 enche 5 passa 1", hint: "É um processo de 6 passos. Comece enchendo o de 5L." },
        { question: "Em uma corrida, você ultrapassa o segundo colocado. Em que posição você fica?", answer: "segundo", hint: "Você tomou o lugar dele." },
        { question: "Qual palavra em português tem 4 letras, mas se tirarmos 2, ainda sobram 5?", answer: "cinco", hint: "Pense em algarismos romanos." },
        { question: "Um homem descreve suas filhas: 'Todas elas são loiras, menos duas; todas são morenas, menos duas; e todas são ruivas, menos duas'. Quantas filhas ele tem?", answer: "3", hint: "Pense em uma de cada cor." },
        { question: "O que pode ser quebrado, mesmo que você nunca o pegue ou toque?", answer: "promessa", hint: "É algo que você faz com palavras." },
        { question: "Qual é a próxima letra nesta sequência: D, S, T, Q, Q, S, ...?", answer: "s", hint: "Pense nos dias da semana." },
        { question: "Um fazendeiro tem 17 ovelhas. Todas, exceto 9, morrem. Quantas ovelhas vivas ele tem?", answer: "9", hint: "Leia a frase 'exceto 9' com atenção." },
        { question: "Se uma folha de papel pudesse ser dobrada 42 vezes, sua espessura alcançaria a Lua. Verdadeiro ou Falso?", answer: "verdadeiro", hint: "O crescimento é exponencial." },
    ]
};
const rooms = {};

function createInitialGameState() {
    return {
        gameStarted: false,
        difficulty: null,
        currentPuzzleIndex: -1,
        puzzles: [],
        scores: {},
        feedback: {},
        winner: null,
    };
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    socket.on('createRoom', (playerName) => {
        const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        socket.join(roomCode);
        
        const newPlayer = { id: socket.id, name: playerName || `Jogador` };
        
        rooms[roomCode] = {
            players: [newPlayer],
            host: socket.id,
            gameState: createInitialGameState(),
        };

        // INICIALIZA O SCORE DO CRIADOR DA SALA
        rooms[roomCode].gameState.scores[socket.id] = 0;
        
        io.to(socket.id).emit('roomUpdate', { roomCode, ...rooms[roomCode] });
        console.log(`Sala ${roomCode} criada pelo jogador ${playerName} (${socket.id})`);
    });

    socket.on('joinRoom', ({ roomCode, playerName }) => {
        const room = rooms[roomCode];
        if (room) {
            if (room.gameState.gameStarted) {
                return socket.emit('error', 'O jogo já começou!');
            }
            if (room.players.length >= MAX_PLAYERS) {
                return socket.emit('error', 'A sala está cheia!');
            }
            socket.join(roomCode);
            const newPlayer = { id: socket.id, name: playerName || `Jogador` };
            room.players.push(newPlayer);
            
            // A CORREÇÃO CRUCIAL ESTÁ AQUI:
            // Nós garantimos que a propriedade 'scores' existe antes de tentar acessá-la.
            if (!room.gameState.scores) {
                room.gameState.scores = {};
            }
            room.gameState.scores[socket.id] = 0;

            io.to(roomCode).emit('roomUpdate', { roomCode, ...rooms[roomCode] });
            console.log(`Jogador ${playerName} (${socket.id}) entrou na sala ${roomCode}`);
        } else {
            socket.emit('error', 'Sala não encontrada!');
        }
    });

    socket.on('startGame', ({ roomCode, difficulty }) => {
        const room = rooms[roomCode];
        if (room && room.host === socket.id) {
            const gameState = room.gameState;
            gameState.gameStarted = true;
            gameState.difficulty = difficulty;
            const puzzlesForLevel = allPuzzles[difficulty] || [];
            const shuffledPuzzles = [...puzzlesForLevel]; 
            shuffleArray(shuffledPuzzles);
            gameState.puzzles = shuffledPuzzles;
            gameState.currentPuzzleIndex = 0;
            room.players.forEach(p => { gameState.scores[p.id] = 0; });
            io.to(roomCode).emit('roomUpdate', { roomCode, ...room });
        }
    });

    socket.on('submitAnswer', ({ roomCode, answer }) => {
        const room = rooms[roomCode];
        if (!room || !room.gameState.gameStarted) return;
        const puzzle = room.gameState.puzzles[room.gameState.currentPuzzleIndex];
        if (puzzle && answer.trim().toLowerCase() === puzzle.answer.toLowerCase()) {
            room.gameState.scores[socket.id] = (room.gameState.scores[socket.id] || 0) + 1;
            room.gameState.feedback[socket.id] = 'correto';
            room.gameState.currentPuzzleIndex++;
            if (room.gameState.currentPuzzleIndex >= room.gameState.puzzles.length) {
                room.gameState.winner = Object.keys(room.gameState.scores).reduce((a, b) => room.gameState.scores[a] > room.gameState.scores[b] ? a : b);
            }
        } else {
            room.gameState.feedback[socket.id] = 'incorreto';
        }
        io.to(roomCode).emit('roomUpdate', { roomCode, ...room });
        setTimeout(() => {
            if (rooms[roomCode]) { 
                rooms[roomCode].gameState.feedback = {};
                io.to(roomCode).emit('roomUpdate', { roomCode, ...rooms[roomCode] });
            }
        }, 2000);
    });

    socket.on('requestHint', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || !room.gameState.gameStarted) return;
        const puzzle = room.gameState.puzzles[room.gameState.currentPuzzleIndex];
        if (puzzle && puzzle.hint) {
            io.to(socket.id).emit('hintReceived', puzzle.hint);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                const isHost = room.host === socket.id;
                room.players.splice(playerIndex, 1);
                if (isHost && room.players.length > 0) {
                    io.to(roomCode).emit('error', 'O Dono da Sala saiu. O jogo foi encerrado.');
                    delete rooms[roomCode];
                } else if (room.players.length === 0) {
                    delete rooms[roomCode];
                } else {
                    io.to(roomCode).emit('roomUpdate', { roomCode, ...room });
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));