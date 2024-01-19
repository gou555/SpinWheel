import './App.css';
import io from 'socket.io-client';
import {useEffect, useState, React, Component, useCallback } from 'react';
import useGameState from './Hooks/UseGameState';
import Wheel1 from './Components/Wheel1';
import BetInput from './Components/BetInput';
import { socketService } from './Services/SocketService';
import AppNavbar from './Components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './Images/seispacepng.png';
import footerImage from './Images/Footer.png';

const App = () => {
  const {gameState, countdown} = useGameState();
  const {totalPot} = gameState;

  const handleBetPlaced = (amount) => {
    socketService.placeBet(amount);
  };

  return (
    <div className="space-gradient-background">
      <AppNavbar />
      <div className="main-content">
      <div className="header-container">
        <p>Welcome to SeiSpace Shuffle</p>
        <img src={logo} alt="Logo" className="header-image"/>
      </div>
      <div className="wheel-container">
      <Wheel1 gameState={gameState}/>
      </div>

      <BetInput onBetPlaced={handleBetPlaced}/>
    </div>
      <footer className="footer">
        <img src={footerImage} alt="SeiToTheMoon" />
      </footer>
    </div>

    );
  }

export default App;