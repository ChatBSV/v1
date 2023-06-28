// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './ChatInput.module.css';

const ChatInput = () => {
  const [handCashLoaded, setHandCashLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      try {
        const response = await axios.post('/getChatReply', {
          prompt: inputRef.current.value,
        });

        // Process the response as needed
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
      }

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

      // Render the form with the input field and submit button
      handCashContainer.innerHTML = `
        <form onSubmit="${handleFormSubmit}" className="${styles.inputForm}">
          <input type="text" placeholder="Enter your prompt..." ref="${inputRef}" />
          <button type="submit" className="${styles.submitButton}">Submit</button>
        </form>
        <button class="${styles.submitButton}" onclick="${handleHandCashConnect}" ${
        isAuthenticated ? 'style="display: none;"' : ''
      }>Connect with HandCash</button>
        <button class="${styles.submitButton}" disabled ${
        isAuthenticated ? '' : 'style="display: none;"'
      }>Submit</button>
      `;
    }
  }, [handCashLoaded, isAuthenticated]);

  useEffect(() => {
    // Check if the user is authenticated
    // You can make a request to the Heroku server to verify the authentication status
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('/checkAuthentication');

        // Set the authentication status based on the response from the server
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div className={styles.chatFooter}>
      <div ref={handCashContainerRef} className={styles.handCashContainer}></div>
    </div>
  );
};

export default ChatInput;
