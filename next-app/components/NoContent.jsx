import React from 'react'

export default function NoContent() {
    return (
        <div className='flex-grow flex justify-center items-center h-screen'>
            <div className='flex flex-col items-center'>
                <div className='rounded-full bg-gray-200 p-10 inline-flex justify-center items-center'>
                    <img src={'/next-assets/no-content-cat.png'} width={160} height={160} className="object-cover rounded-full" alt="No Content Cat Image" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-800">No content yet</p>
            </div>
        </div>
    )
}
