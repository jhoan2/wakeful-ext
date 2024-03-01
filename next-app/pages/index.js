import { useEffect, useState } from "react";
import Youtube from "../components/Youtube";
import Article from "../components/Article";
import getVideoId from 'get-video-id';
import Profile from "../components/Profile";
import { gql, useLazyQuery } from '@apollo/client';
import { useUserContext } from "../context";
import GooglePlayBooks from "../components/googleplay/GooglePlayBooks";

function IndexPopup({ loggedIn, setLoggedIn }) {
  const [currentResourceId, setCurrentResourceId] = useState('')
  const [currentTab, setCurrentTab] = useState({})
  const [youtubeId, setYoutubeId] = useState('')
  const [websiteType, setWebsiteType] = useState('')
  const { userProfile, getUserDetails } = useUserContext();

  const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  const GET_RESOURCE_ID = gql`
  query getResourceId($url: String!) {
    idealiteResourceIndex(filters: {where: {url: {equalTo: $url}}}, first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
  `

  const GET_USER_PROFILE = gql`
  query getUserProfile {
    viewer {
      idealiteProfile {
        bio
        avatarCid
        displayName
      }
    }
  }
  `
  const [getResourceId] = useLazyQuery(GET_RESOURCE_ID, {
    variables: { url: currentTab.url },
    onCompleted: (data) => {
      if (data && data.idealiteResourceIndex.edges.length > 0 && data.idealiteResourceIndex.edges[0].node.id) {
        setCurrentResourceId(data.idealiteResourceIndex.edges[0].node.id);
      }
    },
  });

  const [getUserProfile] = useLazyQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      if (data.viewer !== null) {
        getUserDetails({
          displayName: data.viewer.idealiteProfile.displayName,
          avatarCid: data.viewer.idealiteProfile.avatarCid,
          bio: data.viewer.idealiteProfile.bio
        });
      }
    },
  });

  const onPanelOpen = async () => {
    let tab = await getCurrentTab()
    setCurrentTab(tab)
    await getUserProfile()

    if (tab.url.includes('youtube')) {
      const { id } = getVideoId(tab.url);
      if (id) {
        const baseYoutubeUrl = 'https://www.youtube.com/watch?v=' + id
        tab.url = baseYoutubeUrl
        setCurrentTab(tab)
        setYoutubeId(id)
      }
      setWebsiteType('youtube')
      return
    }

    if (tab.url.includes('play.google.com/books/reader')) {
      setCurrentTab(tab)
      setWebsiteType('googleplay')
      return
    }

    //If it's not youtube or google play books, then it must be an article
    //get baseUrl from articles
    const urlObject = new URL(tab.url)
    tab.url = urlObject.origin + urlObject.pathname
    setCurrentTab(tab)
    setWebsiteType('article')
  }

  useEffect(() => {
    onPanelOpen()
    getResourceId()
  }, [])

  if (!loggedIn) {
    return (
      <div className="dark:bg-gray-800 h-screen flex justify-center items-center">
        <Profile userProfile={userProfile} />
      </div>
    )
  }

  return (
    <div className="dark:bg-gray-800 h-screen">
      {
        websiteType === 'youtube' ?
          <Youtube
            currentTab={currentTab}
            youtubeId={youtubeId}
            currentResourceId={currentResourceId}
            setCurrentResourceId={setCurrentResourceId}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
          :
          null
      }
      {
        websiteType === 'googleplay' ?
          <GooglePlayBooks
            currentTab={currentTab}
            currentResourceId={currentResourceId}
            setCurrentResourceId={setCurrentResourceId}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
          :
          null
      }
      {
        websiteType === 'article' ?
          <Article
            currentTab={currentTab}
            setCurrentResourceId={setCurrentResourceId}
            currentResourceId={currentResourceId}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
          :
          null
      }
    </div>
  );
};

export default IndexPopup;
