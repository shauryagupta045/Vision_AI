import React, { createContext, useState, useEffect } from 'react';
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]); // New state for all messages in current chat
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  // Change resultData to an object mapping message index to its displayed text
  const [resultData, setResultData] = useState({});
  const [user, setUser] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (token && userId) {
      // Do not show login toast on page reload
      login(token, userId, username, false);
    }
  }, []);

  const fetchChatHistory = async (token) => {
    if (!token) return; // Skip if no token (guest user)
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const chats = await response.json();
        setPrevPrompts(chats);
      } else {
        console.error('Failed to fetch chat history');
        if (response.status === 401) {
          logout(); // Token might be expired or invalid
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const formatResponse = (text) => {
    // Split text into lines
    const lines = text.split('\n');

    let html = '';
    let inList = false;
    let inOrderedList = false;

    lines.forEach((line, index) => {
      let trimmed = line.trim();

      // Handle headers (##)
      if (trimmed.startsWith('##')) {
        if (inList) {
          html += inOrderedList ? '</ol>' : '</ul>';
          inList = false;
          inOrderedList = false;
        }
        html += `<h2>${trimmed.replace('##', '').trim()}</h2>`;
        return;
      }

      // Handle ordered list items (**1., **2., etc.)
      const orderedListMatch = trimmed.match(/^\*\*\d+\./);
      if (orderedListMatch) {
        if (!inList || !inOrderedList) {
          if (inList) {
            html += '</ul>';
          }
          html += '<ol>';
          inList = true;
          inOrderedList = true;
        }
        // Remove leading **number. and trim
        const content = trimmed.replace(/^\*\*\d+\./, '').trim();
        // Replace ***italic*** with <em>
        const contentWithItalic = content.replace(/\*\*\*(.*?)\*\*\*/g, '<em>$1</em>');
        // Replace **bold** with <strong>
        const contentWithBold = contentWithItalic.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace parenthetical notes with span
        const contentFinal = contentWithBold.replace(/\((.*?)\)/g, '<span class="note">($1)</span>');
        html += `<li>${contentFinal}</li>`;
        return;
      }

      // Handle unordered list items (* ...)
      if (trimmed.startsWith('* ')) {
        if (!inList || inOrderedList) {
          if (inList) {
            html += '</ol>';
          }
          html += '<ul>';
          inList = true;
          inOrderedList = false;
        }
        // Remove leading * and trim
        const content = trimmed.substring(2).trim();
        // Replace ***italic*** with <em>
        const contentWithItalic = content.replace(/\*\*\*(.*?)\*\*\*/g, '<em>$1</em>');
        // Replace **bold** with <strong>
        const contentWithBold = contentWithItalic.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace parenthetical notes with span
        const contentFinal = contentWithBold.replace(/\((.*?)\)/g, '<span class="note">($1)</span>');
        html += `<li>${contentFinal}</li>`;
        return;
      }

      // Close any open lists if line is empty or normal paragraph
      if (inList) {
        html += inOrderedList ? '</ol>' : '</ul>';
        inList = false;
        inOrderedList = false;
      }

      if (trimmed.length === 0) {
        // Empty line, add line break
        html += '<br />';
        return;
      }

      // Replace ***italic*** with <em>
      let lineWithItalic = trimmed.replace(/\*\*\*(.*?)\*\*\*/g, '<em>$1</em>');
      // Replace **bold** with <strong>
      let lineWithBold = lineWithItalic.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Replace parenthetical notes with span
      let lineFinal = lineWithBold.replace(/\((.*?)\)/g, '<span class="note">($1)</span>');

      html += `<p>${lineFinal}</p>`;
    });

    // Close any open lists at the end
    if (inList) {
      html += inOrderedList ? '</ol>' : '</ul>';
    }

    return html;
  };

  const delayPara = (text, messageIndex) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setResultData(prev => ({
          ...prev,
          [messageIndex]: formatResponse(text)
        }));
        resolve();
      }, 25);
    });
  };

  const newChat = () => {
    console.log('newChat called');
    setLoading(false);
    setShowResult(false);
    setInput("");
    setCurrentChatId(null);
    setRecentPrompt("");
    setCurrentMessages([]);
    setResultData({});
  };

  // Update the login function to clear previous user data before setting new user data
  const login = (token, userId, username, showToastFlag = true) => {
    // Clear all previous user data first
    clearAllStates();
    
    // Set new user data
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setUser({ id: userId, username });
    
    // Fetch fresh chat history for the new user
    fetchChatHistory(token);
    
    if (showToastFlag) {
      showToast('Login successful', 'success');
    }
  };

  // Add a new helper function to clear all states
  const clearAllStates = () => {
    setUser(null);
    setCurrentChatId(null);
    setPrevPrompts([]);
    setRecentPrompt("");
    setShowResult(false);
    setInput("");
    setCurrentMessages([]);
    setResultData({});
    setLoading(false);
  };

  const guestLogin = () => {
    // Clear all previous states first
    clearAllStates();
    
    // Set guest user data
    setUser({ id: 'guest', username: 'Guest' });
    setPrevPrompts([]);
    setCurrentChatId(null);
    setRecentPrompt("");
    setShowResult(false);
    setInput("");
    setCurrentMessages([]);
    setResultData({});
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    clearAllStates();
  };

  const deleteChat = async (chatId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove chat from frontend
        setPrevPrompts(prev => prev.filter(chat => chat._id !== chatId));
        // If we're deleting the current chat, reset the current chat ID
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setShowResult(false);
          setRecentPrompt("");
          setCurrentMessages([]);
        }
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const loadChat = async (chatId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const chat = await response.json();
        setCurrentChatId(chat._id);
        // Set all messages in current chat
        setCurrentMessages(chat.messages);
        // Set the last user message as recentPrompt
        const lastUserMessage = chat.messages.filter(m => m.role === 'user').pop();
        if (lastUserMessage) {
          setRecentPrompt(lastUserMessage.content);
        }
        setResultData({});
        setShowResult(true); // Show the conversation
        setLoading(false);
      } else {
        console.error('Failed to load chat');
        showToast('Failed to load chat', 'error');
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      showToast('Error loading chat', 'error');
    }
  };

  const saveChatToBackend = async (messages, chatId = null) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      let currentChatId = chatId;
      let chatData;

      console.log('saveChatToBackend called with chatId:', chatId);

      if (!currentChatId) {
        console.log('Creating new chat...');
        // Create a new chat
        const res = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        });

        if (!res.ok) {
          throw new Error(`Failed to create chat: ${res.status} ${res.statusText}`);
        }

        chatData = await res.json();
        currentChatId = chatData._id;
        console.log('New chat created with ID:', currentChatId);

        // Update title with the first message
        await fetch(`http://localhost:5000/api/chat/${currentChatId}/title`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: messages[0].content })
        });

      } else {
        console.log('Using existing chat with ID:', currentChatId);
      }

      // Add messages to the chat
      console.log('Adding message to chat:', currentChatId, messages[0]);
      const messageRes = await fetch(`http://localhost:5000/api/chat/${currentChatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messages[1] ? messages[1] : messages[0]) // Send one message at a time
      });

      if (!messageRes.ok) {
        throw new Error(`Failed to add message to chat: ${messageRes.status} ${messageRes.statusText}`);
      }

      console.log('Message added successfully');
      return currentChatId;

    } catch (error) {
      console.error('Error saving chat:', error);
      throw error; // Re-throw the error so the caller knows it failed
    }
  };

  const onSent = async (prompt) => {
    if (loading) return;
    
    setLoading(true);
    setShowResult(true);
    
    const currentPrompt = prompt !== undefined ? prompt : input;
    setRecentPrompt(currentPrompt);

    // Add user message to currentMessages
    const newMessageIndex = currentMessages.length;
    setCurrentMessages(prev => [...prev, { role: 'user', content: currentPrompt }]);

    try {
        // Save user message if logged in
        if (user && user.id !== 'guest') {
            try {
                let localChatId = currentChatId;
                localChatId = await saveChatToBackend([{ role: 'user', content: currentPrompt }], localChatId);
                if (localChatId) {
                    setCurrentChatId(localChatId);
                }
                await fetchChatHistory(localStorage.getItem('token'));
            } catch (error) {
                console.error('Failed to save prompt:', error);
                showToast('Failed to save prompt', 'error');
            }
        }

        // Get AI response
        const response = await run(currentPrompt);
        
        // Add assistant message to currentMessages
        const assistantMessageIndex = newMessageIndex + 1;
        setCurrentMessages(prev => [...prev, { role: 'assistant', content: response }]);

        // Save assistant response if logged in
        if (user && user.id !== 'guest' && currentChatId) {
            try {
                await saveChatToBackend([{ role: 'assistant', content: response }], currentChatId);
                await fetchChatHistory(localStorage.getItem('token'));
            } catch (error) {
                console.error('Failed to save response:', error);
            }
        }

        // Type out the response character by character
        let currentText = '';

        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            await delayPara(currentText, assistantMessageIndex);
        }

    } catch (error) {
        console.error('Error:', error);
        setCurrentMessages(prev => [
            ...prev,
            { role: 'assistant', content: "Sorry, there was an error. Please try again." }
        ]);
        setResultData(prev => ({
            ...prev,
            [newMessageIndex + 1]: "Sorry, there was an error. Please try again."
        }));
    } finally {
        setLoading(false);
        setInput("");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: '' });
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    user,
    login,
    guestLogin,
    logout,
    currentChatId,
    setCurrentChatId,
    toast,
    showToast,
    clearToast,
    deleteChat,
    loadChat,
    currentMessages,
    setCurrentMessages
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
