import React, { useState, useEffect } from "react";
import { uploadContent, retrieveContent } from "../services/api";

const Upload = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [expiration, setExpiration] = useState(null);

  useEffect(() => {
    if (sessionId) {
      retrieveContent(sessionId)
        .then((response) => {
          if (response.data) {
            setText(response.data.text || "");
            setImage(response.data.image || "");
            if (response.data.expiration) {
              setExpiration(new Date(response.data.expiration));
            }
          }
        })
        .catch((error) => console.error("Error fetching existing content:", error));
    }
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

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
      setExpiration(new Date(response.data.expiration));
      localStorage.setItem("sessionId", response.data.sessionId);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(sessionId);
    alert("Session ID copied!");
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/retrieve?sessionId=${sessionId}`;
    navigator.clipboard.writeText(link);
    alert("Shareable link copied!");
  };

  const getCountdown = () => {
    if (!expiration) return null;
    const diff = expiration - new Date();
    if (diff <= 0) return "Expired";
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    return `${days}d ${hours}h ${minutes}m left`;
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
          <span className="session-id">Session ID: {sessionId}</span>
          <button className="copy-button" onClick={handleCopyId}>Copy ID</button>
          <button className="copy-link-button" onClick={handleCopyLink}>Copy Link</button>
        </div>
      )}

      {expiration && (
        <div className="countdown-timer">
          Expires in: <strong>{getCountdown()}</strong>
        </div>
      )}
    </div>
  );
};

export default Upload;
