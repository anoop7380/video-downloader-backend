const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import API routes
const videoInfo = require("./api/video-info");
const download = require("./api/download");

app.use("/api/video-info", videoInfo);
app.use("/api/download", download);

app.get("/", (req, res) => {
  res.send("Video Downloader API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
