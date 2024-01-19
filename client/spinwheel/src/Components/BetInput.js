import React, { useState } from 'react';
import '../Styles/BetInput.css';


const BetInput = ({onBetPlaced}) => {
    const[betAmount, setBetAmount] = useState('');

    const handleBetChange = (e) => {
        setBetAmount(e.target.value);
    };

    const handleBetSubmit = () => {
        const amount = parseInt(betAmount, 10); // Parse the bet amount to an integer
        onBetPlaced(amount);
        setBetAmount(''); //Reset the input after the bet
    };

    return(
        <div className='bet-input-container'>
            <input
                type="number"
                value={betAmount}
                onChange={handleBetChange}
                placeholder='Enter Your Bet'
                className='bet-input'
            ></input>
            <button className='bet-button' onClick ={handleBetSubmit}>Bet</button>
        </div>
    );
};

export default BetInput;