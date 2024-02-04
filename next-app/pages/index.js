import { useEffect, useState } from "react";
import Youtube from "../components/Youtube";
import Article from "../components/Article";
import getVideoId from 'get-video-id';
import Profile from "../components/Profile";
import { gql, useLazyQuery } from '@apollo/client';
import { useUserContext } from "../context";

function IndexPopup({ loggedIn, setLoggedIn }) {
  const [currentResourceId, setCurrentResourceId] = useState('')
  const [currentTab, setCurrentTab] = useState({})
  const [youtubeId, setYoutubeId] = useState('')
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
    await getUserProfile()
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
        youtubeId ?
          <Youtube
            currentTab={currentTab}
            youtubeId={youtubeId}
            currentResourceId={currentResourceId}
            setCurrentResourceId={setCurrentResourceId}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
          :
          <Article
            currentTab={currentTab}
            setCurrentResourceId={setCurrentResourceId}
            currentResourceId={currentResourceId}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
      }
    </div>
  );
};

export default IndexPopup;
