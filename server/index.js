//BACKEND FOR SEISPIN

//Require necessary modules
const express = require('express');
const app = express(); //app is an instance of the express library
const http = require("http");

const {Server} = require('socket.io'); //retrieve the class Server from socket.io
const cors = require("cors");

app.use(cors());

const server = http.createServer(app); //This is how we create a http server with express

//io is the variable that we will be using to do anything related to socket io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const activePlayers = new Set();
//Game state structure 
let gameState = {
    totalPot: 0,
    players: {} //Key: Player ID, Value: Bet Amount
}
const SYNC_INTERVAL = 5000; // Sync every 5 seconds, for example

let countdown = 30;
let countdownActive = false;
let countdownInterval;

const startCountdown = () => {
    countdownInterval = setInterval(() => {
      countdown--;
      io.emit('countdownUpdate', countdown);
  
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        countdownActive = false;



      }
    }, 1000);
    // Sync countdown with clients every SYNC_INTERVAL
    setInterval(() => {
        io.emit('syncCountdown', countdown);
    }, SYNC_INTERVAL);
  };
  const extendCountdown = () => {
    const newCountdown = Math.min(countdown + EXTENSION_TIME, 30);
    if (countdown !== newCountdown) {
      countdown = newCountdown;
      io.emit('countdownUpdate', countdown);
    }
  };

  // Function to generate a random RGB color
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
};  

// Function to reset the game state
const resetGame = () => {
    gameState = {
        totalPot: 0,
        players: {}
    };
    activePlayers.clear();
    countdown = 30;
    countdownActive = false;
    io.emit('gameUpdate', gameState); // Notify all clients about the reset
    io.emit('countdownUpdate', countdown);
};
io.on("connection", (socket) => {
    console.log('A user connected:', socket.id);

    //Handle new bet
    socket.on("placeBet", (data) =>{
        
        const playerId = socket.id; // or another method to identify the player
        activePlayers.add(socket.id);
        console.log("ACTIVE PLAYERS",activePlayers);
        if (!gameState.players[playerId]) {
            gameState.players[playerId] = {
                bet: 0,
                color: getRandomColor(), // Assign a color on the server
            };
          };

        if (!countdownActive && activePlayers.size >= 2) {
            countdownActive = true;
            startCountdown();
        }
          gameState.players[playerId].bet += data.amount;
          gameState.totalPot += data.amount;
          console.log(gameState.totalPot);
          console.log(gameState.players[playerId].bet);
          console.log(gameState);
          io.emit("gameUpdate", gameState);

    });
    
    //Handle user disconnection
    socket.on('disconnect', ()=>{
        activePlayers.delete(socket.id);
        console.log('User disconnected:', socket.id);

    });
     // Handle spin finish event from client
     socket.on('spinFinished', () => {
        resetGame(); // Reset the game after spin is finished
        
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});
