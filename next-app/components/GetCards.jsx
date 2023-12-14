import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import CardList from './CardList'
import { useCeramicContext } from '../context';
import ErrorPage from './ErrorPage';
import SkeletonCard from './SkeletonCard';

export default function CardNotes({ currentTab, setCurrentResourceId }) {
  const currentUrl = currentTab.url
  const clients = useCeramicContext()
  const { composeClient } = clients
  const clientMutationId = composeClient.id

  const GET_CARDS_PER_URL_PER_USER = gql`
  query MyQuery ($url: String!, $account: ID, $after: String) {
    icarusResourceIndex(filters: {where: {url: {equalTo: $url}}}, first: 1) {
      edges {
        node {
          cards(account: $account, filters: {where: {deleted: {equalTo: false}}}, first: 10, after: $after) {
            edges {
              node {
                annotation
                cid
                id
                resourceId
                scrollHeight
                pageYOffset
                videoTime
                quote
              }
            }
          }
        }
      }
    }
  }
  `

  const { loading, error, data, fetchMore } = useQuery(GET_CARDS_PER_URL_PER_USER, {
    variables: { url: currentUrl, account: clientMutationId, after: null },
    skip: !currentUrl
  });

  if (loading) return <SkeletonCard />
  if (error) return <ErrorPage message={error.message} />;
  const cards = data?.icarusResourceIndex.edges[0]?.node.cards

  const loadMore = () => {
    // if (cards.pageInfo.hasNextPage) {
    //   fetchMore({
    //     variables: {
    //       after: cards.pageInfo.endCursor,
    //     },
    //   })
    //   console.log(cards)
    // }
    console.log(cards)

  }




  return <div className='dark:text-white'>
    {data ?
      <CardList data={cards} currentTab={currentTab} /> :
      <div className='h-screen flex justify-center items-center'>
        <NoContent />
      </div>
    }
  </div>

}
