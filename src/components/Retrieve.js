import React, { useState, useEffect } from "react";
import { retrieveContent } from "../services/api";
import "../styles.css";

const Retrieve = () => {
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [content, setContent] = useState(null);

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  const handleRetrieve = async () => {
    try {
      const response = await retrieveContent(sessionId);
      setContent(response.data);
    } catch (error) {
      console.error("Retrieval failed:", error);
    }
  };

  const copyToClipboard = () => {
    if (content?.text) {
      navigator.clipboard.writeText(content.text);
      alert("Text copied to clipboard!");
    }
  };

  return (
    <div className="retrieve-container">
      <h2 className="retrieve-heading">Retrieve Content</h2>

      <input
        type="text"
        className="retrieve-input"
        placeholder="Enter session ID..."
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />

      <button onClick={handleRetrieve} className="retrieve-button">Retrieve</button>

      {content && (
        <div className="retrieve-content">
          <h3>Retrieved Text:</h3>
          <p className="retrieve-text">{content.text}</p>

          <button className="copy-button" onClick={copyToClipboard}>Copy Text</button>

          {content.image && (
            <>
              <h3>Retrieved Image:</h3>
              <img src={content.image} alt="Retrieved" className="retrieve-image" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Retrieve;
