import React from 'react'

export default function SkeletonCard() {
    return (
        <div className='space-y-2 max-w-md'>
            <div className='border-2 rounded relative p-6 animate-pulse'>
                <button className='absolute top-0 right-1 text-slate-300 bg-slate-400 rounded-md p-1'>
                    X
                </button>
                <button className='absolute bottom-0 left-1 bg-slate-400 rounded-md p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-300"><path d="M12.9999 16.1716L18.3638 10.8076L19.778 12.2218L11.9999 20L4.22168 12.2218L5.63589 10.8076L10.9999 16.1716V4H12.9999V16.1716Z"></path></svg>
                </button>
                <div className='italic border rounded p-2 bg-slate-400'></div>
                <div className='italic border rounded p-2 bg-slate-400'></div>
                <div className='italic border rounded p-2 bg-slate-400'></div>
            </div>
            <div className='border-2 rounded relative p-6 animate-pulse'>
                <button className='absolute top-0 right-1 text-slate-300 bg-slate-400 rounded-md p-1'>
                    X
                </button>
                <button className='absolute bottom-0 left-1 bg-slate-400 rounded-md p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-300"><path d="M12.9999 16.1716L18.3638 10.8076L19.778 12.2218L11.9999 20L4.22168 12.2218L5.63589 10.8076L10.9999 16.1716V4H12.9999V16.1716Z"></path></svg>
                </button>
                <div className='italic border rounded p-2 bg-slate-400'></div>
                <div className='italic border rounded p-2 bg-slate-400'></div>
                <div className='italic border rounded p-2 bg-slate-400'></div>
            </div>
        </div>
    )
}
