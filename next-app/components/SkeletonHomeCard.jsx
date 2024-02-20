import React from 'react'

export default function SkeletonHomeCard() {
    return (
        <div className='flex-grow flex-row overflow-auto sm:justify-center'>
            <div className='flex flex-wrap sm:justify-center pb-2 justify-start md:pb-0 mx-auto p-4 animate-pulse'>
                <div className="m-3 flex flex-col bg-white border shadow-sm max-w-sm rounded-xl group hover:shadow-lg transition dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                    <div className="relative pt-[50%]  rounded-t-xl overflow-hidden bg-slate-400">
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div className="mt-1 w-72 h-8 bg-slate-400"></div>
                        <div>
                            <div className="mt-1 w-72 h-4 bg-slate-400"></div>
                            <div className="mt-1 w-72 h-4 bg-slate-400"></div>
                            <div className="mt-1 w-72 h-4 bg-slate-400"></div>
                            <div className="mt-1 w-60 h-4 bg-slate-400"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
