import React, { useContext, useState } from 'react'
import './Sidebar.css'
import plus from '../../assets/plus.png'
import msg from '../../assets/message.png'
import ques from '../../assets/question.png'
import set from '../../assets/setting.png'
import userIcon from '../../assets/user.png'
import logo from '../../assets/logo.png'
import { Context } from '../../context/Context'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { onSent, prevPrompts, setRecentPrompt, newChat, user, logout, deleteChat, loadChat } = useContext(Context)
  const navigate = useNavigate()
  const [hoveredChatId, setHoveredChatId] = useState(null)

  const loadPrompt = async (chat) => {
    if (chat && chat._id) {
      await loadChat(chat._id)
    }
  }

  const handleDeleteChat = async (e, chatId) => {
    if (!chatId) return;
    e.stopPropagation();
    await deleteChat(chatId);
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Helper function to get chat display text
  const getChatDisplayText = (chat) => {
    if (!chat) return "Untitled Chat";
    
    if (chat.title) return chat.title;
    
    if (chat.messages && chat.messages[0] && chat.messages[0].content) {
      return chat.messages[0].content;
    }
    
    return "Untitled Chat";
  }

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="top">
        <div className="top-header">
          <div className="logo-section">
            <img 
              className='menu' 
              src={logo} 
              alt="" 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={{cursor: 'pointer'}} 
            />
            <h2>Vision AI</h2>
          </div>
          {window.innerWidth <= 600 && (
            <button 
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          )}
        </div>

        {/* Remove the sidebarOpen condition for desktop view */}
        <div className="sidebar-content">
          <button onClick={() => {
              newChat();
              if (window.innerWidth <= 600) {
                  setSidebarOpen(false);
              }
          }} className="new-chat" type="button">
            <img src={plus} alt="" />
            <p>New Chat</p>
          </button>

          <div className="recent">
            <p className="recent-tittle"></p>
            <h4>History</h4>

            {Array.isArray(prevPrompts) && prevPrompts.map((chat) => {
              if (!chat) return null;
              const displayText = getChatDisplayText(chat);
              
              return (
                <div 
                  key={chat._id || Math.random()}
                  onMouseEnter={() => setHoveredChatId(chat._id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                  className="history-msg recent-entry"
                >
                  <div onClick={() => loadPrompt(chat)} className="history-content">
                    <img src={msg} alt="" />
                    <p>{displayText.slice(0, 15)}..</p>
                  </div>
                  {hoveredChatId === chat._id && (
                    <button 
                      className="delete-chat-btn"
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bottom">
        {user && (
          <div className="user-info">
            <img src={userIcon} alt="User" />
            <span>{user.username || `User #${user.id.slice(-4)}`}</span>
          </div>
        )}

        <div className="bottom-item recent-entry">
          <img src={ques} alt="" />
          <p>Help</p>
        </div>

        <div className="bottom-item recent-entry">
          <img src={set} alt="" />
          <p>Setting</p>
        </div>

        {user && (
          <div className="bottom-item recent-entry" onClick={handleLogout}>
            <img src={userIcon} alt="" />
            <p>Logout</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
