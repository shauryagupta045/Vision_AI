import React, { useContext, useState } from 'react'
import './Main.css'
import user from '../../assets/user.png'
import bulb from '../../assets/bulb.png'
import msg from '../../assets/message.png'
import comp from '../../assets/compass.png'
import code from '../../assets/code.png'
import send from '../../assets/send.png'
import logo from '../../assets/logo.png'
import { Context } from '../../context/Context'

const Main = ({ sidebarOpen, setSidebarOpen }) => {
  const {
    onSent,
    prevPrompts,
    setPrevPrompts,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    user: currentUser,
    currentMessages,
    showToast // Add this
  } = useContext(Context)

  const [showUserInfo, setShowUserInfo] = useState(false)

  const handleCardClick = (prompt) => {
    setInput(prompt);
    onSent(prompt);
    if (currentUser && !prevPrompts.includes(prompt)) {
      setPrevPrompts(prev => [...prev, prompt]);
      showToast('Prompt added to history', 'success'); // Add toast notification
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };



  return (
    <div className='main'>
      <div className="nav">
        <div className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Vision AI</p>
        <div className="nav-right">
          <button>Upgrade Plan</button>
          <div className="user-container" onClick={toggleUserInfo}>
            <img src={user} alt="User" />
            {showUserInfo && currentUser && (
              <div className="user-info-popup">
                <p>{currentUser.username || `User #${currentUser.id.slice(-4)}`}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-container">
        {!showResult
          ? <>
            <div className="greet">
              <p><span>Hello, {currentUser ? (currentUser.username || `User #${currentUser.id.slice(-4)}`) : 'Guest'}</span></p>
              <p>How Can I Help You Today</p>
            </div>

            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Suggest scenic routes and destinations for a road trip")}>
                <p>Suggest scenic routes and destinations for a road trip</p>
                <img src={comp} alt="compass icon" />
              </div>

              <div className="card" onClick={() => handleCardClick("Explain how rainbows form in a kid-friendly way")}>
                <p>Explain how rainbows form in a kid-friendly way</p>
                <img src={bulb} alt="bulb icon" />
              </div>

              <div className="card" onClick={() => handleCardClick("Create a balanced weekly work schedule")}>
                <p>Create a balanced weekly work schedule</p>
                <img src={msg} alt="message icon" />
              </div>

              <div className="card" onClick={() => handleCardClick("Help improve code readability and structure")}>
                <p>Help improve code readability and structure</p>
                <img src={code} alt="code icon" />
              </div>
            </div>
          </>
          : <div className='result'>
            {currentMessages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? "result-tittle" : "result-data"}>
                <img src={message.role === 'user' ? user : logo} alt="" />
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  loading && index === currentMessages.length - 1 ? (
                    <div className='loader'>
                      <hr />
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: resultData[index] }} />
                  )
                )}
              </div>
            ))}
          </div>
        }

        <div className="main-bottom">
          <div className="search-box">
            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter your prompt here ' />
            {input ? <img onClick={() => onSent()} src={send} alt="" /> : null}
          </div>

          <div className='bottom-info'>
            Vision AI May Display Inaccurate Information.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
