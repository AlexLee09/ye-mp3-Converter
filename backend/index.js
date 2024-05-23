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
        // console.log(ytdl.validateURL(url))
        if (ytdl.validateURL(url) === true){
            const output = 'audio.mp3';
        

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




app.listen(PORT, () => // fire up express server
{
    console.log ("LISTENING ON PORT " + PORT);
}); 