const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const say = require("say"); // For text-to-audio conversion
const cors = require("cors"); // Import correctly

const app = express();
const upload = multer({ dest: "uploads/" }); // Temporary upload folder

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Handle file uploads and extract text content
app.post("/api/upload", upload.single("file"), (req, res) => {
  const filePath = req.file?.path;

  // Check if file exists
  if (!filePath) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8"); // Read uploaded file
    fs.unlinkSync(filePath); // Clean up temporary file
    res.json({ text: fileContent }); // Return extracted text
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Convert text to audio
app.post("/api/convert", async (req, res) => {
  const { text } = req.body;

  // Validate input text
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "No text provided" });
  }

  const audioFileName = `output-${Date.now()}.mp3`;
  const audioFilePath = path.join(__dirname, "audio", audioFileName);

  try {
    // Use say.js to generate audio
    say.export(text, null, 1.0, audioFilePath, (err) => {
      if (err) {
        console.error("Error generating audio:", err);
        return res.status(500).json({ error: "Failed to generate audio" });
      }
      res.json({ audioURL: `http://localhost:5000/audio/${audioFileName}` });
    });
  } catch (error) {
    console.error("Error converting text to audio:", error);
    res.status(500).json({ error: "Failed to convert text to audio" });
  }
});

// Serve generated audio files
app.use("/audio", express.static(path.join(__dirname, "audio")));

// Create `audio` folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "audio"))) {
  fs.mkdirSync(path.join(__dirname, "audio"));
}

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

