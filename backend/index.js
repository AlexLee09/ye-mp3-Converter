require('dotenv').config()

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT; 

app.post('/song/convert', async (req, res) => {
    try {
        const url = req.body.url;
        console.log("sss")

        const fs = require('fs');
        const ytdl = require('ytdl-core');
        const ffmpeg = require('fluent-ffmpeg');

        const output = 'audio.mp3';

        ffmpeg(ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }))
            .audioCodec('libmp3lame') // Set MP3 codec
            .toFormat('mp3')          // Convert to MP3
            .on('end', () => {
                console.log('File has been converted.');
            })
            .on('error', (err) => {
                console.error('An error occurred: ' + err.message);
            })
            .saveToFile(output);
        res.status(200).json({message: "Working"});
                }
    catch (error) {
        res.status(500).json({ message: "Server error" })
     }
})




app.listen(PORT, () => // fire up express server
{
    console.log ("LISTENING ON PORT " + PORT);
}); 