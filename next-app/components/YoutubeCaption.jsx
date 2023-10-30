import React from 'react'

export default function YoutubeCaption({ styles, subtitle, currentTime, currentTabId }) {
    const subtitleId = Math.floor(parseInt(subtitle.start))

    const changeVideoTime = (start) => {
        const video = document.querySelector('.html5-main-video');
        if (video) {
            video.currentTime = start;
        }
    }

    const injectChangeVideoTime = async (subtitle) => {
        const start = subtitle.start
        await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: changeVideoTime,
            args: [start]
        })
    }


    return (
        <div key={subtitle.start} id={subtitleId} className={styles} onClick={() => injectChangeVideoTime(subtitle)}>
            {subtitle.text}
        </div>
    )
}
