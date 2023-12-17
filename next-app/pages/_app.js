import '../styles/globals.css';
import { CeramicWrapper } from "../context/index";
import React, { useState, useEffect } from "react";
import { useCeramicContext } from '../context/index';
import { authenticateCeramic } from '../utils';
import { ApolloClient, ApolloLink, InMemoryCache, Observable, ApolloProvider } from '@apollo/client';
import { relayStylePagination } from "@apollo/client/utilities";

function MyApp({ Component, pageProps }) {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [loggedIn, setLoggedIn] = useState(true)
  const link = new ApolloLink((operation) => {
    return new Observable((observer) => {
      composeClient.execute(operation.query, operation.variables).then(
        (result) => {
          observer.next(result)
          observer.complete()
        },
        (error) => {
          observer.error(error)
        }
      )
    })
  })

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        CeramicAccount: {
          fields: {
            cardList: relayStylePagination(),
          },
        },
      },
    }), link
  })

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
  }

  const addContextMenu = () => {
    function getScrollYAndHighlight() {

      // Used to group all the spans that were highlighted together.
      const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
      }

      // Create the span element that will wrap the text to be highlighted
      const createHighlightWrapper = (uniqueId) => {
        const wrapper = document.createElement('span');
        wrapper.style.backgroundColor = "#EEEE00";
        wrapper.style.color = "#111111";
        wrapper.classList.add("sdwh-highlight");
        wrapper.setAttribute("sdwh-highlight-id", uniqueId);
        wrapper.style.fontSize = "1.1em";
        return wrapper;
      };

      // Helpers to traverse the DOM, which is something we have to do if
      // a selection spans multiple elements.
      const getNextNode = (node) => {
        if (node.nextSibling) {
          return getDeepFirstChild(node.nextSibling);
        }
        while (node.parentNode && !node.parentNode.nextSibling) {
          node = node.parentNode;
        }
        return node.parentNode ? getDeepFirstChild(node.parentNode.nextSibling) : null;
      };

      const getDeepFirstChild = (node) => {
        while (node && node.firstChild) {
          node = node.firstChild;
        }
        return node;
      };

      // How we detect whether the user can "see" this item. Used to fix issue
      // where sometimes extra text could appear in the clipboard output, because
      // it was part of an html element that wasn't actually visible.
      const isVisible = (node) => {
        const style = window.getComputedStyle(node.parentNode, null);
        return style.display !== "none";
      };

      // Detect if an element overlaps with the given selection range. Used as part
      // of detecting whether to continue traversing the DOM.
      const isAnyPartOfElementInsideRange = (element, range) => {
        const elemRange = document.createRange();
        elemRange.selectNode(element);
        const startsBeforeRangeEnds = range.compareBoundaryPoints(Range.END_TO_START, elemRange) <= 0;
        const endsAfterRangeStarts = range.compareBoundaryPoints(Range.START_TO_END, elemRange) >= 0;
        return startsBeforeRangeEnds && endsAfterRangeStarts;
      }

      const selection = window.getSelection()
      const uniqueId = generateId();
      if (!selection) return

      const range = selection.getRangeAt(0)
      const rangeBounds = range.getBoundingClientRect()
      const relative = document.body.parentNode.getBoundingClientRect();
      const scrollY = -(relative.top - rangeBounds.top)
      const scrollHeight = document.body.scrollHeight

      if (range.startContainer === range.endContainer) {
        const wrapper = createHighlightWrapper(uniqueId);
        range.surroundContents(wrapper);
        return {
          scrollY: scrollY,
          scrollHeight: scrollHeight
        }
      }

      let currentNode = range.startContainer;
      const nodesToWrap = [];
      while (currentNode) {
        if (!isAnyPartOfElementInsideRange(currentNode, range)) {
          break;
        }
        if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim() !== "" && isVisible(currentNode)) {
          nodesToWrap.push(currentNode);
        }
        currentNode = currentNode === range.endContainer ? null : getNextNode(currentNode);
      }

      nodesToWrap.forEach(node => {
        const wrapperRange = document.createRange();
        if (node === range.startContainer) {
          wrapperRange.setStart(node, range.startOffset);
          wrapperRange.setEnd(node, node.length);
        } else if (node === range.endContainer) {
          wrapperRange.setStart(node, 0);
          wrapperRange.setEnd(node, range.endOffset);
        } else {
          wrapperRange.selectNodeContents(node);
        }
        const wrapper = createHighlightWrapper(uniqueId);
        wrapperRange.surroundContents(wrapper);
      });

      return {
        scrollY: scrollY,
        scrollHeight: scrollHeight
      }
    }

    const injectGetScrollYAndHighlight = async (tab) => {
      const scrollObj = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getScrollYAndHighlight,
      })
      return scrollObj
    }

    const createNewResource = async (tab, clientMutationId) => {
      const res = await fetch('http://localhost:3000/api/createNewResource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientMutationId: clientMutationId,
          url: tab.url,
          title: tab.title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!res.ok) {
        throw new Error('Server responded with an error: ' + res.status);
      }
      const data = await res.json();
      console.log(data)
      return data.newResourceId.data?.createIcarusResource.document.id
    }

    const fetchImgSrc = async (imgUrl) => {
      const res = await fetch('http://localhost:3000/api/saveImgUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imgUrl: imgUrl,
        }),
      })

      if (!res.ok) {
        throw new Error('Server responded with an error: ' + res.status);
      }

      const data = await res.json();
      return data.rootCid
    }

    const contextMenuItem = {
      id: "save-to-wakeful",
      title: "Save to Wakeful",
      contexts: ["image", "selection"],
    };

    chrome.contextMenus.create(contextMenuItem);

    chrome.contextMenus.onClicked.addListener(async (info, tab) => {

      //if no ceramic did that means user is not logged in
      if (ceramic.did === undefined) {
        return
      }

      const clientMutationId = composeClient.id
      const resource = await composeClient.executeQuery(`
        query {
          icarusResourceIndex(first: 2, filters:{ where: { url: { equalTo: "${tab.url}" }}}) {
            edges {
              node {
                id
              }
            }
          }
        }
      `)

      let resourceId, cid, scrollY, scrollHeight;
      //if there is no resourceId create one
      if (resource?.data.icarusResourceIndex.edges.length === 0) {
        const newResourceId = await createNewResource(tab, clientMutationId);
        //Might need to show an error here.
        resourceId = newResourceId
      } else {
        //else set the resourceId to the query result
        resourceId = resource.data.icarusResourceIndex.edges[0].node.id
      }

      const { srcUrl, selectionText, pageUrl } = info
      const date = new Date().toISOString()

      //if there is an image url, save it to pinata and get the cid
      if (srcUrl) {
        cid = await fetchImgSrc(srcUrl)
      } else {
        const location = await injectGetScrollYAndHighlight(tab)
        const scrollObj = location[0].result
        scrollY = parseInt(scrollObj.scrollY)
        scrollHeight = parseInt(scrollObj.scrollHeight)
      }

      let input = {
        createdAt: date,
        updatedAt: date,
        resourceId: resourceId,
        quote: selectionText,
        pageYOffset: scrollY,
        scrollHeight: scrollHeight,
        cid: cid,
        deleted: false,
        url: pageUrl
      }

      for (const key in input) {
        if (input[key] === undefined || input[key] === null) {
          delete input[key];
        }
      }

      let variableValues = {
        "i": {
          "content": input
        }
      }

      const cardId = await composeClient.executeQuery(`
      mutation CreateNewCard ($i: CreateCardInput!) {
        createCard(
          input: $i
        ) {
          document {
            id
          }
        }
      }
      `, variableValues)
      if (cardId.errors) {
        console.log('Error creating card', cardId.errors)
      } else if (cardId.data) {
        console.log('successfully created a card')
      }
    });
  }

  useEffect(() => {
    if (localStorage.getItem('logged_in')) {
      handleLogin()
      addContextMenu()
    } else {
      setLoggedIn(false)
      //remove the context menu if the user is not logged in
      chrome.contextMenus.remove("save-to-wakeful")
    }

  }, [])


  return (
    <div>
      <ApolloProvider client={apolloClient}>
        <div>
          <CeramicWrapper>
            <div>
              <Component
                {...pageProps}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            </div>
          </CeramicWrapper>
        </div>
      </ApolloProvider>
    </div>
  )
}

export default MyApp
