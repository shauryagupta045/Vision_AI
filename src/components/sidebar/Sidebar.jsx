import React, { useContext } from 'react'
import './Sidebar.css'
import plus from '../../assets/plus.png'
import msg from '../../assets/message.png'
import ques from '../../assets/question.png'
import set from '../../assets/setting.png'
import logo from '../../assets/logo.png'
import { Context } from '../../context/Context'






const Sidebar = () => {
  const{onSent ,prevPrompts  ,setRecentPrompt , newChat} = useContext(Context)

   

const loadPrompt = async(prompt)  =>{
  setRecentPrompt(prompt)
  await onSent(prompt)
}

  return (
    <div className='sidebar'>
      <div className="top">

<img className='menu' src={logo}  alt="" /><h2>Vision&nbsp;&nbsp;AI</h2>


<div onClick = {() =>newChat()}   className="new-chat">
  <img src={plus} alt="" />
  <p>New Chat</p>
</div>

<div className="recent">
  <p className="recent-tittle"></p><h4>History</h4>


  {prevPrompts.map((item , index) =>{
         return (
<div onClick ={() => loadPrompt(item)}className="history-msg  recent-entry">
    <img src={msg} alt="" />
    <p>{item.slice(0, 15)}..</p>
  </div>
         )
  })}
  
</div>
      </div>

      
   <div className="bottom">
     <div className="bottom-item  recent-entry">
<img src={ques} alt="" />
<p>Help </p>
     </div>


     <div className="bottom-item  recent-entry">
<img src={set} alt="" />
<p>Setting</p>
     </div>


</div>
</div>
  )
}

export default Sidebar