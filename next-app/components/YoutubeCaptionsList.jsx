import React, { useState } from 'react'
import YoutubeCaption from './YoutubeCaption';

export default function YoutubeCaptionsList({ currentTabId, subtitles, currentTime }) {
    const [currentElementTime, setCurrentElementTime] = useState(0)

    if (currentElementTime !== currentTime) {
        const currentTimeString = Math.floor(currentTime).toString()
        let currentElement = document.getElementById(currentTimeString)
        if (currentElement) {
            currentElement.scrollIntoView({ behavior: "smooth", block: 'end' })
            setCurrentElementTime(currentTime)
        }
    }

    return (
        <div>
            {subtitles.map((subtitle) => {
                return <YoutubeCaption
                    key={subtitle.start}
                    subtitle={subtitle}
                    currentTime={currentTime}
                    currentTabId={currentTabId}
                />
            })}
        </div>
    )
}
