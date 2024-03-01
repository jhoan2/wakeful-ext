import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import EditorBubbleMenu from './EditorBubbleMenu';
import StarterKit from '@tiptap/starter-kit';
import CardImage from './CardImage';
import CardActionsButton from './CardActionsButton';

export default function Card({ content, currentTab }) {
    const { id, quote, annotation, pageYOffset, scrollHeight, cid, googleBooksPage } = content.node
    const currentTabId = currentTab.id
    const currentUrl = currentTab.url
    const [inputImage, setInputImage] = useState(false)
    const [uploadImage, setUploadImage] = useState(null)
    const [showSubmit, setShowSubmit] = useState(false)


    const UPDATE_NOTE = gql`
    mutation UPDATE_NOTE($input: UpdateIdealiteCardsInput!) {
        updateIdealiteCards(input: $input) {
          document {
            id
            annotation
          }
        }
      }`

    const [sendUpdateNote, { data, loading, error }] = useMutation(UPDATE_NOTE, {
        refetchQueries: ['getCardsPeUrlPerUser'],
    });

    const updateNote = async () => {
        const content = editor.getHTML()
        let IpfsHash, PinSize;

        if (uploadImage) {
            const data = await pinFileToIPFS(uploadImage);
            IpfsHash = data?.IpfsHash;
            PinSize = data?.PinSize;
        }

        let noteContent = {
            updatedAt: new Date().toISOString(),
            annotation: content,
            cid: IpfsHash,
            mimeType: uploadImage?.type,
            pinSize: PinSize,
        }

        for (const key in noteContent) {
            if (noteContent[key] === undefined || noteContent[key] === null) {
                delete noteContent[key];
            }
        }

        await sendUpdateNote({
            variables: {
                input: {
                    id: id,
                    content: noteContent
                }
            }
        })
    }

    function scrollTo(pageYOffset, scrollHeight) {
        const browserScrollY = document.body.scrollHeight
        if (scrollHeight !== browserScrollY) {
            const newPageYOffset = pageYOffset / scrollHeight * browserScrollY - 20
            window.scrollTo(0, newPageYOffset)
        } else {
            //subtracting 20 to give the scroll to some space to look cleaner 
            pageYOffset = pageYOffset - 20
            window.scrollTo(0, pageYOffset)
        }
    }

    const executeScrollTo = async () => {
        await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: scrollTo,
            args: [pageYOffset, scrollHeight]
        })
    }

    const handlePaste = (event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData || !clipboardData.items.length) return;

        const item = clipboardData.items[0];
        if (!item.type.startsWith('image/')) {
            const inputElement = document.getElementById('paste-image');
            inputElement.value = '';
            return;
        };

        const file = item.getAsFile();
        setUploadImage(file);
        const inputElement = document.getElementById('input-image');
        inputElement.disabled = true;
    }

    const pinFileToIPFS = async (file) => {
        const formData = new FormData();
        formData.set('file', file)

        try {
            const res = await fetch("http://localhost:3000/api/cardImage", {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const { pinataData } = data;
            return pinataData;
        } catch (error) {
            console.log(error);
        }
    }

    const handleUploadImage = (image) => {
        setUploadImage(image)
        setShowSubmit(true)
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-md lg:prose-lg dark:prose-invert hover:outline outline-amber-400 max-w-full outline-offset-2 outline-2 rounded-md',
            },
        },
        content: annotation,
        onUpdate: ({ editor }) => {
            setShowSubmit(true)
        }
    })

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    if (!quote && !annotation && !cid) return null

    return (
        <div className='border-2 rounded relative p-6'>
            <CardActionsButton id={id} />
            {quote ?
                <p className='italic border rounded p-2 hover:bg-gray-100' onClick={() => executeScrollTo()}>
                    {quote}
                </p> :
                null
            }
            {cid ?
                <div className='mb-4'>
                    <CardImage cid={cid} />
                </div>

                : null
            }
            {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} >
                <EditorBubbleMenu editor={editor} />
            </BubbleMenu>}
            <EditorContent editor={editor} className={`${inputImage ? 'hidden' : ''}`} />
            {uploadImage && (
                <img src={URL.createObjectURL(uploadImage)} alt="Pasted Image" />
            )}
            {inputImage ?
                <input onPaste={handlePaste} id='paste-image' className={`${uploadImage && 'hidden'} placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm`} placeholder="Paste image here" type="text" name="Paste Image" autoComplete='off' />
                :
                null
            }
            <div className='flex mt-3 justify-between items-center'>
                <input
                    type='file'
                    id='input-image'
                    onChange={(event) => handleUploadImage(event.target.files[0])}
                    className={`${inputImage ? '' : 'invisible'} file:py-2 file:px-3 file:inline-flex file:items-center file:gap-x-2 file:text-sm file:font-semibold file:rounded-lg file:border file:border-transparent file:bg-blue-100 file:text-blue-800 file:hover:bg-blue-200 file:disabled:opacity-50 file:disabled:pointer-events-none file:dark:hover:bg-blue-900 file:dark:text-blue-400 file:dark:focus:outline-none file:dark:focus:ring-1 file:dark:focus:ring-gray-600`} />
                <div className='flex space-x-3'>
                    {!cid ?
                        <button onClick={() => setInputImage(!inputImage)} className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' title='Add an image'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                        </button> :
                        null
                    }
                    {showSubmit || uploadImage ?
                        <button title='Submit Note' onClick={() => updateNote()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            {loading ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3 animate-spin'><path d="M11.9995 2C12.5518 2 12.9995 2.44772 12.9995 3V6C12.9995 6.55228 12.5518 7 11.9995 7C11.4472 7 10.9995 6.55228 10.9995 6V3C10.9995 2.44772 11.4472 2 11.9995 2ZM11.9995 17C12.5518 17 12.9995 17.4477 12.9995 18V21C12.9995 21.5523 12.5518 22 11.9995 22C11.4472 22 10.9995 21.5523 10.9995 21V18C10.9995 17.4477 11.4472 17 11.9995 17ZM20.6597 7C20.9359 7.47829 20.772 8.08988 20.2937 8.36602L17.6956 9.86602C17.2173 10.1422 16.6057 9.97829 16.3296 9.5C16.0535 9.02171 16.2173 8.41012 16.6956 8.13398L19.2937 6.63397C19.772 6.35783 20.3836 6.52171 20.6597 7ZM7.66935 14.5C7.94549 14.9783 7.78161 15.5899 7.30332 15.866L4.70525 17.366C4.22695 17.6422 3.61536 17.4783 3.33922 17C3.06308 16.5217 3.22695 15.9101 3.70525 15.634L6.30332 14.134C6.78161 13.8578 7.3932 14.0217 7.66935 14.5ZM20.6597 17C20.3836 17.4783 19.772 17.6422 19.2937 17.366L16.6956 15.866C16.2173 15.5899 16.0535 14.9783 16.3296 14.5C16.6057 14.0217 17.2173 13.8578 17.6956 14.134L20.2937 15.634C20.772 15.9101 20.9359 16.5217 20.6597 17ZM7.66935 9.5C7.3932 9.97829 6.78161 10.1422 6.30332 9.86602L3.70525 8.36602C3.22695 8.08988 3.06308 7.47829 3.33922 7C3.61536 6.52171 4.22695 6.35783 4.70525 6.63397L7.30332 8.13398C7.78161 8.41012 7.94549 9.02171 7.66935 9.5Z"></path></svg>
                                : null
                            }
                            Submit
                        </button> :
                        null
                    }
                    {/* <button className='hover:bg-gray-300 rounded-xl' title='Send to a Project'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M12 2.58594L18.2071 8.79304L16.7929 10.2073L13 6.41436V16.0002H11V6.41436L7.20711 10.2073L5.79289 8.79304L12 2.58594ZM3 18.0002V14.0002H5V18.0002C5 18.5524 5.44772 19.0002 6 19.0002H18C18.5523 19.0002 19 18.5524 19 18.0002V14.0002H21V18.0002C21 19.657 19.6569 21.0002 18 21.0002H6C4.34315 21.0002 3 19.657 3 18.0002Z"></path></svg>
                    </button> */}
                </div>
            </div>
            {googleBooksPage ?
                <div className='flex justify-start pt-2'>
                    <p className=' bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300'>
                        page: {googleBooksPage}
                    </p>
                </div>
                :
                null
            }
        </div>
    )
}
