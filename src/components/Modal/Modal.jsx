import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onLogin, onGuest }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Get Started with Vision AI</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>Choose how you'd like to start chatting:</p>
          <div className="modal-buttons">
            <button className="modal-button login-button" onClick={onLogin}>
              Login
            </button>
            <button className="modal-button guest-button" onClick={onGuest}>
              Try as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
