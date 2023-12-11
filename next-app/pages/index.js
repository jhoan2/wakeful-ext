import { useEffect, useState } from "react";
import { useCeramicContext } from "../context/index";
import { useLazyQuery, gql } from '@apollo/client';
import GetCards from "../components/GetCards";
import Youtube from "../components/Youtube";
import Article from "../components/Article";
import getVideoId from 'get-video-id';
import Profile from "../components/Profile";

function IndexPopup({ loggedIn, setLoggedIn }) {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [currentResourceId, setCurrentResourceId] = useState('')
  const [currentTab, setCurrentTab] = useState({})
  const [youtubeId, setYoutubeId] = useState('')
  const [showProfile, setShowProfile] = useState(true)

  const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  function capture() {
    //this code is running inside the tab
    var canvas = document.createElement('canvas');
    var video = document.querySelector('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    // Convert the canvas data to a Data URL with the desired format.
    var pngData = canvas.toDataURL("image/png");
    return pngData;
  }


  const onPanelOpen = async () => {
    let tab = await getCurrentTab()
    setCurrentTab(tab)

    //get baseUrl from youtube and articles
    const { id } = getVideoId(tab.url);
    const hashIndex = tab.url.indexOf('#');
    if (id) {
      const baseYoutubeUrl = 'https://www.youtube.com/watch?v=' + id
      tab.url = baseYoutubeUrl
      setCurrentTab(tab)
    }
    if (hashIndex > -1) {
      tab.url = tab.url.substring(0, hashIndex)
      setCurrentTab(tab)
    }

    setYoutubeId(id)
  }

  useEffect(() => {
    onPanelOpen()
  }, [])


  //will have to connect to cache here too 
  //think making a query for the cards will have to be here and so set the existing resource here 
  if (!loggedIn) {
    return (
      <div className="dark:bg-gray-800 h-screen flex justify-center items-center">
        <Profile
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn} />
      </div>
    )
  }

  return (
    <div className="dark:bg-gray-800 h-screen flex justify-center items-center">
      {showProfile ?
        (
          youtubeId ?
            <Youtube
              currentTab={currentTab}
              youtubeId={youtubeId}
              currentResourceId={currentResourceId}
              setCurrentResourceId={setCurrentResourceId}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn} />
            :
            <Article
              currentTab={currentTab}
              setCurrentResourceId={setCurrentResourceId}
              currentResourceId={currentResourceId}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn} />
        )
        :
        <Profile
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn} />
      }
    </div>
  );
};

export default IndexPopup;
