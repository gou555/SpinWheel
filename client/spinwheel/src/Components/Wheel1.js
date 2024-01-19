import React, { useEffect, useState } from 'react';
import useGameState from '../Hooks/UseGameState';
import '../Styles/Wheel.css';
import  {socketService} from '../Services/SocketService';
import WinningModal from './WinningModal';

const Wheel1 = () => {

    const {gameState, countdown} = useGameState();
    const {totalPot, players} = gameState;

    console.log('Current gameState in Wheel1:', gameState);

    const [finalAngle, setFinalAngle] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [winnerInfo, setWinnerInfo] = useState({ winnerName: '', amount: 0 });
    const [isSpinning, setIsSpinning] = useState(false);

    const wheelSize = 280;
    const radius = wheelSize / 2;
    const circumference = 2 * Math.PI * radius;

    const calculateEndAngle = (startAngle, bet, totalPot) => {
        if (totalPot === 0) return startAngle; // Avoid division by zero
        const betPercentage = bet / totalPot;
        const angle = betPercentage * 360;
        return startAngle + angle;
    };

    // Convert polar coordinates to Cartesian for SVG path
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees ) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

        return{
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    const describeArc = (x, y, radius, innerRadius, startAngle, endAngle) => {
        const isFullCircle = endAngle - startAngle >= 360;
        if (isFullCircle) {
            return [
                // Draw outer circle
                `M ${x - radius} ${y}`, // Start at the leftmost point of the outer circle
                `A ${radius} ${radius} 0 1 1 ${x + radius} ${y}`,
                `A ${radius} ${radius} 0 1 1 ${x - radius} ${y}`,
                // Draw inner circle to create the hole
                `M ${x - innerRadius} ${y}`, // Start at the leftmost point of the inner circle
                `A ${innerRadius} ${innerRadius} 0 1 0 ${x + innerRadius} ${y}`,
                `A ${innerRadius} ${innerRadius} 0 1 0 ${x - innerRadius} ${y}`,
                'Z' // Close the path
            ].join(' ');
        }
        const startOuter = polarToCartesian(x, y, radius, endAngle);
        const endOuter = polarToCartesian(x, y, radius, startAngle);
        const startInner = polarToCartesian(x, y, innerRadius, endAngle);
        const endInner = polarToCartesian(x, y, innerRadius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", startOuter.x, startOuter.y,
            "A", radius, radius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
            "L", endInner.x, endInner.y,
            "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
            "L", startOuter.x, startOuter.y, "Z"
        ].join(" ");
    };

    const calculateFinalAngle = () => {
        // Randomize the final angle here
        const randomFactor = Math.random(); // Random factor between 0 and 1
        const totalDegrees = 360; // Total degrees in a circle
        return (randomFactor * totalDegrees) % totalDegrees;
    };
    const calculateWinnerId = (angle) => {
        let currentAngle = 0;
        for (const playerId in players) {
            const player = players[playerId];
            const playerAngle = calculateEndAngle(currentAngle, player.bet, totalPot);
            if (angle >= currentAngle && angle < playerAngle) {
                return playerId;
            }
            currentAngle = playerAngle;
        }
        return null; 
    };
    const determineWinner = (angle) => {
        // Logic to determine the winner based on angle
        const winnerId = calculateWinnerId(angle);
        if (winnerId) {
            const winner = players[winnerId];
            const winningAmount = totalPot; 
            setWinnerInfo({ winnerName: winner.name, amount: winningAmount });
            setShowModal(true);
        }
    };
    const onRequestCloseModal = () =>{
        setShowModal(false);
    }
    const spinWheel = () => {
        if (countdown === 0) {
            setIsSpinning(true);
            const spinDuration = 10000; // Duration of the spin in milliseconds
            const newAngle = calculateFinalAngle(); // Calculate the final angle
            setTimeout(() => {
                setIsSpinning(false);
                setFinalAngle(newAngle); // Set the final angle
                determineWinner(newAngle); // Determine the winner based on the final angle
                socketService.emit('spinFinished'); // Notify the server that the spin has finished
            }, spinDuration);
        }
    };
      // Call spinWheel when countdown reaches zero
      useEffect(() => {
        spinWheel();
    }, [countdown]);

    // Generate the SVG paths for each player
    let startAngle = 0;
    const innerRadius = radius * 0.8; // Adjust the inner radius for the donut hole size
    const paths = Object.keys(players).map((playerId) => {
        const playerBet = players[playerId].bet; // Access the bet amount correctly
        const endAngle = calculateEndAngle(startAngle, playerBet, totalPot);
        const d = describeArc(radius, radius, radius, innerRadius, startAngle, endAngle);
        const fillColor = players[playerId].color; // Use color from the server
        startAngle = endAngle;
        return (
            <path key={playerId} d={d} fill={fillColor} />
        );
    });

    return (
        <div className='wheel-container'>
        <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`} className={`wheel ${isSpinning ? 'wheel-spinning' : ''}`}>
            {paths}
            <text x="50%" y="50%" textAnchor="middle" fill="#fff" dy=".3em" fontSize="20">
                {countdown}
            </text>
            <text x="50%" y="50%" textAnchor="middle" fill="#fff" dy="1.6em" fontSize="20">
                Total : {totalPot} $SEI
            </text>

            <polygon points={`${wheelSize / 2},${wheelSize / 2 - radius} ${wheelSize / 2 - 10},${wheelSize / 2 - radius + 20} ${wheelSize / 2 + 10},${wheelSize / 2 - radius + 20}`} fill="red" />
        </svg>
        {/* <WinningModal
            isOpen={showModal} 
            winnerAmount={winnerInfo.amount} 
            onRequestClose={onRequestCloseModal}
            onShareTwitter={() => {
                // Logic to handle Twitter share
            }}
            /> */}
        </div>
        
      );
    };


export default Wheel1;
