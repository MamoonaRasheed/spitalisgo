import React, { useRef, useState, useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';

interface SafeHtmlParserProps {
    htmlString: string;
}

export default function SafeHtmlParser({ htmlString }: SafeHtmlParserProps) {
    // Play/pause handler for the custom play button
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);  // Track current time
    const [duration, setDuration] = useState(0);  // Track audio duration
    const [progress, setProgress] = useState(0);  // Track progress bar

    // Reference to the audio element
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Toggle play/pause
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        console.log(isPlaying, "isPlaying")
        setIsPlaying(!isPlaying);
        console.log(isPlaying, "isPlaying1")
    };

    // Update the progress bar based on the current time
    const updateProgress = () => {
        if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setCurrentTime(audioRef.current.currentTime);
            setProgress(progress);
        }
    };

    // Event listener for audio metadata to get the duration
    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const options = {
        replace: (domNode: any) => {
            if (domNode.name === 'audio' && domNode.attribs && domNode.attribs.src) {
                // If an audio element is already in the HTML, return it as is
                const rawSrc = domNode.attribs.src;
                const audioSrc = rawSrc.replace('%2F', '/');

                return (
                    <audio
                        ref={audioRef}
                        controls
                        src={audioSrc}
                        onTimeUpdate={updateProgress} // Update progress on time change
                        onLoadedMetadata={onLoadedMetadata} // Set duration when metadata is loaded
                        style={{ display: 'none' }}
                    >
                        {domToReact(domNode.children)}
                    </audio>
                );
            }

            if (domNode.name === 'source' && domNode.attribs && domNode.attribs.src) {
                const rawSrc = domNode.attribs.src;
                const audioSrc = rawSrc.replace('%2F', '/');
                return <source src={audioSrc} type={domNode.attribs.type || 'audio/mpeg'} />;
            }
        }
    };

    return (
        <>
            <div className="audio-player">
                <span className="play-btn" onClick={togglePlay}>
                    {/* Custom Play/Pause SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                        {isPlaying ? (
                            <>
                                <path d="M15 5.5V18.5C15 18.9647 15 19.197 15.0384 19.3902C15.1962 20.1836 15.816 20.8041 16.6094 20.9619C16.8026 21.0003 17.0349 21.0003 17.4996 21.0003C17.9642 21.0003 18.1974 21.0003 18.3906 20.9619C19.184 20.8041 19.8041 20.1836 19.9619 19.3902C20 19.1987 20 18.9687 20 18.5122V5.48777C20 5.03125 20 4.80087 19.9619 4.60938C19.8041 3.81599 19.1836 3.19624 18.3902 3.03843C18.197 3 17.9647 3 17.5 3C17.0353 3 16.8026 3 16.6094 3.03843C15.816 3.19624 15.1962 3.81599 15.0384 4.60938C15 4.80257 15 5.03534 15 5.5Z" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M4 5.5V18.5C4 18.9647 4 19.197 4.03843 19.3902C4.19624 20.1836 4.81599 20.8041 5.60938 20.9619C5.80257 21.0003 6.0349 21.0003 6.49956 21.0003C6.96421 21.0003 7.19743 21.0003 7.39062 20.9619C8.18401 20.8041 8.8041 20.1836 8.96191 19.3902C9 19.1987 9 18.9687 9 18.5122V5.48777C9 5.03125 9 4.80087 8.96191 4.60938C8.8041 3.81599 8.18356 3.19624 7.39018 3.03843C7.19698 3 6.96465 3 6.5 3C6.03535 3 5.80257 3 5.60938 3.03843C4.81599 3.19624 4.19624 3.81599 4.03843 4.60938C4 4.80257 4 5.03534 4 5.5Z" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </>
                        ) : (
                            <path d="M5 17.3336V6.66698C5 5.78742 5 5.34715 5.18509 5.08691C5.34664 4.85977 5.59564 4.71064 5.87207 4.67499C6.18868 4.63415 6.57701 4.84126 7.35254 5.25487L17.3525 10.5882L17.3562 10.5898C18.2132 11.0469 18.642 11.2756 18.7826 11.5803C18.9053 11.8462 18.9053 12.1531 18.7826 12.4189C18.6418 12.7241 18.212 12.9537 17.3525 13.4121L7.35254 18.7454C6.57645 19.1593 6.1888 19.3657 5.87207 19.3248C5.59564 19.2891 5.34664 19.1401 5.18509 18.9129C5 18.6527 5 18.2132 5 17.3336Z" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        )}


                    </svg>
                </span>
                <span className="time current-time">{formatTime(currentTime)}</span>
                <div className="progress-bar-container_a">
                    <div
                        className="progress-bar_a"
                        style={{ width: `${progress}%` }} // Set the progress width dynamically
                    ></div>
                </div>
                <span className="time duration">{formatTime(duration)}</span>
                <span className="mute-btn">
                    {/* Mute button SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.82 4.68652C19.8191 5.61821 20.6167 6.74472 21.1636 7.99657C21.7105 9.24842 21.9952 10.5991 21.9999 11.9652C22.0047 13.3313 21.7295 14.6838 21.1914 15.9395C20.6532 17.1951 19.8635 18.3272 18.8709 19.2658M16.092 7.61194C16.6915 8.17095 17.17 8.84686 17.4982 9.59797C17.8263 10.3491 17.9971 11.1595 18 11.9791C18.0028 12.7988 17.8377 13.6103 17.5148 14.3637C17.1919 15.1171 16.7181 15.7963 16.1225 16.3595M7.4803 15.4069L9.15553 17.48C10.0288 18.5607 10.4655 19.1011 10.848 19.1599C11.1792 19.2108 11.5138 19.0925 11.7394 18.8448C12 18.5586 12 17.8638 12 16.4744V7.52572C12 6.13627 12 5.44155 11.7394 5.15536C11.5138 4.90761 11.1792 4.78929 10.848 4.84021C10.4655 4.89904 10.0288 5.43939 9.15553 6.52009L7.4803 8.59319C7.30388 8.81151 7.21567 8.92067 7.10652 8.99922C7.00982 9.06881 6.90147 9.12056 6.78656 9.15204C6.65687 9.18756 6.51652 9.18756 6.23583 9.18756H4.8125C4.0563 9.18756 3.6782 9.18756 3.37264 9.2885C2.77131 9.48716 2.2996 9.95887 2.10094 10.5602C2 10.8658 2 11.2439 2 12.0001C2 12.7563 2 13.1344 2.10094 13.4399C2.2996 14.0413 2.77131 14.513 3.37264 14.7116C3.6782 14.8126 4.0563 14.8126 4.8125 14.8126H6.23583C6.51652 14.8126 6.65687 14.8126 6.78656 14.8481C6.90147 14.8796 7.00982 14.9313 7.10652 15.0009C7.21567 15.0794 7.30388 15.1886 7.4803 15.4069Z" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </span>
            </div>

            {/* Render parsed HTML content */}
            <div>
                {parse(htmlString, options)}
            </div>
        </>
    );
}

// Helper function to format time in mm:ss format
const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};
