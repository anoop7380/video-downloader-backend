const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/download", (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: "Missing video URL parameter" });
    }

    // Convert YouTube URL to ssyoutube format
    const modifiedUrl = videoUrl.replace("youtube.com", "ssyoutube.com").replace("youtu.be", "ssyoutube.com");

    // Redirect user to ssyoutube.com
    res.redirect(modifiedUrl);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
