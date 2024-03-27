import React, { useState } from 'react'
import { toast } from 'sonner';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';

export default function AddBook({ currentUrl, loggedIn, setLoggedIn, setCurrentResourceId }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingBooks, setLoadingBooks] = useState(false)

    const refresh = () => {
        window.location.reload();
    }

    const handleSubmit = (event) => {
        setLoadingBooks(true)
        event.preventDefault();
        setCurrentPage(1);
        const encodedTitle = encodeURIComponent(query);
        const searchUrl = `https://openlibrary.org/search.json?title=${encodedTitle}&limit=${limit}&page=${currentPage}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                setResults(data.docs)
            })
            .catch(error => {
                toast.error('Something went wrong!')
                console.log(error.message)
            });
        setLoadingBooks(false)
    };

    const getNextPage = (event) => {
        setLoadingBooks(true)
        event.preventDefault();
        const encodedTitle = encodeURIComponent(query);
        const searchUrl = `https://openlibrary.org/search.json?title=${encodedTitle}&limit=${limit}&page=${currentPage + 1}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                setResults(data.docs)
            })
            .catch(error => {
                toast.error('Something went wrong!')
                console.log(error.message)
            });

        setCurrentPage(currentPage + 1);
        setLoadingBooks(false)
    };

    return (
        <div className='w-full'>
            <div id='article-panel-menu' className='flex justify-center my-5'>
                <div className='fixed top-0 z-20'>
                    <button type="button" title='Refresh' onClick={() => refresh()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path></svg>
                    </button>
                    <button type="button" title='Profile Page' onClick={() => setLoggedIn(!loggedIn)} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                    </button>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-pretty text-center">Add Book To Your Library</h2>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center'>
                <label for="book-search" className='flex justify-center'>Search for Open Library for your Book:</label>
                <div className='flex justify-center'>
                    <button type="submit" className='flex justify-center items-center h-10 rounded-md w-10 border border-slate-200'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='w-6 h-6'>
                            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />
                        </svg>
                    </button>
                    <input
                        id="book-search"
                        placeholder='Click here to edit.'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='flex h-10 w-2/3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300'
                    />
                </div>
            </form>
            <div>
                {loadingBooks ? <BookCardSkeleton /> : null}
                {results && results.length > 0 ?
                    <div className='space-y-4 p-6 max-w-md mx-auto'>
                        <p>Select your book:</p>
                        {results.map((book) => {
                            return <BookCard
                                key={book.key}
                                title={book.title ? book.title : ''}
                                author={book?.author_name ? book?.author_name[0] : ''}
                                firstSentence={book?.first_sentence ? book?.first_sentence[0] : ''}
                                published={book?.first_publish_year ? book.first_publish_year : 0}
                                coverUrl={`https://covers.openlibrary.org/b/id/${book?.cover_i}-S.jpg`}
                                currentUrl={currentUrl}
                                setCurrentResourceId={setCurrentResourceId}
                            />
                        })}
                    </div>
                    :
                    <p className='flex justify-center text-lg'>No results yet.</p>
                }
            </div>
            <div className='flex justify-end pr-4 pb-4'>
                {
                    results && results.length > 0 ?
                        <button
                            className='h-9 rounded-md px-3 inline-flex items-center content-end whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80'
                            onClick={(e) => {
                                getNextPage(e);
                            }}>
                            Next
                        </button> :
                        null
                }
            </div>
        </div>
    )
}
