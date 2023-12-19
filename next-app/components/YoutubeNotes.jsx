import React from 'react'
import GetCards from './GetCards'

export default function YoutubeNotes({ currentTab }) {
    return (
        <div>
            <GetCards currentTab={currentTab} />
        </div>
    )
}
