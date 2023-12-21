import React, { useState, useEffect } from 'react'
import YoutubeCaptionsList from './YoutubeCaptionsList';
import YoutubeNotes from './YoutubeNotes';
import YoutubeAddNote from './YoutubeAddNote';
import { getVideoDetails } from 'youtube-caption-extractor';
import { useCeramicContext } from '../context';
import { gql, useMutation } from '@apollo/client';
import SkeletonYoutubeCaptions from './SkeletonYoutubeCaptions';

export default function YoutubeAnnotations({ currentTab, youtubeId, currentResourceId, setCurrentResourceId, loggedIn, setLoggedIn }) {
    const [showNotes, setShowNotes] = useState(false)
    const [openYoutubeAddNote, setYoutubeOpenAddNote] = useState(false)
    const currentTabId = currentTab.id
    const [intervalId, setIntervalId] = useState('')
    const [currentTime, setCurrentTime] = useState('')
    const [loadingCaptions, setLoadingCaptions] = useState(false)
    const clients = useCeramicContext()
    const { composeClient } = clients
    const videoID = youtubeId;
    const lang = 'en'; // Optional, default is 'en' (English)
    const [subtitles, setSubtitles] = useState([]);

    const fetchVideoDetails = async (videoID, lang = 'en') => {
        try {
            setLoadingCaptions(true)
            const videoDetails = await getVideoDetails({ videoID, lang });
            if (videoDetails) {
                setSubtitles(videoDetails.subtitles)
            }
            setLoadingCaptions(false)
        } catch (error) {
            setLoadingCaptions(false)
            console.error('Error fetching video details:', error);
        }
    };

    const refresh = () => {
        window.location.reload();
    }

    function syncVideo() {
        const video = document.querySelector('.html5-main-video');
        if (video) {
            const videoTime = video.currentTime;
            return videoTime
        }
    }

    const injectSyncVideo = (currentTabId) => {
        const newIntervalId = setInterval(async () => {
            const result = await chrome.scripting.executeScript({
                target: { tabId: currentTabId },
                func: syncVideo,
            })
            setCurrentTime(result[0].result)
            //Even when the video is paused this is still being called
        }, 1000);
        setIntervalId(newIntervalId)
    }


    function capture() {
        const videoElement = document.querySelector('.html5-main-video');
        const videoTime = videoElement.currentTime;
        if (!videoElement) {
            console.log('no video found')
            return
        }
        let canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg")
        return { dataUrl: dataUrl, videoTime: videoTime }
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const getScreenshotYoutube = async () => {
        const { id, url } = currentTab
        if (url.indexOf("youtube.com/watch?v=") === -1) {
            console.log('Not a youtube video')
            return
        }

        try {
            const screenshot = await chrome.scripting.executeScript({
                target: { tabId: id },
                func: capture,
            });

            const canvasDataUrl = screenshot[0].result.dataUrl
            const canvasVideoTime = screenshot[0].result.videoTime

            const canvasBlob = dataURLtoBlob(canvasDataUrl)

            let formData = new FormData()
            const file = new File([canvasBlob], `image.jpg`, { type: 'image/jpeg' });
            formData.set('file', file)

            const res = await fetch('http://localhost:3000/api/cardImage', {
                method: 'POST',
                body: formData,
            })
            if (!res.ok) {
                throw new Error('Server responded with an error: ' + res.status);
            }
            const data = await res.json();
            const { pinataData } = data
            return { videoTime: canvasVideoTime, pinataData: pinataData }
        } catch (error) {
            console.error(error);
        }
    }

    const createNewYoutubeResource = async () => {
        const youtubeObj = await getScreenshotYoutube()
        //youtubeObj = { cid: rootCid }
        const cid = youtubeObj.pinataData.IpfsHash
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
                cid: cid,
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }
        const data = await res.json();
        return data.newResourceId.data.createIdealiteResource.document.id
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
        // onCompleted: () => setOpenAddNote(false)
        refetchQueries: ['getCardsPeUrlPerUser'],
    });

    const addScreenshotNote = async () => {
        let newYoutubeResourceId = currentResourceId
        if (!currentResourceId) {
            newYoutubeResourceId = await createNewYoutubeResource()
            setCurrentResourceId(newYoutubeResourceId)
        }

        const screenshotObj = await getScreenshotYoutube()
        const { videoTime } = screenshotObj
        const videoTimeString = videoTime.toString()
        const cid = screenshotObj.pinataData.IpfsHash
        const pinSize = screenshotObj.pinataData.PinSize

        addNote({
            variables: {
                input: {
                    content: {
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        resourceId: newYoutubeResourceId,
                        cid: cid,
                        videoTime: videoTimeString,
                        pinSize: pinSize,
                        url: currentTab.url,
                        deleted: false,
                    }
                }
            }
        })
    }

    const showNotesPanel = () => {
        if (showNotes) {
            injectSyncVideo(currentTabId)
        } else {
            clearInterval(intervalId)
        }
        setShowNotes(!showNotes)

    }

    useEffect(() => {
        fetchVideoDetails(videoID, lang);
        injectSyncVideo(currentTabId);
    }, [])

    if (error) return `Submission error! ${error.message}`;

    return (
        <div id='subtitle-container' >
            <div id='youtube-panel-menu' className='flex justify-center my-5'>
                <div className='fixed top-0'>
                    <button type="button" title='Change Panel' onClick={() => showNotesPanel()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        {showNotes ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H20.0049ZM8 4H6V20H8V4ZM20 4H10V20H20V4Z"></path></svg>
                        }
                    </button>
                    <button type="button" title='Add Note' onClick={() => setYoutubeOpenAddNote(!openYoutubeAddNote)} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z"></path></svg>
                    </button>
                    <button type="button" title='Youtube Screenshot' onClick={() => addScreenshotNote()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'>
                            <path d="M9.82843 5L7.82843 7H4V19H20V7H16.1716L14.1716 5H9.82843ZM9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7L9 3ZM12 18C8.96243 18 6.5 15.5376 6.5 12.5C6.5 9.46243 8.96243 7 12 7C15.0376 7 17.5 9.46243 17.5 12.5C17.5 15.5376 15.0376 18 12 18ZM12 16C13.933 16 15.5 14.433 15.5 12.5C15.5 10.567 13.933 9 12 9C10.067 9 8.5 10.567 8.5 12.5C8.5 14.433 10.067 16 12 16Z"></path>
                        </svg>
                    </button>
                    <button type="button" title='Refresh' onClick={() => refresh()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path></svg>
                    </button>
                    <button type="button" title='Profile Page' onClick={() => setLoggedIn(!loggedIn)} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                    </button>
                </div>
            </div>
            {openYoutubeAddNote ?
                <div className='border-2 rounded fixed p-6 w-full bg-gray-100 z-10'>
                    <YoutubeAddNote
                        currentTab={currentTab}
                        youtubeId={youtubeId}
                        currentResourceId={currentResourceId}
                        setCurrentResourceId={setCurrentResourceId}
                        createNewYoutubeResource={createNewYoutubeResource}
                        setYoutubeOpenAddNote={setYoutubeOpenAddNote} />
                </div>
                : null
            }
            <div id='youtube-panel-content'>
                {
                    !showNotes ? (
                        loadingCaptions ? (
                            <div>
                                <SkeletonYoutubeCaptions />
                                <SkeletonYoutubeCaptions />
                                <SkeletonYoutubeCaptions />
                                <SkeletonYoutubeCaptions />
                                <SkeletonYoutubeCaptions />
                                <SkeletonYoutubeCaptions />
                            </div>
                        ) : (
                            <YoutubeCaptionsList
                                subtitles={subtitles}
                                currentTabId={currentTab.id}
                                currentTime={currentTime}
                            />
                        )
                    ) : (
                        <YoutubeNotes
                            currentTab={currentTab}
                        />
                    )}
            </div>
        </div>
    )
}
