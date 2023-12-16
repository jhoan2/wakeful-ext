import React from 'react'

export default function CardImage({ cid }) {


    // if (!cid) return

    return (
        <div>
            <img
                src={'https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/QmdCF1CxkKJKN31H9SpeyjV51ZNNmxXfREsR154ZFod78g?img-width=240'}
                alt="Image"
                loading='lazy'
            />
        </div>

    )
}
