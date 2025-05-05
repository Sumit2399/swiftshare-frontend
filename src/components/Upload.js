import React, { useState, useEffect } from "react";
import { uploadContent, retrieveContent } from "../services/api";

const Upload = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [expiration, setExpiration] = useState(null);
  const [countdown, setCountdown] = useState("");

  // Load session data on mount
  useEffect(() => {
    if (sessionId) {
      retrieveContent(sessionId)
        .then((response) => {
          if (response.data) {
            setText(response.data.text || "");
            setImage(response.data.image || "");
            setExpiration(response.data.expiration);
          }
        })
        .catch((error) => console.error("Error fetching existing content:", error));
    }
  }, [sessionId]);

  // Save sessionId to localStorage
  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  // Expiry countdown
  useEffect(() => {
    if (!expiration) return;

    const interval = setInterval(() => {
      const timeLeft = new Date(expiration).getTime() - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCountdown("Expired");
      } else {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
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
      const response = await uploadContent({ text, image, sessionId });
      setSessionId(response.data.sessionId);
      setExpiration(response.data.expiration);
      localStorage.setItem("sessionId", response.data.sessionId);
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
          <span className="session-id">{sessionId}</span>
          <button className="copy-button" onClick={handleCopy}>Copy</button>
        </div>
      )}

      {expiration && (
        <div className="countdown-container">
          <p>Session expires in: <strong>{countdown}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Upload;
