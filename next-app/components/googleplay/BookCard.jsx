import React from 'react'
import { useCeramicContext } from '../../context';
import { toast } from 'sonner';
import { gql, useMutation } from '@apollo/client';

export default function BookCard({ author, title, coverUrl, published, firstSentence, currentUrl, setCurrentResourceId }) {
    const clients = useCeramicContext()
    const { composeClient } = clients
    const clientMutationId = composeClient.id

    const CREATE_ACCOUNT_RESOURCE = gql`
    mutation createAccountResource($input: CreateIdealiteAccountResourcesInput!) {
        createIdealiteAccountResources(input: $input) {
          document {
            id
          }
        }
      }
      `

    const [createAccountResource] = useMutation(CREATE_ACCOUNT_RESOURCE, {
        onError: (error) => console.log('Error creating account resource: ' + error.message)
    });

    const createNewBookResource = async () => {
        const res = await fetch('http://localhost:3000/api/createNewBookResource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                clientMutationId: clientMutationId,
                author: author,
                url: currentUrl,
                description: firstSentence,
                publishedAt: published
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }

        const data = await res.json();

        await createAccountResource({
            variables: {
                input: {
                    "content": {
                        recipient: clientMutationId,
                        resourceId: data.newResourceId,
                        url: currentUrl,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        readingStatus: 'READING'
                    }
                }
            }
        })

        if (data.newResourceId) {
            toast.success('Successfully added book.')
            setCurrentResourceId(data.newResourceId)
            setTimeout(function () {
                window.location.reload()
            }, 1000);
        }
        return
    }

    return (
        <div
            className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-400'
            onClick={() => createNewBookResource()}
        >
            <img src={coverUrl} alt={title} />
            <div className='flex flex-col'>
                <p className='text-xl font-semibold leading-none tracking-tight'>
                    {title}
                </p>
                <p className='text-sm text-slate-500'>
                    {author}
                </p>
                <p className='text-sm text-slate-500'>
                    Published: {published}
                </p>
            </div>
        </div>
    )
}
