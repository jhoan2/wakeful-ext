import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import { useCeramicContext } from '../context';

export default function AddNote({ currentResourceId, setCurrentResourceId, currentTab, setOpenAddNote }) {
    const [noteContent, setNoteContent] = useState('')
    const clients = useCeramicContext()
    const { composeClient } = clients
    const currentTabId = currentTab.id
    const date = new Date().toISOString()

    const ADD_NOTE = gql`
    mutation ADD_NOTE($input: CreateCardInput!) {
        createCard(input: $input) {
          document {
            id
          }
        }
      }`
    const [addNote, { data, loading, error }] = useMutation(ADD_NOTE, {
        onCompleted: () => setOpenAddNote(false)
    });

    function getScrollY() {
        const scrollY = window.scrollY
        return { scrollY: scrollY }
    }

    const getContent = async () => {

        const result = await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: getScrollY,
        })

        const contentObj = result[0].result
        contentObj.scrollY = parseInt(contentObj.scrollY)
        console.log('got scroll y')
        return contentObj
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    function getNewResourceData() {
        let thumbnailImgSrc
        const imgsArr = document.querySelectorAll('img')
        for (const img of imgsArr) {
            if ((img.naturalWidth / img.naturalHeight) === 16 / 9) {
                thumbnailImgSrc = img.src
                break;
            }
        }

        if (!thumbnailImgSrc) {
            let nodeList = document.querySelectorAll('meta[property="og:image"]');
            thumbnailImgSrc = nodeList[0].content
        }

        return { thumbnailImgSrc: thumbnailImgSrc }
    }

    const createNewResource = async () => {
        const result = await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: getNewResourceData,
        })
        const clientMutationId = composeClient.id
        const resultObj = result[0].result
        // { thumbnailImgSrc: thumbnailImgSrc }

        const res = await fetch('http://localhost:3000/api/createNewResource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imgUrl: resultObj.thumbnailImgSrc,
                clientMutationId: clientMutationId,
                url: currentTab.url,
                title: currentTab.title,
                createdAt: date,
                updatedAt: date,
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }
        const data = await res.json();
        return data.newResourceId.data.createIcarusResource.document.id
    }

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    const saveNote = async () => {
        let newArticleResourceId = currentResourceId

        //if no resource yet, create one first 
        if (!currentResourceId) {
            newArticleResourceId = await createNewResource();
            setCurrentResourceId(newArticleResourceId)
        }

        //change the name of this and return an object that you destructure and put into the input. 
        const contentObj = await getContent();
        const scrollY = contentObj.scrollY;
        //if this exists do something like updating the currentResourceId and passing it into the following input object. 

        addNote({
            variables: {
                input: {
                    content: {
                        createdAt: date,
                        updatedAt: date,
                        resourceId: newArticleResourceId,
                        annotation: noteContent,
                        pageYOffset: scrollY
                    }
                }
            }
        })
        setNoteContent('')
        setOpenAddNote(false)
    }

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
