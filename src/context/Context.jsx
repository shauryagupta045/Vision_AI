import React, { createContext, useState, useEffect } from 'react';
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
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

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setCurrentChatId(null);
    setRecentPrompt("");
  };

  const login = (token, userId, username, showToastFlag = true) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setUser({ id: userId, username });
    // Clear previous prompts and fetch fresh chat history
    setPrevPrompts([]);
    fetchChatHistory(token);
    if (showToastFlag) {
      showToast('Login successful', 'success');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
    setCurrentChatId(null);
    setPrevPrompts([]);
    setRecentPrompt("");
    setShowResult(false);
    setInput("");
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
        // Set the last user message as recentPrompt
        const lastUserMessage = chat.messages.filter(m => m.role === 'user').pop();
        if (lastUserMessage) {
          setRecentPrompt(lastUserMessage.content);
        }
        // Since assistant messages are not saved, clear resultData
        setResultData("");
        setShowResult(false);
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

  const saveChatToBackend = async (messages) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      let chatId = currentChatId;
      let chatData;

      console.log('saveChatToBackend called with currentChatId:', currentChatId);

      if (!chatId) {
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
        chatId = chatData._id;
        setCurrentChatId(chatId);
        console.log('New chat created with ID:', chatId);

        // Update title with the first message
        await fetch(`http://localhost:5000/api/chat/${chatId}/title`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: messages[0].content })
        });

      } else {
        console.log('Using existing chat with ID:', chatId);
      }

      // Add messages to the chat
      console.log('Adding message to chat:', chatId, messages[0]);
      const messageRes = await fetch(`http://localhost:5000/api/chat/${chatId}/messages`, {
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

    } catch (error) {
      console.error('Error saving chat:', error);
      throw error; // Re-throw the error so the caller knows it failed
    }
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    const currentPrompt = prompt !== undefined ? prompt : input;

    setRecentPrompt(currentPrompt);

    // Only add to prevPrompts if user is logged in
    if (user) {
        // We don't need to manually add to prevPrompts since we'll fetch updated history
        // Just ensure the chat is saved to backend
    }

    if (user) {
        try {
            // Create a new chat for each prompt
            setCurrentChatId(null);
            await saveChatToBackend([{ role: 'user', content: currentPrompt }]);
            // Refresh chat history immediately after saving prompt
            await fetchChatHistory(localStorage.getItem('token'));
            showToast('Prompt saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save prompt to chat history:', error);
            showToast('Failed to save prompt', 'error');
            // Continue anyway, as we still want to show the response to the user
        }
    }

    response = await run(currentPrompt);

    if (user) {
        // Do not save assistant response to DB as per requirement
        // No need to refresh chat history here since done after prompt save
    }

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
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
    logout,
    currentChatId,
    setCurrentChatId,
    toast,
    showToast,
    clearToast,
    deleteChat,
    loadChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
