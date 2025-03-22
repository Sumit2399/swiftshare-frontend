import React, { useState } from "react";
import { uploadContent } from "../services/api";

const Upload = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [sessionId, setSessionId] = useState("");

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
