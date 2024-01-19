import React from 'react';
import Modal from 'react-modal';
import '../Styles/WinningModal.css'; 

const WinningModal = ({isOpen, winnerAmount, onRequestClose }) => {
    const onShareTwitter = () => {
        const text = `I just won ${0} $SEI in SeiSpace Shuffle! @SeiSpaceHub #SeiSpaceWin`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };
    <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Winner Modal"
            className="winning-modal"
            overlayClassName="winning-modal-overlay"
        >
    <h2>Congratulations!</h2>
    <p>You've won {winnerAmount}!</p>
    <button onClick={onShareTwitter} className="twitter-share-button">
    Share on Twitter
    </button>
    <button onClick={onRequestClose} className="close-button">
    Close
    </button>
    </Modal>
}

export default WinningModal;
