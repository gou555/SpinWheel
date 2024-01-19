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

    // useEffect(() => {
    //     const playerCount = Object.keys(gameState.players).length;
    //     if(playerCount>=2 && !isTimerActive){
    //         setIsTimerActive(true);
    //         setCountdown(30); //Start with a fresh 30 seconds
    //     }
    // }, [gameState.players, isTimerActive]);

    // //Countdown logic
    // useEffect(() => {
    //     let interval; 
    //     if(isTimerActive){
    //         interval = setInterval(() => {
    //             setCountdown((prevCountdown) => {
    //                 if(prevCountdown > 0){
    //                     return prevCountdown - 1;
    //                 } else {
    //                     clearInterval(interval);
    //                     setIsTimerActive(false) //Stop the timer
    //                     return 0;
    //                 }
    //             });
    //         }, 1000);
    //     }
    //     return () => clearInterval(interval);
    // }, [isTimerActive]);

    // // Logic to extend the countdown when a new bet is placed
    // useEffect(() => {
    //     const extendCountdown = () => {
    //         if (countdown <= 5 && countdown > 0) {
    //             setCountdown((prevCountdown) => Math.min(prevCountdown + 7, 30));
    //         }
    //     };
    //     console.log("Countdown updated:", countdown);

    //     socketService.on('betPlaced', extendCountdown);

    //     return() => {
    //         socketService.off('betPlaced', extendCountdown);
    //     };
    // }, [countdown]);

    // useEffect(() => {
    //     socketService.connect((updatedGameState) => {
    //         setGameState(updatedGameState);
    //         console.log("Game state updated:", updatedGameState); // Log the updated game state
    //     });
    //     return () => {
    //         socketService.disconnect();
    //         };
    //     }, []);
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

