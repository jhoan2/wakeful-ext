import React from 'react'

export default function SkeletonYoutubeCaptions() {
    return (
        <div className={`p-2 m-2 border border-gray-300 rounded-lg max-w-md animate-pulse`}>
            <div className="mt-1 w-full h-4 bg-slate-400"></div>
            <div className="mt-1 w-full h-4 bg-slate-400"></div>
        </div>
    )
}
