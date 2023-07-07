import '../styles/globals.css'
import { CeramicWrapper } from "../context";

import React, { useState, useEffect } from "react"

import { useCeramicContext } from '../context';
import { authenticateCeramic } from '../utils';
import AuthPrompt from "./did-select-popup";

function MyApp({ Component, pageProps }) {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
    // await getProfile()
  }

  // Update to include refresh on auth
  useEffect(() => {
    if (localStorage.getItem('logged_in')) {
      handleLogin()
      // getProfile()
    }
  }, [])

  return (
    <div>
      <AuthPrompt />
      <div>
        <CeramicWrapper>
          <div>
            <Component {...pageProps} />
          </div>
        </CeramicWrapper>
      </div>
    </div>

  )
}

export default MyApp
