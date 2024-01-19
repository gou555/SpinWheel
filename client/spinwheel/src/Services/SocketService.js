//Manage the connection to the backend server
import io from 'socket.io-client';

let socket;

const connect = (updateGameState, updateCountdown) => {
    socket = io.connect("http://localhost:3001");
    console.log('Socket connected:', socket); // Check if socket is defined

    socket.on('gameUpdate', (gameState) =>{
        updateGameState(gameState);
    });
    socket.on('countdownUpdate', (newCountdown) => {
        console.log("Countdown", newCountdown);
        updateCountdown(newCountdown);
    });
      // Add this if you implement the syncCountdown event in the backend
      socket.on('syncCountdown', (syncedCountdown) => {
        updateCountdown(syncedCountdown);
    });
};


const disconnect = () => {
    if(socket) socket.disconnect();
}

const placeBet = (betAmount) => {
    console.log('Socket in placeBet', socket);
    console.log(betAmount);
    socket.emit("placeBet", {amount: betAmount});
};

const on = (event, func) => {
    if (socket) {
        socket.on(event, func);
    }
};

const off = (event, func) => {
    if (socket) {
        socket.off(event, func);
    }
};

const emit = (eventName, data) => {
    if (socket) {
        socket.emit(eventName, data);
    } else {
        console.error('Socket not initialized');
    }
};

const onSyncCountdown = (func) => {
    if (socket) {
        socket.on('syncCountdown', func);
    }
};

export const socketService = {
    connect,
    disconnect,
    placeBet,
    on,
    off,
    emit,
    onSyncCountdown
};