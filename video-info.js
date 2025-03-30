// api/video-info.js - Fetch Video Information
const ytdl = require("ytdl-core");

async function getVideoInfo(videoUrl) {
    if (!ytdl.validateURL(videoUrl)) {
        throw new Error("Invalid video URL");
    }

    const info = await ytdl.getInfo(videoUrl);
    const formats = info.formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
            quality: format.qualityLabel || "Unknown",
            size: format.contentLength ? (format.contentLength / (1024 * 1024)).toFixed(2) : "N/A", // Convert to MB
            url: format.url,
        }));

    return {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop().url,
        duration: info.videoDetails.lengthSeconds,
        views: info.videoDetails.viewCount,
        formats,
    };
}

module.exports = { getVideoInfo };
