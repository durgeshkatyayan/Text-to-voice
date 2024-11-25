import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState(""); // Store input text or file content
  const [audioURL, setAudioURL] = useState(""); // Store generated audio file URL

  // Handle text input changes
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle file upload and extract text
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setText(response.data.text); // Set extracted text in textarea
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Convert text to audio
  const convertToAudio = async () => {
    if (!text.trim()) {
      alert("Please provide some text to convert!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/convert", { text });
      setAudioURL(response.data.audioURL); // Set generated audio URL
    } catch (error) {
      console.error("Error converting text to audio:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Text-to-Audio Converter</h1>
      <p style={styles.subheading}>Easily convert text to audio or upload a file to extract content!</p>
      
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        rows="6"
        style={styles.textarea}
      />
      
      <div style={styles.fileUploadContainer}>
        <label htmlFor="fileUpload" style={styles.fileLabel}>
          Upload a Text File
        </label>
        <input
          id="fileUpload"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          style={styles.fileInput}
        />
      </div>
      
      <button onClick={convertToAudio} style={styles.convertButton}>
        Convert to Audio
      </button>
      
      {audioURL && (
        <div style={styles.audioContainer}>
          <h3 style={styles.audioHeading}>Your Audio File:</h3>
          <audio controls style={styles.audioPlayer}>
            <source src={audioURL} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2.5em",
    color: "#333",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "1.2em",
    color: "#666",
    marginBottom: "30px",
  },
  textarea: {
    width: "80%",
    padding: "15px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "8px",
    resize: "none",
    marginBottom: "20px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  fileUploadContainer: {
    marginBottom: "20px",
  },
  fileLabel: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    display: "inline-block",
  },
  fileInput: {
    display: "none", // Hide the default file input
  },
  convertButton: {
    padding: "12px 25px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "1em",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    marginTop: "10px",
  },
  convertButtonHover: {
    backgroundColor: "#218838",
  },
  audioContainer: {
    marginTop: "30px",
  },
  audioHeading: {
    fontSize: "1.5em",
    color: "#333",
    marginBottom: "10px",
  },
  audioPlayer: {
    width: "80%",
    outline: "none",
  },
};

export default App;
