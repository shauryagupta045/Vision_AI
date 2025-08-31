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

const Main = () => {
  const { onSent, prevPrompts, setPrevPrompts, recentPrompt, showResult, loading, resultData, setInput, input, user: currentUser } = useContext(Context)
  const [showUserInfo, setShowUserInfo] = useState(false)

  const handleCardClick = (prompt) => {
    setInput(prompt);
    onSent(prompt);
    if (currentUser && !prevPrompts.includes(prompt)) {
      setPrevPrompts(prev => [...prev, prompt]);
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  return (
    <div className='main'>
      <div className="nav">
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
              <div className="card" onClick={() => handleCardClick('Suggest beautiful places to see on an upcoming road trips')}>
                <p>Suggest beautiful places to see on an upcoming road trips</p>
                <img src={comp} alt="" />
              </div>

              <div className="card" onClick={() => handleCardClick('Help explain a concept in a kid-friendly way')}>
                <p>Help explain a concept in a kid-friendly way</p>
                <img src={bulb} alt="" />
              </div>

              <div className="card" onClick={() => handleCardClick('Help to create a weekly plan of work')}>
                <p>Help to create a weekly plan of work</p>
                <img src={msg} alt="" />
              </div>

              <div className="card" onClick={() => handleCardClick('Improve the readability of the following code')}>
                <p>Improve the readability of the following code</p>
                <img src={code} alt="" />
              </div>
            </div>
          </>
          : <div className='result'>
            <div className="result-tittle">
              <img src={user} alt="" />
              <p>{recentPrompt}</p>
            </div>

            <div className="result-data">
              <img src={logo} alt="" />
              {loading
                ? <div className='loader'>
                  <hr />
                </div>
                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              }
            </div>
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
