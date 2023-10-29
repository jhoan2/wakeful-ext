import React, { useEffect, useState } from 'react'

export default function YoutubeCaptions({ styles, currentTabId, subtitles }) {


    const startTime = (start) => {
        const video = document.querySelector('.html5-main-video');
        if (video) {
            video.currentTime = start;
        }
    }

    const executeCurrentTime = async (subtitle) => {
        const start = subtitle.start
        console.log(start)
        await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: startTime,
            args: [start]
        })
    }


    return (
        <div>
            {subtitles.map((subtitle) => {
                return <div key={subtitle.start} className={styles} onClick={() => executeCurrentTime(subtitle)}>
                    {subtitle.text}
                </div>
            })}
        </div>
    )
}
