import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';

export default function AddNote({ currentResourceId, currentTabId, setOpenAddNote }) {
    const [noteContent, setNoteContent] = useState('')
    const date = new Date().toISOString()

    function getScrollY() {
        const scrollY = window.scrollY
        return scrollY
    }

    const getCurrentScrollPosition = async () => {
        const result = await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: getScrollY,
        })
        const scrollY = result[0].result
        scrollY = parseInt(scrollY)
        return scrollY
    }


    const ADD_NOTE = gql`
    mutation ADD_NOTE($input: CreateCardInput!) {
        createCard(input: $input) {
          document {
            id
          }
        }
      }`

    const [addNote, { data, loading, error }] = useMutation(ADD_NOTE, {
        variables: {
            input: {
                content: {
                    pageYOffset: async () => await getCurrentScrollPosition()
                }
            }
        },
        onCompleted: () => setOpenAddNote(false)
    });

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    const saveNote = async () => {
        const scrollY = await getCurrentScrollPosition()
        addNote({
            variables: {
                input: {
                    content: {
                        createdAt: date,
                        updatedAt: date,
                        resourceId: currentResourceId,
                        annotation: noteContent,
                        pageYOffset: scrollY
                    }
                }
            }
        })
        setNoteContent('')
        setOpenAddNote(false)
    }
    //if data would I then add the marker here? 

    return (
        <div className='flex flex-col pt-2'>
            <label>
                <textarea
                    placeholder='Add Note Here'
                    className='w-full h-12'
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                />
            </label>
            <div className='flex justify-end'>
                <button
                    onClick={() => saveNote()}
                    className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
                >
                    Save
                </button>
            </div>
        </div>
    )
}
