import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import tiger from '../../assets/ai-image.jpg'; // Default image

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState(tiger); // Default image shown initially
  const inputRef = useRef(null); // Reference to the input field

  const generateImage = async () => {
    const prompt = inputRef.current.value.trim(); // Trim whitespace
    if (!prompt) {
      alert('Please enter a valid prompt.');
      return;
    }

    try {
      const response = await fetch('https://api.generativeai.example.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`, // Use your API key
        },
        body: JSON.stringify({
          prompt,
          number_of_images: 1,
          safety_filter_level: 'block_only_high',
          person_generation: 'allow_adult',
          aspect_ratio: '3:4',
          negative_prompt: 'Outside',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.images && data.images.length > 0) {
        setImageUrl(data.images[0].url); // Update the image URL state
      } else {
        alert('No image generated, try a different prompt.');
        setImageUrl(tiger); // Revert to the default image if no new image is returned
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again later.');
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="ai-image-header">Vision AI <span>Ai Image Generator</span></div>
      <div className="img-loading">
        <div className="ai-image">
          <img src={imageUrl} alt="Generated AI" />
        </div>
      </div>
      <div className="ai-search-box">
        <input
          type="text"
          ref={inputRef}
          className="ai-search-input"
          placeholder="Enter your Prompt here"
        />
        <div className="ai-generate-btn" onClick={generateImage}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
