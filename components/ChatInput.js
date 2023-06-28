// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [isHandCashConnected, setIsHandCashConnected] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authToken');

    if (authToken) {
      setIsHandCashConnected(true);
    }
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = inputRef.current.value.trim();

    if (isHandCashConnected && prompt !== '') {
      handleSubmit(prompt);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty or HandCash not connected. No request sent.');
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Enter your prompt..."
          ref={inputRef}
          disabled={!isHandCashConnected}
        />
        {isHandCashConnected ? (
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        ) : (
          <button className={styles.connectButton} onClick={() => (window.location.href = '/connect')}>
            Connect with HandCash
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
