import React from 'react'

export default function BookCardSkeleton() {
    return (
        <div className='space-y-4 p-6 max-w-md mx-auto'>
            <div
                className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm animate-pulse'
            >
                <div className='h-24 w-40 bg-slate-400'></div>
                <div className='flex flex-col space-y-2'>
                    <div className="mt-1 w-44 h-8 bg-slate-400"></div>
                    <div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                    </div>
                </div>
            </div>
            <div
                className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm animate-pulse'
            >
                <div className='h-24 w-40 bg-slate-400'></div>
                <div className='flex flex-col space-y-2'>
                    <div className="mt-1 w-44 h-8 bg-slate-400"></div>
                    <div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                    </div>
                </div>
            </div>
            <div
                className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm animate-pulse'
            >
                <div className='h-24 w-40 bg-slate-400'></div>
                <div className='flex flex-col space-y-2'>
                    <div className="mt-1 w-44 h-8 bg-slate-400"></div>
                    <div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                    </div>
                </div>
            </div>
            <div
                className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm animate-pulse'
            >
                <div className='h-24 w-40 bg-slate-400'></div>
                <div className='flex flex-col space-y-2'>
                    <div className="mt-1 w-44 h-8 bg-slate-400"></div>
                    <div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                        <div className="mt-1 w-32 h-4 bg-slate-400"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
