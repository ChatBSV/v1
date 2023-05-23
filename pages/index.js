// index.js

import React, { useState, useEffect } from 'react';
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
  const [systemPromptSent, setSystemPromptSent] = useState(false);

  const handleSubmit = async (prompt) => {
    setIsLoading(true);
    setIsError(false);

    const lastMessage = chat[chat.length - 1]?.message || '';
    const response = await getChatReply(prompt, lastMessage);

    setIsLoading(false);

    if (response) {
      const output = response.data.message;
      const totalTokens = response.data.totalTokens;
      setChat((prevChat) => [
        ...prevChat,
        { message: prompt, isUser: true },
        { message: output, totalTokens, isUser: false },
      ]);
    } else {
      setIsError(true);
    }
  };

  const getChatReply = async (prompt) => {
    const lastUserMessage = chat[chat.length - 1]?.message || '';
  
    try {
      const response = await axios.post('/.netlify/functions/getChatReply', {
        prompt,
        lastUserMessage,
      });
  
      if (response) {
        const assistantResponse = response.data.message;
        const totalTokens = response.data.totalTokens;
  
        setChat((prevChat) => [
          ...prevChat,
          { message: assistantResponse, totalTokens, isUser: false },
        ]);
  
        const updatedChatHistory = [
          ...chatHistory,
          { content: lastUserMessage },
        ];
        setChatHistory(updatedChatHistory);
        localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
    }
  };
  

  useEffect(() => {
    if (!systemPromptSent && process.env.CORE_PROMPT) {
      handleSubmit(process.env.CORE_PROMPT);
      setSystemPromptSent(true);
    }
  }, []);

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Head>
        <title>Hi there, I am AIfred.</title>
        <meta name="description" content="Your local friendly interface to OpenAI. Ask me anything!" />
        <meta property="og:title" content="Hi there, I am AIfred." />
        <meta property="og:description" content="Your local friendly interface to OpenAI. Ask me anything!" />
        <meta property="og:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad1a_AL-og.png" />
        <meta property="twitter:title" content="Hi there, I am AIfred." />
        <meta property="twitter:description" content="Your local friendly interface to OpenAI. Ask me anything!" />
        <meta property="twitter:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad1a_AL-og.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad07_AL-favicon.png" />
        <link rel="apple-touch-icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d33188cfb0d03f9067f7_AL-webclip.png" />
      </Head>
      <Header />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
};

export default IndexPage;
