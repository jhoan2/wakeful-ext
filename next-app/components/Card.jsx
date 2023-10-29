import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';


export default function Card({ content, currentTab }) {
    const [toggleInput, setToggleInput] = useState(false)
    const [updateNoteContent, setUpdateNoteContent] = useState('')
    const { id, quote, annotation, pageYOffset, scrollHeight } = content.node
    const currentTabId = currentTab.id
    const currentUrl = currentTab.url
    const UPDATE_NOTE = gql`
    mutation UPDATE_NOTE($input: UpdateCardInput!) {
        updateCard(input: $input) {
          document {
            id
            annotation
          }
        }
      }`

    const GET_CARDS_PER_URL = gql`
      query GET_CARDS_PER_URL {
          icarusResourceIndex(
            first: 1
            filters: {where: {url: {equalTo: "${currentUrl}"}}}
          ) {
            edges {
              node {
                title
                cards(
                  first: 10
                  filters: {where: {deleted: {equalTo: false}}}
                ) {
                  edges {
                    node {
                      id
                      pageYOffset
                      resourceId
                      quote
                      annotation
                    }
                  }
                }
              }
            }
          }
      }`

    const [sendUpdateNote, { data, loading, error }] = useMutation(UPDATE_NOTE, {
        onCompleted: () => setToggleInput(false)
    });

    const [sendDeleteNote, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(UPDATE_NOTE, {
        onCompleted: () => setToggleInput(false),
        refetchQueries: [
            { query: GET_CARDS_PER_URL }
        ]
    });

    const updateNote = async () => {
        await sendUpdateNote({
            variables: {
                input: {
                    id: id,
                    content: {
                        updatedAt: new Date().toISOString(),
                        annotation: updateNoteContent,
                    }
                }
            }
        })
        setUpdateNoteContent('')
    }

    const deleteNote = async () => {
        await sendDeleteNote({
            variables: {
                input: {
                    id: id,
                    content: {
                        updatedAt: new Date().toISOString(),
                        deleted: true,
                    }
                }
            }
        })
        setUpdateNoteContent('')
    }

    const showTextArea = () => {
        if (toggleInput) {
            setToggleInput(false)
            document.getElementById(`update-note${id}`).classList.remove("hidden")
        } else {
            document.getElementById(`update-note${id}`).classList.add("hidden")
            setToggleInput(true)
        }
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

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    if (!quote && !annotation) return null

    return (
        <div className='border-2 rounded relative p-6'>
            <button className='absolute top-0 right-1 text-red-300 hover:bg-red-600 rounded-md p-1' onClick={() => deleteNote()}>
                X
            </button>
            <button className='absolute bottom-0 left-1 hover:bg-gray-600 rounded-md p-1' onClick={() => showTextArea()}>
                {toggleInput ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-300"><path d="M12.9999 16.1716L18.3638 10.8076L19.778 12.2218L11.9999 20L4.22168 12.2218L5.63589 10.8076L10.9999 16.1716V4H12.9999V16.1716Z"></path></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-300"><path d="M12.9999 7.82843V20H10.9999V7.82843L5.63589 13.1924L4.22168 11.7782L11.9999 4L19.778 11.7782L18.3638 13.1924L12.9999 7.82843Z"></path></svg>
                }
            </button>
            <p className='italic border rounded p-2 hover:bg-gray-100' onClick={() => executeScrollTo()}>
                {quote}
            </p>
            {annotation ?
                <p className='pt-2'>{annotation}</p>
                :
                null
            }
            <div id={`update-note${id}`} className='flex flex-col pt-2 hidden'>
                <label>
                    <textarea
                        placeholder='Add Note Here'
                        className='w-full h-12'
                        value={updateNoteContent}
                        onChange={e => setUpdateNoteContent(e.target.value)}
                    />
                </label>
                <div className='flex justify-end'>
                    <button
                        onClick={() => updateNote()}
                        className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
