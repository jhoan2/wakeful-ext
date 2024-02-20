import React, { useEffect, useState } from 'react';
import { authenticateCeramic } from '../utils/index';
import { useCeramicContext } from "../context/index";
import * as Avatar from '@radix-ui/react-avatar';
import { createExternalExtensionProvider } from '@metamask/providers';
import { toast } from "sonner";

export default function Profile({ userProfile }) {
    const clients = useCeramicContext()
    const { ceramic, composeClient } = clients
    const composeClientId = composeClient.id
    const avatarFallback = composeClientId ? composeClientId.substring(composeClientId.length - 5) : '0x...'
    const [hasLoggedIn, setHasLoggedIn] = useState(false)
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

    // 1. Define constants

    const handleLogout = () => {
        localStorage.removeItem("logged_in")
        localStorage.removeItem('ceramic:did_seed')
        localStorage.removeItem('ceramic:eth_did')
        localStorage.removeItem('did')
        localStorage.removeItem('ceramic:auth_type')
        window.location.reload();
    }

    const handleEthPkh = async () => {
        let provider = createExternalExtensionProvider();
        if (!provider) {
            toast.error("Please install Metamask.");
        }
        const chainId = await provider.request({ method: 'eth_chainId' });
        if (chainId !== '0xa') {
            toast.info("Please switch to the Optimism network.");
            return
        }

        localStorage.setItem("ceramic:auth_type", "eth");
        const res = await authenticateCeramic(ceramic, composeClient);
        if (res) {
            window.location.reload();
        }
    };

    useEffect(() => {
        if (localStorage.getItem('logged_in')) {
            setHasLoggedIn(true)
        }
    }, [])


    return (
        <div>
            <div className='flex justify-center'>
                <Avatar.Root>
                    <Avatar.Image />
                    <Avatar.Fallback>
                        <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                            {userProfile.displayName ? userProfile.displayName : `0x...${avatarFallback}`}
                        </span>
                    </Avatar.Fallback>
                </Avatar.Root>
            </div>
            <div className='flex flex-col justify-center space-y-4'>
                <div className='flex items-center space-x-4'>
                    <img src={'/next-assets/icon32.png'} className="w-16 h-16 object-cover rounded-full" alt="Idealite logo" />
                    <p className='text-4xl font-bold'>Idealite</p>
                </div>
                {hasLoggedIn ?
                    <button type="button" onClick={() => handleLogout()} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:hover:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path></svg>
                        Logout
                    </button>
                    :
                    <button onClick={() => handleEthPkh()} className="py-3 px-4 inline-flex items-center justify-around gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Login
                    </button>
                }
            </div>
            <button type="button" onClick={() => window.location.reload()} className="fixed top-0 left-0 flex justify-center items-center h-10 w-10 text-sm font-semibold rounded-full border border-transparent bg-gray-300 text-white hover:bg-gray-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-12 h-12'><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg>
            </button>
        </div>
    )
}
