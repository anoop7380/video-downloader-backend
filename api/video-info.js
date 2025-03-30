const express = require("express");
const ytdl = require("ytdl-core");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ error: "No video URL provided" });
    }

    const info = await ytdl.getInfo(videoUrl);
    const formats = info.formats
      .filter((format) => format.hasVideo && format.hasAudio)
      .map((format) => ({
        quality: format.qualityLabel,
        format: format.container,
        url: format.url,
      }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      formats,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video info", details: error.message });
  }
});

module.exports = router;
