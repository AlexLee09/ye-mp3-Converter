require('dotenv').config()

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');



const PORT = process.env.PORT; 

app.post('/song/convert', async (req, res) => {
    try {
        const url = req.body.url;
        console.log("sss")

        const fs = require('fs');
        const ytdl = require('ytdl-core');
        const ffmpeg = require('fluent-ffmpeg');
        const https = require('https');
        // console.log(ytdl.validateURL(url))

       
          
          // Replace 'YOUR_VIDEO_URL' with your YouTube video URL
          

        if (ytdl.validateURL(url) === true){
            const output = 'audio.mp3';
            downloadThumbnail(url);

            ffmpeg(ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }))
                .audioCodec('libmp3lame') // Set MP3 codec
                .toFormat('mp3')          // Convert to MP3
                .on('end', () => {
                    console.log('File has been converted.');
                })
                .on('error', (err) => {
                    console.error('An error occurred: ' + err.message);
                    res.status(400).send({ status: "ERROR", error: err.message });
                })
                .saveToFile(output);
            res.status(200).json({ status: "SUCCESS", message: "Working" });

            function downloadThumbnail(videoUrl) {
  ytdl.getInfo(videoUrl).then(info => {
    const thumbnailUrl = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url; // Get the highest quality thumbnail
    const file = fs.createWriteStream("thumbnail.jpg"); // Adjust the file type based on the URL if needed

    https.get(thumbnailUrl, function(response) {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log('Downloaded thumbnail successfully!');
      });
    }).on('error', (err) => {
      fs.unlink('thumbnail.jpg'); // Delete the file async on error
      console.error('Error downloading thumbnail:', err.message);
    });
  });
}

// Replace 'YOUR_VIDEO_URL' with your YouTube video URL

        }
        else {
            // alert("Error")
            res.status (400).json({ status: "ERROR", message: "Invalid url" })
        }
    }
    catch (error) {
        res.status(500).json({ status: "ERROR", message: "Server error" })
    }
})

app.get('/stream', (req, res) => {
    const filePath = path.join(__dirname, 'audio.mp3');
    res.sendFile(filePath);
});

app.get('/thumbnail', (req, res) => {
    const filePath = path.join(__dirname, 'thumbnail.jpg');
    res.sendFile(filePath)
})


app.listen(PORT, () => // fire up express server
{
    console.log ("LISTENING ON PORT " + PORT);
}); 