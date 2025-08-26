import React, { useContext } from 'react'
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

 const{onSent ,  prevPrompts, setPrevPrompts, recentPrompt , showResult , loading , resultData , setInput ,input}= useContext(Context)
   


 const handleCardClick = (prompt) => {
    setInput(prompt);
    onSent(prompt);
    setPrevPrompts(prev => [...prev, prompt]);
  }; 





  return (
    <div className='main'>

        <div className="nav">
            <p>Vision AI</p>
            <div className="nav-right"><button>Upgrade Plan</button>
            <img src={user} alt="" /></div>
          </div> 
      
      <div className="main-container">
   
   {!showResult
     ?<>
     <div className="greet">
            <p><span>Hello, Shaurya</span></p>
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
   
   :<div className='result'>
    <div className="result-tittle">
<img src={user} alt="" />
<p>{recentPrompt}</p>

    </div>


  <div className="result-data">
    <img src={logo} alt="" />
    {loading  
    ?  <div className='loader'>
        <hr />
        
        </div>
   : <p dangerouslySetInnerHTML={{__html:resultData}}></p>
 } 
 </div>
</div>

   }

        
            


    <div className="main-bottom">
        <div className="search-box">
            
            <input onChange ={(e)=>setInput(e.target.value) } value ={input}  type="text"  placeholder='Enter your prompt here '/>
        

        {input ? <img onClick ={() => onSent()} src={send} alt="" /> :null}
        </div>
    
    


<div className='bottom-info'>
    Vision AI May Display Inaccurate Infomation.
    </div>
</div>
</div>
</div>


  )
}

export default Main