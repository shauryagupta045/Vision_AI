// removed image generation because its not working   <button className="homepage-button" onClick={handlegenrate}>Generate Images</button> 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css'; // Make sure to create and import this CSS file
import Modal from '../Modal/Modal';
import ss1 from '../../assets/Screenshot1.png'
import ss2 from '../../assets/Screenshot2.png'
import ss3 from '../../assets/Screenshot3.png'

const messages = [
  "Text asking a friend to be my plus-one",
  "Improve my essay writing, ask me to outline my thoughts",
  "Tell me a fun fact about the Roman Empire",
  "Write a text inviting my neighbors to a barbecue",
  "Give me ideas for what to do with my kids' art",
  "Help me study vocabulary for a college entrance exam",
  "Text asking a friend to be my plus-one",
  "Improve my essay writing, ask me to outline my thoughts",
  "Tell me a fun fact about the Roman Empire",
  "Write a text inviting my neighbors to a barbecue",
  "Give me ideas for what to do with my kids' art",
  "Help me study vocabulary for a college entrance exam",
  "Text asking a friend to be my plus-one",
  "Improve my essay writing, ask me to outline my thoughts",
  "Tell me a fun fact about the Roman Empire",
  "Write a text inviting my neighbors to a barbecue",
  "Give me ideas for what to do with my kids' art",
  "Help me study vocabulary for a college entrance exam",
  // Add more messages as needed
];


const Homepage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartNow = () => {
    setIsModalOpen(true);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsModalOpen(false);
  };

  const handleGuest = () => {
    navigate('/app');
    setIsModalOpen(false);
  };

  const handlegenrate = () => {
    navigate('/generate');
  };

  return (
<div className="homepage">
        <nav className="navbar">
            <div className="navbar-logo">Vision AI</div>
            <div className="navbar-menu">
                <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
                <label htmlFor="navbar-toggle" className="navbar-toggle-label">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
                <ul className="navbar-links">
                    <li><a href="#research">Research</a></li>
                    <li><a href="#products">Products</a></li>
                    <li><a href="#safety">Safety</a></li>
                    <li><a href="#company">Company</a></li>
                </ul>
            </div>
            <div className="navbar-user">
                <button className="user-button" onClick={() => navigate('/login')}>
                    <i className="user-icon">👤</i>
                    <span>Login/Signup</span>
                </button>
            </div>
        </nav>


    <div className="homepage-container">
      <header className="homepage-header">
        <p className="homepage-pp">Vision AI</p>
        <h1 className="homepage-title">Get answers. Find inspiration.<br/> Be more productive.</h1>
        <p className="homepage-ppp">Free to use. Easy to try.<br/> Just ask and Vision AI can help with writing, learning, brainstorming, and more.</p>
        <div className="homepage-buttons">
          <button className="homepage-button" onClick={handleStartNow}>Start Vision AI  Chat</button>
       
          <button className="homepage-button" onClick={() => navigate('/learn')}>Learn about Vision AI</button>
        </div>
      </header> 
     
      <div className="message-container">
          <div className="message-scroller left-to-right">
            {messages.map((message, index) => (
              <div className="message-box" key={index}>
                {message}
              </div>
            ))}
            {messages.map((message, index) => (
              <div className="message-box" key={`repeat1-${index}`}>
                {message}
              </div>
            ))}
          </div>
          <div className="message-scroller right-to-left">
            {messages.map((message, index) => (
              <div className="message-box" key={`reverse-${index}`}>
                {message}
              </div>
            ))}
            {messages.map((message, index) => (
              <div className="message-box" key={`repeat2-${index}`}>
                {message}
              </div>
            ))}
          </div>
          <div className="message-scroller left-to-right">
            {messages.map((message, index) => (
              <div className="message-box" key={`repeat3-${index}`}>
                {message}
              </div>
            ))}
            {messages.map((message, index) => (
              <div className="message-box" key={`repeat4-${index}`}>
                {message}
              </div>
            ))}
          </div>
        </div>
                <div className="content">
                  <h2 className="content-heading">Generate and debug code. Automate repetitive tasks. Learn new APIs.</h2>
                  <img  className ="content-image" src= {ss1} alt="" />
                  <h2 className="content-heading">Learn something new. Dive into a hobby. Answer complex questions.
                  </h2>
                  <img  className ="content-image" src={ss3} alt="" />
                  
                </div>

      <div className="pricing-plans">
      <h1>Get started with Vision AI today</h1>
      <p>View pricing plans</p>
      <div className="plans-container">
        <div className="plan-card">
          <h2>Free</h2>
          <p>$0 / month</p>
          <p>Explore how AI can help with everyday tasks</p>
          <button>Get Free</button>
          <ul>
            <li>Access to Vision-40 mini</li>
            <li>Standard voice mode</li>
            <li>Limited access to Vision-40</li>
            <li>Limited access to file uploads, advanced data analysis, web browsing, and image generation</li>
            <li>Use custom GPTs</li>
          </ul>
        </div>
        <div className="plan-card">
          <h2>Plus</h2>
          <p>$20 / month</p>
          <p>Level up productivity and creativity with expanded access</p>
          <button>Get Plus</button>
          <p>Limits apply</p>
          <ul>
            <li>Everything in Free</li>
            <li>Extended limits on messaging, file uploads, advanced data analysis, and image generation</li>
            <li>Standard and advanced voice mode</li>
            <li>Limited access to o1 and o1-mini</li>
            <li>Opportunities to test new features</li>
            <li>Create and use custom GPTs</li>
          </ul>
        </div>
        <div className="plan-card">
          <h2>Pro</h2>
          <p>$200 / month</p>
          <p>Get the best of Vision with the highest level of access</p>
          <button>Get Pro</button>
          <ul>
            <li>Everything in Plus</li>
            <li>Unlimited access to Vision-40 and o1</li>
            <li>Unlimited access to advanced voice</li>
            <li>Access to o1 pro mode</li>
          </ul>
        </div>
      </div>
    </div>


    <div className="join-section">
      <h1>Join hundreds of millions of users and try Vision AI today.</h1>
      <button className="try-button">Try Vision AI &rarr;</button>
    </div>






<footer className="footer-container">
<div className="footer-columns">
  <div className="footer-column">
    <h4>Our research</h4>
    <ul>
      <li>Overview</li>
      <li>Index</li>
      <li>Latest advancements</li>
      <li>Vision 01</li>
      <li>Vision 01-mini</li>
      <li>Vision AI-2</li>
      <li>Vision-40 mini</li>
      <li>DALL-E 3</li>
      <li>Sora</li>
    </ul>
  </div>
  <div className="footer-column">
    <h4>Vision AI</h4>
    <ul>
      <li>For Everyone</li>
      <li>For Teams</li>
      <li>For Enterprises</li>
      <li>Vision AI login</li>
      <li>Download</li>
      <li>API</li>
      <li>Platform overview</li>
      <li>Pricing</li>
      <li>Documentation</li>
      <li>API login</li>
    </ul>
  </div>
  <div className="footer-column">
    <h4>Safety overview</h4>
    <ul>
      <li>Safety overview</li>
    </ul>
  </div>
  <div className="footer-column">
    <h4>Company</h4>
    <ul>
      <li>About us</li>
      <li>News</li>
      <li>Our Charter</li>
      <li>Security</li>
      <li>Residency</li>
      <li>Careers</li>
    </ul>
  </div>
  <div className="footer-column">
    <h4>Terms & policies</h4>
    <ul>
      <li>Terms of use</li>
      <li>Privacy policy</li>
      <li>Brand guidelines</li>
      <li>Other policies</li>
    </ul>
  </div>
</div>
<div className="footer-bottom">
  <p>Vision AI  ©2025</p>
</div>
</footer>

<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  onLogin={handleLogin} 
  onGuest={handleGuest} 
/>

</div>
</div>
  );
 
};


export default Homepage;
