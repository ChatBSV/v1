// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [handCashLoaded, setHandCashLoaded] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [txid, setTxid] = useState('');
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

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      handleSubmit(prompt, txid);
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

  const handleHandCashPayment = async () => {
    if (window.handCashConnect) {
      try {
        const paymentParameters = {
          description: 'ChatBSV Prompt',
          outputs: [
            {
              to: 'chatbsv',
              currencyCode: 'USD',
              sendAmount: '0.0099',
            },
          ],
        };
        const paymentResult = await window.handCashConnect.pay(paymentParameters);
        const { txid } = paymentResult;
        setTxid(txid);
        setAuthToken(paymentResult.authToken);
      } catch (error) {
        console.error('HandCash payment error:', error);
      }
    }
  };

  useEffect(() => {
    if (handCashLoaded && handCashContainerRef.current) {
      const handCashContainer = handCashContainerRef.current;
      handCashContainer.innerHTML = '';

      if (authToken) {
        // Render the form with the input field and submit button
        handCashContainer.innerHTML = `
          <form onSubmit="${handleFormSubmit}">
            <input type="text" placeholder="Enter your prompt..." ref="${inputRef}" />
            <button type="submit" class="submit">Submit</button>
          </form>
        `;
      } else {
        // Render the HandCash Connect button
        const connectButton = document.createElement('button');
        connectButton.innerText = 'Login';
        connectButton.onclick = handleHandCashConnect;
        handCashContainer.appendChild(connectButton);
      }
    }
  }, [handCashLoaded, authToken]);

  useEffect(() => {
    if (txid && authToken) {
      handleFormSubmit();
    }
  }, [txid, authToken]);

  return (
    <div className={styles.chatFooter}>
      <div ref={handCashContainerRef} className={styles.handCashContainer}></div>
    </div>
  );
};

export default ChatInput;
