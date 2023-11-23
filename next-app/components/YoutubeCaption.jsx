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

        <div key={subtitle.start} id={subtitleId} className={`p-2 m-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-lg max-w-md `} onClick={() => injectChangeVideoTime(subtitle)}>
            {subtitle.text}
        </div>
    )
}
