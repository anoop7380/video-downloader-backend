// api/download.js - Handle Video Downloading
async function downloadVideo(videoUrl) {
    if (!videoUrl) throw new Error("No URL provided");
    return videoUrl; // Redirects to actual video link
}

module.exports = { downloadVideo };
