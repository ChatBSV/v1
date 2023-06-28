// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit, authToken }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
  const [handCashLoaded, setHandCashLoaded] = useState(false);
  const handCashContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handCashScript = document.createElement('script');
    handCashScript.src = 'https://connect.handcash.io/handcash-connect.min.js';
    handCashScript.async = true;
    handCashScript.onload = () => setHandCashLoaded(true);
    document.body.appendChild(handCashScript);

    return () => {
      document.body.removeChild(handCashScript);
    };
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      handleSubmit(prompt);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const handleHandCashConnect = () => {
    if (window.handCashConnect) {
      window.handCashConnect.connect();
    }
  };

  useEffect(() => {
    if (handCashLoaded && handCashContainerRef.current) {
      const handCashContainer = handCashContainerRef.current;
      handCashContainer.innerHTML = '';

      if (isAuthenticated) {
        // Render the form with the input field and submit button
        handCashContainer.innerHTML = `
          <form onSubmit="${handleFormSubmit}">
            <input type="text" placeholder="Enter your prompt..." ref="${inputRef}" />
            <button type="submit">Submit</button>
          </form>
        `;
      } else {
        // Render the HandCash Connect button
        const connectButton = document.createElement('button');
        connectButton.innerText = 'Connect with HandCash';
        connectButton.onclick = handleHandCashConnect;
        handCashContainer.appendChild(connectButton);
      }
    }
  }, [handCashLoaded, isAuthenticated]);

  return (
    <div className={styles.chatFooter}>
      <div ref={handCashContainerRef} className={styles.handCashContainer}></div>
    </div>
  );
};

export default ChatInput;
