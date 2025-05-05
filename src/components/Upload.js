import React, { useState, useEffect } from "react";
import { uploadContent, retrieveContent } from "../services/api";

const Upload = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");

  // Load saved content only if text/image is empty
  useEffect(() => {
    if (sessionId && !text && !image) {
      retrieveContent(sessionId)
        .then((response) => {
          if (response.data) {
            setText(response.data.text || "");
            setImage(response.data.image || "");
          }
        })
        .catch((error) => console.error("Error fetching existing content:", error));
    }
  }, [sessionId]);

  // Save sessionId to localStorage whenever it changes
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
      const response = await uploadContent({ text, image, sessionId }); // Overwrites if sessionId exists
      setSessionId(response.data.sessionId);
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
    </div>
  );
};

export default Upload;
