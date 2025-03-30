const express = require("express");
const ytdl = require("ytdl-core");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ error: "No video URL provided" });
    }

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(videoUrl, { filter: "audioandvideo", quality: "highest" }).pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to process download", details: error.message });
  }
});

module.exports = router;
