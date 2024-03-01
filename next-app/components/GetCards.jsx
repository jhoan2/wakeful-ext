import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import CardList from './CardList'
import { useCeramicContext } from '../context';
import ErrorPage from './ErrorPage';
import SkeletonCard from './SkeletonCard';
import NoContent from './NoContent';

export default function CardNotes({ currentTab, setCurrentResourceId }) {
  const currentUrl = currentTab.url
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const clientMutationId = composeClient.id

  const GET_CARDS_PER_URL_PER_USER = gql`
  query getCardsPeUrlPerUser ($url: String, $clientMutationId: ID!, $cursor: String) {
    node(id: $clientMutationId) {
      ... on CeramicAccount {
        idealiteCardsList(
          filters: {where: {deleted: {equalTo: false}, url: {equalTo: $url}}}
          first: 10
          after: $cursor
          sorting: {updatedAt: DESC}
          ) {
          edges {
            node {
              annotation
              id
              cid
              createdAt
              pageYOffset
              scrollHeight
              updatedAt
              videoTime
              quote
              googleBooksPage
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
  `

  const { loading, error, data, fetchMore } = useQuery(GET_CARDS_PER_URL_PER_USER, {
    variables: { url: currentUrl, clientMutationId: clientMutationId }
  });

  if (loading) return <SkeletonCard />
  if (error) return <ErrorPage message={error.message} />;

  const cards = data.node?.idealiteCardsList.edges
  const pageInfo = data.node?.idealiteCardsList.pageInfo
  const loadMore = () => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
        },
      })
    }
  }

  return <div className='dark:text-white'>
    {data ?
      <CardList data={cards} currentTab={currentTab} /> :
      <div className='h-screen flex justify-center items-center'>
        <NoContent />
      </div>
    }
    {pageInfo.hasNextPage ?
      <button
        onClick={() => loadMore()}
        className='hover:bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full  bg-yellow-100 w-full h-8  text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50'
      >
        Load more
      </button> :
      null
    }
  </div>

}
