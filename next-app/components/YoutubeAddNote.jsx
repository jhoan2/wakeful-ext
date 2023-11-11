import React from 'react'

export default function YoutubeAddNote() {
    return (
        <div className='flex flex-col pt-2'>
            <label>
                <textarea
                    placeholder='Add Note Here'
                    className='w-full h-12'
                // value={noteContent}
                // onChange={e => setNoteContent(e.target.value)}
                />
            </label>
            <div className='flex justify-end'>
                <button
                    // onClick={() => saveNote()}
                    className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
                >
                    Save
                </button>
            </div>
        </div>
    )
}
