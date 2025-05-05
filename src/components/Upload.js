import React, { useState, useEffect } from "react";
import { uploadContent } from "../services/api";
import "../styles.css";

const Upload = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [expiration, setExpiration] = useState(localStorage.getItem("expiration") || null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (sessionId) localStorage.setItem("sessionId", sessionId);
    if (expiration) localStorage.setItem("expiration", expiration);
  }, [sessionId, expiration]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!expiration) return;
      const timeLeft = new Date(expiration) - new Date();
      if (timeLeft <= 0) {
        setCountdown("Expired");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        setCountdown(`${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiration]);

  const handlePaste = (e) => {
    const items = (e.clipboardData || window.clipboardData).items;
    for (let item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async () => {
    try {
      const response = await uploadContent({ text, image });
      setSessionId(response.data.sessionId);
      setExpiration(response.data.expiration);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
    alert("Session ID copied!");
  };

  return (
    <div className="upload-container">
      <h2>Upload Content</h2>
      <textarea
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPaste={handlePaste}
        className="upload-textarea"
      />
      {image && <img src={image} alt="Pasted" className="uploaded-image" />}
      <button onClick={handleUpload} className="upload-button">Upload</button>

      {sessionId && (
        <div className="session-container">
          <p>Session ID: <span className="session-id">{sessionId}</span></p>
          <button onClick={handleCopy} className="copy-button">Copy</button>
          <p>Expires in: <span className="countdown">{countdown}</span></p>
        </div>
      )}
    </div>
  );
};

export default Upload;
