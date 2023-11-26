import React from 'react'
import Card from './Card'
import NoContent from './NoContent'

export default function CardList({ data, currentTab }) {
    if (!data.edges) return <NoContent />
    const cardList = data.edges

    return <div className='m-2 space-y-2'>
        {cardList.map((card) => { return <Card key={card.node.id} currentTab={currentTab} content={card} /> })}
        {/* <Card content={edges[0]} currentTab={currentTab} /> */}
    </div>
}

