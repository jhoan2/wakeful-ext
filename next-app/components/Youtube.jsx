import React, { useState, useEffect } from 'react'
import YoutubeCaptions from './YoutubeCaptions';
import YoutubeNotes from './YoutubeNotes';
import { getVideoDetails } from 'youtube-caption-extractor';

export default function YoutubeAnnotations({ currentTab, youtubeId }) {
    const [showNotes, setShowNotes] = useState(false)
    const currentTabId = currentTab.id
    const [styles, setStyles] = useState('p-2 m-2 border border-gray-300 rounded-lg hover:bg-gray-100')
    const videoID = youtubeId;
    const lang = 'en'; // Optional, default is 'en' (English)
    const [subtitles, setSubtitles] = useState([
        {
            "start": "1.079",
            "dur": "5.7",
            "text": "so uh let's try to Define some more"
        },
        {
            "start": "3.84",
            "dur": "5.04",
            "text": "terms um in in the way I typically"
        },
        {
            "start": "6.779",
            "dur": "3.961",
            "text": "disassemble things I treat the mind as"
        }
    ]);
    const [description, setDescription] = useState("&quot;Joscha Bach Bits&quot; features short videos of Joscha Bach&#39;s ideas, opinions, and perspectives on various topics, edited from interviews. #JoschaBachBits #Philo...")

    const fetchVideoDetails = async (videoID, lang = 'en') => {
        console.log('video')
        // try {
        //     const videoDetails = await getVideoDetails({ videoID, lang });
        //     if (videoDetails) {
        //         setDescription(videoDetails.description)
        //         setSubtitles(videoDetails.subtitles)
        //     }
        // } catch (error) {
        //     console.error('Error fetching video details:', error);
        // }
    };


    // const changeStyles = () => {
    //     setStyles(styles + " font-mono")
    // }


    // function syncVideo() {
    //     const video = document.querySelector('.html5-main-video');
    //     if (video) {
    //         const videoTime = video.currentTime;
    //         return videoTime
    //     }
    // }

    // const injectScript = (currentTabId) => {
    //     console.log(currentTabId)
    //     setInterval(async () => {
    //         const result = await chrome.scripting.executeScript({
    //             target: { tabId: currentTabId },
    //             func: syncVideo,
    //         })
    //         console.log(result[0].result)
    //         //now I have the time in the chrome browser 
    //         //problem was that I was console logging the time in the browser and not the extension
    //         //need to think about how to stop the timer and scroll to position. 
    //     }, 3000);

    // }

    // const getScreenshotYoutube = async () => {
    //     const { id, url } = currentTab
    //     if (url.indexOf("youtube.com/watch?v=") === -1) {
    //         console.log('Not a youtube video')
    //         return
    //     }

    //     try {
    //         const screenshot = await chrome.scripting.executeScript({
    //             target: { tabId: id },
    //             func: capture,
    //         });
    //         const canvasImageData = screenshot[0].result

    //         // Create a new blob from the canvas image data.
    //         const blob = new Blob([canvasImageData], { type: "image/png" });
    //         const url = URL.createObjectURL(blob)

    //         const image = new Image();
    //         image.src = canvasImageData;
    //         document.body.appendChild(image);


    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    useEffect(() => {
        fetchVideoDetails(videoID, lang);
    }, [])


    return (
        <div id='subtitle-container'>
            <button onClick={() => injectScript(currentTabId)}>Sync Video</button>
            <button onClick={() => changeStyles()}>Add styles</button>
            <button onClick={() => setShowNotes(!showNotes)}>{showNotes ? 'Captions' : 'Notes'}</button>
            {showNotes ? <YoutubeNotes /> : <YoutubeCaptions subtitles={subtitles} styles={styles} currentTabId={currentTab.id} />}
        </div>
    )
}
