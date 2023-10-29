import React from 'react'
import Card from './Card'

export default function CardList({ data, currentTab }) {
    if (data && !data.node.cards) return null


    const { edges } = data.node.cards

    return <div className='m-2'>
        {edges.map((edge) => { return <Card key={edge.node.id} currentTab={currentTab} content={edge} /> })}
        {/* <Card content={edges[0]} currentTab={currentTab} /> */}
    </div>
}

