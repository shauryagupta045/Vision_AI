import React, { useRef, useState } from 'react'
import './ImageGenerator.css';
import tiger from '../../assets/ai-image.jpg';
const ImageGenerator = () => {
 
  const[image_url , setImage_url] = useState("/ai");
  let inputRef = useRef(null);



  return (
   <>
   <div className="ai-image-generator">
    <div className="ai-image-header">Vision AI <span>Ai Image Generator</span></div>
    <div className="img-loading">
      <div className="ai-image">
        <img src={image_url === "/ai" ?tiger:image_url } alt="" />
      </div>
    </div>
    <div className="ai-search-box">
      <input type="text" className='ai-search-input' placeholder="Enter your Prompt here" />
      <div className="ai-generate-btn">Generate</div>
    </div>
   </div>
   </>
  )
}

export default ImageGenerator
