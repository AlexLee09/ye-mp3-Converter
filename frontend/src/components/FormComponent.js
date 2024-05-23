import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './FormComponent.module.css';
import AudioPlayer from './AudioPlayer';

function FormComponent () {

    const [url, setUrl] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            url: url
        }

        const response = await fetch("/song/convert",
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        })

        const data = await response.json();

        if (data.status === "ERROR")
        {
            alert (data.message); 
        }

    }

    return(
        <div className = {classes.container}>
            <h1>Youtube-mp3 converter</h1> 
            <form className = {classes.inputForm} onSubmit={handleSubmit}>
                <input className = {classes.urlInput} onChange = {(e) => setUrl(e.target.value)}></input>
                <button type = 'submit'>Convert</button>
            </form>

            {/* <audio controls>
                <source src="http://localhost:3001/stream" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio> */}

            <AudioPlayer />
        </div>
    )
}

export default FormComponent