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
        <div>Profile</div>
    )
}
