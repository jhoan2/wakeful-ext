import React from 'react';

export default function ErrorPage({ message }) {

    return (
        <div className='flex h-screen'>
            <div className='flex-grow flex justify-center items-center'>
                <div className='flex flex-col items-center'>
                    <div className='rounded-full bg-gray-200 p-10 inline-flex justify-center items-center'>
                        <img src={'/next-assets/error-blue-cat.png'} width={160} height={160} className="object-cover rounded-full" alt="Error blue cat image" />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-gray-800">{message}</p>
                </div>
            </div>
        </div>
    )
}
