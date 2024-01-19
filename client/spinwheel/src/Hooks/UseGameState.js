//Responsible for maintaining the state of the game across the application
import { useState, useEffect } from 'react';
import  {socketService} from '../Services/SocketService';

const useGameState = () => {    
    const[gameState, setGameState] = useState(() => {
        const savedState = localStorage.getItem('gameState');
        return savedState ? JSON.parse(savedState) : { totalPot: 0, players: {} };
    });
    const [countdown, setCountdown] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(false);
    
    // Effect to save gameState to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }, [gameState]);

    useEffect(() => {
        // Function to handle game state updates
        const handleGameUpdate = (updatedGameState) => {
            setGameState(updatedGameState);
            console.log("Game state updated:", updatedGameState);
        };
    
        // Function to handle countdown updates
        const handleCountdownUpdate = (updatedCountdown) => {
            setCountdown(updatedCountdown);
            console.log("Countdown updated:", updatedCountdown);
        };

        const handleSyncCountdown = (serverCountdown) => {
            // Sync the countdown with the server's value
            setCountdown(serverCountdown);
        };
    
        // Connect to the WebSocket server with both update handlers
        socketService.onSyncCountdown(handleSyncCountdown);

        socketService.connect(handleGameUpdate, handleCountdownUpdate);
    
        // Cleanup function to disconnect the socket
        return () => {
            socketService.disconnect();
        };
    }, []);

    return {gameState, countdown, isTimerActive};
    };

export default useGameState;

