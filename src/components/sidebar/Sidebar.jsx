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

const Sidebar = () => {
  const { onSent, prevPrompts, setRecentPrompt, newChat, user, logout, deleteChat, loadChat } = useContext(Context)
  const navigate = useNavigate()
  const [hoveredChatId, setHoveredChatId] = useState(null)

  const loadPrompt = async (chat) => {
    await loadChat(chat._id)
  }

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent the click from triggering the loadPrompt function
    await deleteChat(chatId);
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='sidebar'>
      <div className="top">
        <img className='menu' src={logo} alt="" />
        <h2>Vision&nbsp;&nbsp;AI</h2>

        <div onClick={() => newChat()} className="new-chat">
          <img src={plus} alt="" />
          <p>New Chat</p>
        </div>

        <div className="recent">
          <p className="recent-tittle"></p>
          <h4>History</h4>

          {prevPrompts.map((chat) => {
            const displayText = chat.title || (chat.messages[0] && chat.messages[0].content) || "Untitled Chat";
            return (
              <div 
                key={chat._id}
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
