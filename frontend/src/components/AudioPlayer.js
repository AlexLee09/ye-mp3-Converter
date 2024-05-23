import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

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

    // Load and play the file when it changes
    useEffect(() => {
        const events = new EventSource('http://localhost:3001/stream');
        events.onmessage = (event) => {
            if (event.data === 'update') {
                audioRef.current.load();
                audioRef.current.play();
                setPlaying(true);
            }
        };
        return () => events.close();
    }, []);

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
        <div>
            <audio ref={audioRef} onEnded={() => setPlaying(false)}>
                <source src="http://localhost:3000/stream" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
            <div>
                <button onClick={togglePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={() => audioRef.current.currentTime = 0}>Start</button>
                <button onClick={() => audioRef.current.currentTime = audioRef.current.duration}>End</button>
                <progress value={currentTime} max={duration}></progress>
                <span>{Math.floor(currentTime)} / {Math.floor(duration)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;
