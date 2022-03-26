const express = require('express');
const fs = require('fs');
const app = express();

app.get('/video', (req, res) => {
    const range = req.headers.range;

    //Attrributes of the video
    const videoPath = './Rexy_Sample.mp4';
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 10 ** 6; // 1 MB
    const start = Number(range.replace(/\D/g, ''));//Finding the position in the video
    const end = Math.min(start + chunkSize, videoSize -1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    
    res.writeHead(206, headers);

    // Read stream for this chuck of video
    const Stream = fs.createReadStream(videoPath, {start, end})
    // Streaming video chunk to client
    Stream.pipe(res);
});

app.listen('2000');