// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';
  const messageStyle = {
    fontSize: '16pt !important',
  };
  const linkStyle = {
    fontSize: '14pt !important',
  };

  return (
    <div
      className={`${styles.chatMessage} ${
        isAssistantMessage ? styles.assistantMessage : ''
      } ${isUserMessage ? styles.userMessage : ''} ${
        isLoadingMessage ? styles.loadingMessage : ''
      } ${isIntroMessage ? styles.introMessage : ''}`}
    >
        <div><span className={styles.message} style={isAssistantMessage ? messageStyle : null}>
        {message}
      </span></div>
      {isAssistantMessage && (
        <div className={styles.link}>
          <div>
          <a 
          
            href={`https://whatsonchain.com/tx/${txid}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkIcon}
            style={linkStyle}
          >
            <img src="/link-icon.png" alt="Link Icon" />
          </a>
          <span className={styles.txid}>{txid}</span>
          <span className={styles.tokens}>{tokens} Tokens</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
