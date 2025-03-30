// server.js - Main Backend Server
const express = require("express");
const cors = require("cors");
const { getVideoInfo } = require("./api/video-info");
const { downloadVideo } = require("./api/download");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API route to fetch video information
app.get("/api/video-info", async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

        const videoData = await getVideoInfo(videoUrl);
        res.json(videoData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video info", details: error.message });
    }
});

// API route to download video
app.get("/api/download", async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

        const downloadLink = await downloadVideo(videoUrl);
        res.redirect(downloadLink);
    } catch (error) {
        res.status(500).json({ error: "Failed to download video", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
