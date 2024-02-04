import React from 'react'
import { MoreVertical, Trash, FileSymlink } from 'lucide-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useUserContext } from '../context';

export default function CardActionsButton({ id }) {
    const { userProfile } = useUserContext();
    const UPDATE_NOTE = gql`
    mutation UPDATE_NOTE($input: UpdateCardsInput!) {
        updateCards(input: $input) {
          document {
            id
            annotation
          }
        }
      }`
    const [sendDeleteNote] = useMutation(UPDATE_NOTE, {
        refetchQueries: ['getCardsPeUrlPerUser'],
    });

    const deleteNote = async () => {
        await sendDeleteNote({
            variables: {
                input: {
                    id: id,
                    content: {
                        updatedAt: new Date().toISOString(),
                        deleted: true,
                    }
                }
            }
        })
    }

    const CREATE_PROJECT_CARD_COLLECTION = gql`
    mutation createProjectCardCollection($input: CreateIdealiteProjectCardCollectionInput!) {
        createIdealiteProjectCardCollection(input: $input) {
          document {
            id
          }
        }
      }
      `

    const [sendCreateProjectCardCollection,
        {
            loading: createProjectCardCollectionLoading,
            error: createProjectCardCollectionError,
        }
    ] = useMutation(CREATE_PROJECT_CARD_COLLECTION);

    const createProjectCardCollection = async (projectId) => {
        await sendCreateProjectCardCollection({
            variables: {
                input: {
                    content: {
                        deleted: false,
                        projectId: projectId,
                        cardId: id,
                    }
                }
            }
        })
    }
    const GET_RECENT_PROJECTS = gql`
    query getRecentProjects {
        viewer {
          idealiteProjectList(
            last: 7
            sorting: {priority: DESC}
            filters: {where: {deleted: {equalTo: false}}}
          ) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
      `

    const { loading: recentProjectsLoading, error: recentProjectsError, data: recentProjectsData } = useQuery(GET_RECENT_PROJECTS);

    return (
        <div className='absolute top-2 right-2'>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className='hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50'>
                        <MoreVertical className='h-4 w-4' />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className='z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50'>
                        <DropdownMenu.Label className='px-2 py-1.5 text-sm font-semibold'>
                            Actions
                        </DropdownMenu.Label>
                        <DropdownMenu.Separator className='mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800' />
                        <DropdownMenu.Item onClick={() => deleteNote(id)} className='text-red-600 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-100 focus:text-red-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenu.Item>
                        <DropdownMenu.Sub className='z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50'>
                            <DropdownMenu.SubTrigger className='flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-slate-100 data-[state=open]:bg-slate-100 dark:focus:bg-slate-800 dark:data-[state=open]:bg-slate-800'>
                                <FileSymlink className="mr-2 h-4 w-4" />
                                <span>Send to Project</span>
                            </DropdownMenu.SubTrigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.SubContent className='z-50 min-w-[8rem] max-w-36 overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50'>
                                    {!userProfile.displayName && (
                                        <DropdownMenu.Item
                                            disabled={!userProfile.displayName}
                                            className='relative flex w-32 max-w-36 cursor-default text-pretty select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'
                                        >
                                            <span>No Profile. Log into the website to automatically create one.</span>
                                        </DropdownMenu.Item>
                                    )}
                                    {recentProjectsLoading && <span>Loading...</span>}
                                    {recentProjectsError && <span>Error loading projects</span>}
                                    {!recentProjectsData?.viewer?.idealiteProjectList?.edges ?
                                        <span>No Projects</span>
                                        :
                                        (recentProjectsData?.viewer?.idealiteProjectList?.edges.map((project) => (
                                            <DropdownMenu.Item
                                                key={project.node.id}
                                                onClick={() => createProjectCardCollection(project.node.id)}
                                                className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'
                                            >
                                                <span>
                                                    {
                                                        createProjectCardCollectionLoading ? 'Sending..' :
                                                            createProjectCardCollectionError ? 'Error' : project.node.title
                                                    }
                                                </span>
                                            </DropdownMenu.Item>
                                        )))
                                    }
                                </DropdownMenu.SubContent>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Sub>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div >
    )
}
