// index.js

import React, { useState } from 'react';
import axios from 'axios';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import Head from 'next/head';
import './global.css';

const IndexPage = () => {
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const corePrompt = process.env.CORE_PROMPT || '';

  const handleSubmit = async (prompt) => {
    setChat((prevChat) => [...prevChat, { message: prompt, isUser: true }]);
    setIsLoading(true);
    setIsError(false);

    const response = await getChatReply(corePrompt, prompt, chat);

    setIsLoading(false);

    if (response) {
      const output = response.data.message;
      setChat((prevChat) => [...prevChat, { message: output, isUser: false }]);
    } else {
      setIsError(true);
    }
  };

  const getChatReply = async (corePrompt, prompt, chatHistory) => {
    try {
      let fullPrompt = [];

      if (chatHistory.length > 1) {
        fullPrompt.push(chatHistory[chatHistory.length - 2]); // Add the second-to-last user message
      }

      fullPrompt.push({ role: 'system', content: corePrompt });
      fullPrompt.push({ role: 'user', content: prompt });

      const response = await axios.post('/.netlify/functions/getChatReply', {
        corePrompt,
        prompt,
        memory: fullPrompt,
        envs: process.env,
      });

      return response;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Head>
        {/* Head tags */}
      </Head>
      <Header />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
      <div className="chat-footer">
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default IndexPage;
