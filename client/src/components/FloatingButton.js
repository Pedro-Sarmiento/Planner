import React, { useState } from 'react';
import ChatModal from './ChatModal'; // Componente del chat con GPT

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleClick} 
        style={styles.floatingButton}
      >
        💬
      </button>

      {isOpen && <ChatModal onClose={handleClose} />}
    </>
  );
};

const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#000',
    color: 'white',
    fontSize: '24px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default FloatingButton;
