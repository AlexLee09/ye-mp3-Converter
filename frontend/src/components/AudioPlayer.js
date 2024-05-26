import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import classes from './AudioPlayer.module.css'
import * as FaIcons from "react-icons/fa"; 

const AudioPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const thumbnailRef = useRef(null)

    const handleSliderChange = (event) => {
        const newValue = parseFloat(event.target.value);
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
    };


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle play/pause
    const togglePlayPause = () => {
        const prevValue = playing;
        setPlaying(!prevValue);
        if (!prevValue) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };


    // Update time
    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <div>
                <audio ref={audioRef} onEnded={() => setPlaying(false)}>
                    <source src="/stream" type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
                <img ref={thumbnailRef} src="/thumbnail" alt="Thumbnail" />
               
            
                <div>
                    {/* <button onClick={togglePlayPause}>{playing ? '❚❚' : '▶'}</button> */}
                    <div onClick = {togglePlayPause}>
                        { !playing && <FaIcons.FaPlayCircle className = {classes.icons}></FaIcons.FaPlayCircle> }
                        { playing &&   <FaIcons.FaPauseCircle className = {classes.icons}></FaIcons.FaPauseCircle> }
                    </div>
                    <FaIcons.FaStepBackward className = {classes.icons} onClick={() => audioRef.current.currentTime = 0}></FaIcons.FaStepBackward>
                    <FaIcons.FaStepForward className = {classes.icons} onClick={() => audioRef.current.currentTime = audioRef.current.duration}></FaIcons.FaStepForward>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.01"
                        value={currentTime}
                        onChange={handleSliderChange}>               
                    </input>
                    <div className={classes.timeDisplay}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AudioPlayer;
