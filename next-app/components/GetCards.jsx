import React from 'react'
import { useQuery, gql } from '@apollo/client';
import CardList from './CardList'

export default function CardNotes({ currentTab, setCurrentResourceId }) {
  const currentUrl = currentTab.url
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
                  resourceId
                  quote
                  annotation
                  pageYOffset
                  scrollHeight
                }
              }
            }
          }
        }
      }
    }`

  const { loading, error, data } = useQuery(GET_CARDS_PER_URL, { skip: !currentUrl });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data) {
    if (data.icarusResourceIndex.edges.length < 1) {
      return <p>New User</p>
    } else {
      const resourceId = data.icarusResourceIndex.edges[0]?.node.cards.edges[0]?.node.resourceId
      setCurrentResourceId(resourceId)
    }
  }

  return <div className='dark:text-white'>
    {data ? <CardList data={data.icarusResourceIndex.edges[0]} currentTab={currentTab} /> : null}
  </div>

}
