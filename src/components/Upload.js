import React, { useState, useEffect } from "react";
import { uploadContent, retrieveContent } from "../services/api";

const Upload = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [expiration, setExpiration] = useState(null);
  const [countdown, setCountdown] = useState("");

  // Retrieve content on load if sessionId exists
  useEffect(() => {
    if (sessionId) {
      retrieveContent(sessionId)
        .then((response) => {
          if (response.data) {
            setText(response.data.text || "");
            setImage(response.data.image || "");
            setExpiration(new Date(response.data.expiration));
          }
        })
        .catch((error) => console.error("Error fetching existing content:", error));
    }
  }, [sessionId]);

  // Save sessionId locally
  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  // Update countdown every second
  useEffect(() => {
    if (!expiration) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(expiration) - now;

      if (diff <= 0) {
        setCountdown("Expired");
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
        const days = Math.floor(diff / 1000 / 60 / 60 / 24);
        setCountdown(`${days}d ${hours}h ${minutes}m`);
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
      const response = await uploadContent({ text, image, sessionId }); // keep session ID
      setSessionId(response.data.sessionId);
      setExpiration(new Date(response.data.expiration));
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

      {countdown && (
        <div className="countdown-timer">
          <strong>Expires in:</strong> {countdown}
        </div>
      )}
    </div>
  );
};

export default Upload;
