import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import { useCeramicContext } from '../context';

export default function AddNote({ currentResourceId, setCurrentResourceId, currentTab, setOpenAddNote, youtubeId }) {
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

    function getNewResourceData({ youtubeId }) {
        let thumbnailImgSrc
        //if it's a youtube video, create a canvas img and return the data url. 
        if (!youtubeId) {
            //get a node list of all imgs
            const imgsArr = document.querySelectorAll('img')

            //return the first one that has an aspect ratio of 16/9
            for (const img of imgsArr) {
                if ((img.naturalWidth / img.naturalHeight) === 16 / 9) {
                    thumbnailImgSrc = img.src
                    break;
                }
            }

        } else {
            const videoElement = document.querySelector('.html5-main-video');
            let canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL()
            return { dataUrl: dataUrl }
        }
        return { thumbnailImgSrc: thumbnailImgSrc }
    }

    const createNewResource = async () => {
        if (!youtubeId) {
            youtubeId = ''
        }

        const result = await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: getNewResourceData,
            args: [youtubeId]
        })
        const clientMutationId = composeClient.id
        const resultObj = result[0].result
        // { dataUrl: dataUrl } or { thumbnailImgSrc: thumbnailImgSrc }
        let cid

        if (resultObj.dataUrl) {
            const canvasBlob = dataURLtoBlob(resultObj.dataUrl)
            let canvasForm = new FormData()
            const file = new File([canvasBlob], `image.jpg`, { type: 'image/jpeg' });
            canvasForm.set('canvasFile', file, 'screenshot.jpg')

            const res = await fetch('http://localhost:3000/api/uploadImage', {
                method: 'POST',
                body: canvasForm,
            })
            if (!res.ok) {
                throw new Error('Server responded with an error: ' + res.status);
            }
            const data = await res.json();
            console.log('data', data)
            cid = data.rootCid
        }

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
                cid: cid
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }
        const data = await res.json();
        //return data.newResourceObj.data.createIcarusResource.document.id

        return data
    }

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    const saveNote = async () => {

        //if no resource yet, create one first 
        if (!currentResourceId) {
            const newResourceObj = createNewResource();
            setCurrentResourceId(newResourceObj.newResourceObj.data.createIcarusResource.document.id)
        }
        console.log('created resource!')
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
