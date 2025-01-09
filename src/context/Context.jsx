import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    setPrevPrompts((prev) => [...prev, input]);
    
    try {
      const response = await run(input);

      // Split response by ** for bold and replace * with line breaks
      const formattedResponse = response
        .split("**")
        .map((text, index) => (index % 2 === 0 ? text : `<b>${text}</b>`))
        .join("")
        .split("  ")
        .join("<br>");

      const words = formattedResponse.split(" ");
      words.forEach((word, index) => {
        setTimeout(() => {
          setResultData((prev) => prev + word + " ");
        }, index * 50);
      });
    } catch (error) {
      console.error("Error fetching data from Gemini API:", error);
      setResultData("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
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
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
