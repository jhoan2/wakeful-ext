import React from 'react'

export default function Profile() {

    const toggleDarkMode = () => {
        if (localStorage.getItem("theme") === "dark") {
            localStorage.removeItem("theme")
        } else {
            localStorage.setItem("theme", "dark");

        }
        window.location.reload();
    }

    // const changeStyles = () => {
    //     setStyles(styles + " font-mono")
    // }

    // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    //     document.documentElement.classList.add('dark')
    //   } else {
    //     document.documentElement.classList.remove('dark')
    //   }

    const handleLogout = () => {
        localStorage.removeItemItem("logged_in")
        localStorage.removeItem('ceramic:did_seed')
        localStorage.removeItem('ceramic:eth_did')
        localStorage.removeItem('did')
        localStorage.removeItem('ceramic:auth_type')
        window.location.reload();
        console.log('logged out')
    }

    return (
        <div>
            <div className='flex flex-col justify-center space-y-4'>
                <div className='flex items-center space-x-4'>
                    <img src={'/next-assets/icon32.png'} className="w-16 h-16 object-cover rounded-full" alt="No Content Cat Image" />
                    <p className='text-3xl font-bold'>Idealite</p>
                </div>
                <button onClick={() => handleLogout()} className="py-3 px-4 inline-flex items-center justify-around gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path></svg>
                    Logout
                </button>
            </div>
        </div>
    )
}
