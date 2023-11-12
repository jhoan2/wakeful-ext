import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import { useCeramicContext } from '../context';

export default function YoutubeAddNote({ currentTab, youtubeId, currentResourceId, setCurrentResourceId, getScreenshotYoutube, setYoutubeOpenAddNote }) {
    const [noteContent, setNoteContent] = useState('')
    const clients = useCeramicContext()
    const { composeClient } = clients
    const currentTabId = currentTab.id

    const createNewYoutubeResource = async () => {
        const youtubeObj = await getScreenshotYoutube()
        //youtubeObj = { cid: rootCid }
        const { cid } = youtubeObj
        const clientMutationId = composeClient.id
        const date = new Date().toISOString()

        const res = await fetch('http://localhost:3000/api/createNewYoutubeResource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientMutationId: clientMutationId,
                url: currentTab.url,
                title: currentTab.title,
                createdAt: date,
                updatedAt: date,
                cid: cid
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }
        const data = await res.json();
        return data.newResourceId.data.createIcarusResource.document.id
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
        onCompleted: () => setYoutubeOpenAddNote(false)
    });

    const saveNote = async () => {
        let newYoutubeResourceId = currentResourceId
        if (!currentResourceId) {
            newYoutubeResourceId = await createNewYoutubeResource()
            setCurrentResourceId(newYoutubeResourceId)
        }

        addNote({
            variables: {
                input: {
                    content: {
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        resourceId: newYoutubeResourceId,
                        annotation: noteContent,
                    }
                }
            }
        })
        setNoteContent('')
    }

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

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
