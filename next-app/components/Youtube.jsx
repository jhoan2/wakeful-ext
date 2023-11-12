import React, { useState, useEffect } from 'react'
import YoutubeCaptionsList from './YoutubeCaptionsList';
import YoutubeNotes from './YoutubeNotes';
import YoutubeAddNote from './YoutubeAddNote';
import { getVideoDetails } from 'youtube-caption-extractor';
import { useCeramicContext } from '../context';


export default function YoutubeAnnotations({ currentTab, youtubeId, currentResourceId, setCurrentResourceId }) {
    const [showNotes, setShowNotes] = useState(false)
    const [openYoutubeAddNote, setYoutubeOpenAddNote] = useState(false)
    const currentTabId = currentTab.id
    const [styles, setStyles] = useState('p-2 m-2 border border-gray-300 rounded-lg hover:bg-gray-100')
    const [intervalId, setIntervalId] = useState('')
    const [currentTime, setCurrentTime] = useState('')
    const { composeClient } = clients
    const videoID = youtubeId;
    const lang = 'en'; // Optional, default is 'en' (English)
    const [subtitles, setSubtitles] = useState([
        {
            "start": "0.42",
            "dur": "7.26",
            "text": "In 2023 Kurzgesagt has existed for 10 years, \ninsanely long in internet years. We are among the  "
        },
        {
            "start": "7.68",
            "dur": "4.86",
            "text": "largest sciency channels on Youtube and still a \nbit of a black box to people. So let us talk about  "
        },
        {
            "start": "12.54",
            "dur": "6.84",
            "text": "ourselves a bit in three parts: Our backstory, how \nwe finance our work and the values of Kurzgesagt!"
        },
        {
            "start": "19.38",
            "dur": "2.88",
            "text": "Let’s jump to a more innocent time."
        },
        {
            "start": "22.26",
            "dur": "2.76",
            "text": "From humble beginnings to Today"
        },
        {
            "start": "25.02",
            "dur": "6.12",
            "text": "Kurzgesagt’s foundation was laid when Philipp, our \nfounder, dropped out of high school as a teenager.  "
        },
        {
            "start": "31.68",
            "dur": "6.3",
            "text": "Learning seemed daft and useless and he was not \ninterested in anything. Until a very special  "
        },
        {
            "start": "37.98",
            "dur": "4.98",
            "text": "teacher at a school for dropouts grabbed him \nby the neck. The way she taught was different.  "
        },
        {
            "start": "43.62",
            "dur": "5.4",
            "text": "She talked about connections and the big picture. \nShe told a story. For the first time ever,  "
        },
        {
            "start": "49.02",
            "dur": "4.56",
            "text": "Philipp wanted to learn more without being \nforced. It was a key life experience."
        },
        {
            "start": "53.58",
            "dur": "4.92",
            "text": "Kurzgesagt tries to recreate this \nexperience for you. Nothing is  "
        },
        {
            "start": "58.5",
            "dur": "3.24",
            "text": "boring if you tell a good story \nand we try to tell these stories,  "
        },
        {
            "start": "61.74",
            "dur": "3.42",
            "text": "to spark excitement and make you \nwant to go on and learn more."
        },
        {
            "start": "65.16",
            "dur": "3.96",
            "text": "Because of the one teacher that could do \nthis, Philipp got a high school degree,  "
        },
        {
            "start": "69.12",
            "dur": "4.38",
            "text": "studied history and design and eventually \nstarted Kurzgesagt as a passion project,  "
        },
        {
            "start": "73.5",
            "dur": "2.28",
            "text": "inspired by Crash Course World history."
        },
        {
            "start": "75.78",
            "dur": "6.06",
            "text": "In 2012 Youtube was less commercial and more \nidealistic. You couldn’t make a living with  "
        },
        {
            "start": "81.84",
            "dur": "5.52",
            "text": "videos as involved as ours and that was fine. \nThe goal was creative freedom and so for the  "
        },
        {
            "start": "87.36",
            "dur": "4.8",
            "text": "first few years, it actually cost money to \nmake Kurzgesagt. We had no outside funding,  "
        },
        {
            "start": "92.16",
            "dur": "5.46",
            "text": "just intrinsic motivation and a few friends from \nuniversity. We worked for clients during the day  "
        },
        {
            "start": "97.62",
            "dur": "7.2",
            "text": "and on Kurzgesagt at night, 80-100 hours a week. \nIt was a real struggle but also very rewarding."
        },
        {
            "start": "105.42",
            "dur": "4.68",
            "text": "But then Patreon launched, sponsorships \nstarted, our views increased, Youtube  "
        },
        {
            "start": "110.1",
            "dur": "5.04",
            "text": "changed. In 2015 the channel began to \nbreak even and then to earn a profit.  "
        },
        {
            "start": "115.86",
            "dur": "3.9",
            "text": "But we were pretty burned out at this \npoint, so we decided to bring in more  "
        },
        {
            "start": "119.76",
            "dur": "4.2",
            "text": "friends and hire the first team members \nfull time, creating a legal entity."
        },
        {
            "start": "123.96",
            "dur": "6.66",
            "text": "More people meant that we could stop overworking, \ndo more and improve. But we also needed to earn  "
        },
        {
            "start": "130.62",
            "dur": "5.4",
            "text": "more; the livelihood of real humans depended \nupon it. None of us had any experience in  "
        },
        {
            "start": "136.02",
            "dur": "4.62",
            "text": "running a company. We didn’t plan to become \nbig or to grow – it sorta just happened."
        },
        {
            "start": "140.64",
            "dur": "4.26",
            "text": "A decade later Kurzgesagt is \nnot a small project anymore. "
        },
        {
            "start": "145.62",
            "dur": "5.34",
            "text": "We are an animation studio, with offices \nin Munich and Berlin. We need computers,  "
        },
        {
            "start": "150.96",
            "dur": "6.42",
            "text": "monitors, tablets, desks, coffee, contracts, \npay licences, taxes, rent and insurance."
        },
        {
            "start": "158.46",
            "dur": "6.06",
            "text": "In 2023 our team consists of over 60 full \nemployees and a lot of freelancers around  "
        },
        {
            "start": "164.52",
            "dur": "5.28",
            "text": "the world. Salaries alone cost millions \nof dollars a year, just to stay around."
        },
        {
            "start": "169.8",
            "dur": "5.16",
            "text": "This creates an interesting problem: \nwith such high production costs, "
        },
        {
            "start": "174.96",
            "dur": "2.4",
            "text": "how can we publish our work for free?"
        },
        {
            "start": "178.44",
            "dur": "1.92",
            "text": "How we finance Kurzgesagt"
        },
        {
            "start": "180.36",
            "dur": "7.2",
            "text": "We have added up our earnings from 2015 through \n2022. Our sources of funding change depending on  "
        },
        {
            "start": "187.56",
            "dur": "5.04",
            "text": "opportunities and the state of the world. Early \non, agency work was our main source of income,  "
        },
        {
            "start": "192.6",
            "dur": "5.58",
            "text": "ad revenue varies, in some years we got \nmore sponsorships than in others. The shop  "
        },
        {
            "start": "198.18",
            "dur": "4.08",
            "text": "didn’t exist for a long time, then it became \npretty big after we launched our calendar."
        },
        {
            "start": "203.04",
            "dur": "4.56",
            "text": "62% of our revenue comes \nindirectly or directly from you:  "
        },
        {
            "start": "207.6",
            "dur": "4.86",
            "text": "You watch our videos with ads, support \nus on Patreon or buy from our shop."
        },
        {
            "start": "213.3",
            "dur": "6.42",
            "text": "The single biggest source of income by far, is \nour shop that alone accounted for 40% over the  "
        },
        {
            "start": "219.72",
            "dur": "5.64",
            "text": "last 8 years. The shop started small but once we \npublished our calendar for the first time in 2016,  "
        },
        {
            "start": "225.36",
            "dur": "4.62",
            "text": "we realised it could really help us do more \nthings and we started producing more and  "
        },
        {
            "start": "229.98",
            "dur": "4.92",
            "text": "more science products, from our posters to our \ngratitude journal or universe scented candles.  "
        },
        {
            "start": "235.5",
            "dur": "7.68",
            "text": "YouTube ads accounted for 13% and Patreon 9%. \nSo without your support we would cease to exist."
        },
        {
            "start": "244.08",
            "dur": "5.1",
            "text": "Our shop and Patreon are our most important \nsources of revenue, and because we see ourselves  "
        },
        {
            "start": "249.18",
            "dur": "4.92",
            "text": "as science communicators – we don’t just do \nmerch, but sciency products that we spend  "
        },
        {
            "start": "254.1",
            "dur": "4.8",
            "text": "hundreds of hours researching, discussing with \nexperts, polishing up and working on directly  "
        },
        {
            "start": "258.9",
            "dur": "6.6",
            "text": "with the manufacturers. They are part of the \nscience story we try to tell. It also just feels  "
        },
        {
            "start": "265.5",
            "dur": "4.68",
            "text": "good to get directly funded by you guys and give \nyou something back for it, on top of our videos.  "
        },
        {
            "start": "270.18",
            "dur": "5.1",
            "text": "YouTube ads are a crucial part of our funding \nas well, but they are not within our control."
        },
        {
            "start": "276.12",
            "dur": "5.58",
            "text": "Then there is paid agency work, which we \nstopped doing in 2022 – it accounted for  "
        },
        {
            "start": "281.7",
            "dur": "5.28",
            "text": "9% of our revenue over the last 8 years. A \nlot in the beginning, not much by the end."
        },
        {
            "start": "286.98",
            "dur": "5.1",
            "text": "Then there are commercial sponsors \nadvertising products -they accounted  "
        },
        {
            "start": "292.08",
            "dur": "4.38",
            "text": "for 12% of our revenue. We also \ngot about 7% from German Public  "
        },
        {
            "start": "296.46",
            "dur": "4.08",
            "text": "Broadcasting for the German Channel, \nbut ended this partnership in 2022."
        },
        {
            "start": "301.38",
            "dur": "5.16",
            "text": "Finally there are institutional sponsors \nrepresenting about 10%. Some people take  "
        },
        {
            "start": "306.54",
            "dur": "4.44",
            "text": "issue with this – especially Bill Gates has come \nunder public scrutiny, and we’ve been criticised  "
        },
        {
            "start": "310.98",
            "dur": "5.46",
            "text": "for even working with organisations funded by \nhim. So let us look at this 10% in more detail:"
        },
        {
            "start": "317.1",
            "dur": "3.84",
            "text": "About 3% of our revenue over the \nlast eight years came from the Gates  "
        },
        {
            "start": "320.94",
            "dur": "3.96",
            "text": "organisations for a wide variety \nof topics, often suggested by us."
        },
        {
            "start": "325.74",
            "dur": "6.06",
            "text": "5% comes from Open Philanthropy and is only \nused for specific projects. With these funds,  "
        },
        {
            "start": "331.8",
            "dur": "5.88",
            "text": "we have started Arabic, Hindi, Korean, Japanese, \nPortuguese, and French channels, bringing more  "
        },
        {
            "start": "337.68",
            "dur": "5.64",
            "text": "free science content to more people. Then there is \na two-year funding for original Tik Tok content,  "
        },
        {
            "start": "343.32",
            "dur": "4.26",
            "text": "which gives us freedom to explore and learn \nhow to do short form science communication."
        },
        {
            "start": "348.3",
            "dur": "5.52",
            "text": "The final 2% came from other organisations \nlike the red cross or the UN for example."
        },
        {
            "start": "354.54",
            "dur": "3.84",
            "text": "We choose institutional sponsors \ncarefully but if organisations  "
        },
        {
            "start": "358.38",
            "dur": "3.72",
            "text": "want to fund videos that help us spread \nquality information about relevant topics,  "
        },
        {
            "start": "362.1",
            "dur": "5.1",
            "text": "this is an easy yes for us, if we have \nthe capacity for it. On top of that,  "
        },
        {
            "start": "367.2",
            "dur": "3.72",
            "text": "the institutional sponsors we are \nworking with align with our values."
        },
        {
            "start": "371.52",
            "dur": "5.22",
            "text": "We have contracts with every grant giver or \nsponsor that bars them from editorial influence,  "
        },
        {
            "start": "376.74",
            "dur": "3.96",
            "text": "other than suggesting topic areas like \n“global health” or “climate change”.  "
        },
        {
            "start": "381.42",
            "dur": "4.8",
            "text": "We agree on video topics together, but \nsponsors can neither influence details, nor  "
        },
        {
            "start": "386.22",
            "dur": "6.48",
            "text": "our conclusions. The final decision always remains \nwith us. And usually, we develop the topics of the  "
        },
        {
            "start": "392.7",
            "dur": "4.44",
            "text": "videos autonomously and tell the sponsor what \nwe are doing afterwards. If you are interested  "
        },
        {
            "start": "397.14",
            "dur": "4.44",
            "text": "in how we research our videos in detail, our \nhead of research wrote an article about it."
        },
        {
            "start": "401.58",
            "dur": "6",
            "text": "Running an educational youtube channel is a \nbalancing act that we take very seriously. We  "
        },
        {
            "start": "407.58",
            "dur": "5.82",
            "text": "are doing our best to maintain this balance, \nadjusting whenever necessary. As a team and  "
        },
        {
            "start": "413.4",
            "dur": "4.56",
            "text": "company we want to grow to give more people \naccess to a science based outlook on the world."
        },
        {
            "start": "417.96",
            "dur": "5.2",
            "text": "This brings us to our final topic \n– why are we doing Kurzgesagt?"
        },
        {
            "start": "423.72",
            "dur": "2.04",
            "text": "Our Values and Our Vision"
        },
        {
            "start": "427.02",
            "dur": "5.64",
            "text": "Our core mission is to spark curiosity. We \nwant to make science and humanism accessible  "
        },
        {
            "start": "432.66",
            "dur": "5.1",
            "text": "for as many people as possible. The effort \nwe put into creating our videos is a way of  "
        },
        {
            "start": "437.76",
            "dur": "5.28",
            "text": "achieving that – our videos are beautiful \nbecause that helps to spark curiosity,  "
        },
        {
            "start": "443.04",
            "dur": "4.44",
            "text": "to understand complex topics, and because \nit just feels good to create and watch."
        },
        {
            "start": "448.26",
            "dur": "4.86",
            "text": "Our research is as intensive as it is \nso our videos are a good simplification  "
        },
        {
            "start": "453.12",
            "dur": "5.04",
            "text": "of very complicated topics. We want \nto make people excited about science  "
        },
        {
            "start": "458.16",
            "dur": "4.8",
            "text": "so they rediscover subjects they hated \nin school and see how amazing they are."
        },
        {
            "start": "462.96",
            "dur": "6.18",
            "text": "On top of curiosity, we want to inspire long term \nthinking and a positive, constructive outlook.  "
        },
        {
            "start": "469.98",
            "dur": "5.88",
            "text": "Being optimistic about the future of humanity \nis not mainstream and we think this is horrible.  "
        },
        {
            "start": "475.86",
            "dur": "4.86",
            "text": "Pessimism often sounds smart and \ngets more views while optimism can  "
        },
        {
            "start": "480.72",
            "dur": "3.66",
            "text": "sound naive but this is a bias that \nis not helpful for us as a species.  "
        },
        {
            "start": "485.28",
            "dur": "4.74",
            "text": "So despite the gloominess of many topics, \nwe want to approach them with informed and  "
        },
        {
            "start": "490.02",
            "dur": "4.56",
            "text": "well researched optimism – not brushing \nhumanity's very real challenges aside,  "
        },
        {
            "start": "494.58",
            "dur": "5.58",
            "text": "but also not falling into the trap of pessimism. \nWe want to inspire you to dream a little about  "
        },
        {
            "start": "500.16",
            "dur": "5.04",
            "text": "the glorious future that we could actually \nbuild – but only if we believe it is possible."
        },
        {
            "start": "505.2",
            "dur": "6.6",
            "text": "In the long run we don’t only want to do this \non Youtube. The idea is for Kurzgesagt to be a  "
        },
        {
            "start": "511.8",
            "dur": "5.04",
            "text": "positive influence across more media. On our \nTik Tok channel, in the long form content we  "
        },
        {
            "start": "516.84",
            "dur": "5.16",
            "text": "are exploring, in apps, in the VR game that will \nbe released later this year and the games we plan  "
        },
        {
            "start": "522",
            "dur": "6",
            "text": "to make in the future. Our shop is a central part \nof this vision: we start our stories with a video  "
        },
        {
            "start": "528",
            "dur": "1.98",
            "text": "and end them with a pos\nter."
        },
        {
            "start": "529.98",
            "dur": "5.94",
            "text": "There are so many things we want to do. And \nthanks to you watching this right now, we have  "
        },
        {
            "start": "535.92",
            "dur": "4.98",
            "text": "the freedom to work to the best of our knowledge \nand ability. In the end, we hope you like what  "
        },
        {
            "start": "540.9",
            "dur": "5.4",
            "text": "we offer and that we will be doing something \nworthwhile for as long as we exist. And hopefully,  "
        },
        {
            "start": "546.3",
            "dur": "6",
            "text": "we’ll have a lasting impact by making science and \nlearning more fun for as many people as possible."
        },
        {
            "start": "553.02",
            "dur": "5.1",
            "text": "If you personally want to help us do this, you can \nwatch and share our videos, check out our shop,  "
        },
        {
            "start": "558.12",
            "dur": "5.52",
            "text": "become a patreon or give us an ad blocker \nexception. We exist because of you and  "
        },
        {
            "start": "563.64",
            "dur": "5.4",
            "text": "you have no idea how much we appreciate that \nyou are here. And hopefully we are less of a  "
        },
        {
            "start": "569.04",
            "dur": "6.06",
            "text": "black box now. In any case. Doing Kurzgesagt \nfor a decade has been a pretty crazy ride.  "
        },
        {
            "start": "576",
            "dur": "5.04",
            "text": "So from the whole team – Thank you so \nmuch for being with us all these years."
        }
    ]);

    const fetchVideoDetails = async (videoID, lang = 'en') => {
        console.log('video')
        // try {
        //     const videoDetails = await getVideoDetails({ videoID, lang });
        //     if (videoDetails) {
        //         console.log(videoDetails.subtitles)
        //         setSubtitles(videoDetails.subtitles)
        //     }
        // } catch (error) {
        //     console.error('Error fetching video details:', error);
        // }
    };

    // const changeStyles = () => {
    //     setStyles(styles + " font-mono")
    // }

    const handleLogout = () => {
        localStorage.setItem("logged_in", "false")
        localStorage.removeItem('ceramic:did_seed')
        localStorage.removeItem('ceramic:eth_did')
        localStorage.removeItem('did')
        localStorage.removeItem('ceramic:auth_type')
        window.location.reload();
        console.log('logged out')
    }

    const refresh = () => {
        window.location.reload();
    }

    function syncVideo() {
        const video = document.querySelector('.html5-main-video');
        if (video) {
            const videoTime = video.currentTime;
            return videoTime
        }
    }

    const injectSyncVideo = (currentTabId) => {
        const newIntervalId = setInterval(async () => {
            const result = await chrome.scripting.executeScript({
                target: { tabId: currentTabId },
                func: syncVideo,
            })
            setCurrentTime(result[0].result)
            //Even when the video is paused this is still being called
        }, 1000);
        setIntervalId(newIntervalId)
    }


    function capture() {
        const videoElement = document.querySelector('.html5-main-video');
        const videoTime = videoElement.currentTime;
        if (!videoElement) {
            console.log('no video found')
            return
        }
        let canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL()
        return { dataUrl: dataUrl, videoTime: videoTime }
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const getScreenshotYoutube = async () => {
        const { id, url } = currentTab
        if (url.indexOf("youtube.com/watch?v=") === -1) {
            console.log('Not a youtube video')
            return
        }

        try {
            const screenshot = await chrome.scripting.executeScript({
                target: { tabId: id },
                func: capture,
            });

            const canvasDataUrl = screenshot[0].result.dataUrl
            const canvasVideoTime = screenshot[0].result.videoTime

            const canvasBlob = dataURLtoBlob(canvasDataUrl)

            let canvasForm = new FormData()
            const file = new File([canvasBlob], `image.jpg`, { type: 'image/jpeg' });
            canvasForm.set('canvasFile', file, 'screenshot.jpg')

            const res = await fetch('http://localhost:3000/api/uploadImage', {
                method: 'POST',
                body: canvasForm,
            })
            if (!res.ok) {
                throw new Error('Server responded with an error: ' + res.status);
            }
            const data = await res.json();
            //data = {rootCid: rootCid}
            return { videoTime: canvasVideoTime, cid: data.rootCid }
        } catch (error) {
            console.error(error);
        }
    }

    const createNewYoutubeResource = async () => {
        const youtubeObj = await getScreenshotYoutube()
        //youtubeObj = { cid: rootCid }
        const { cid } = youtubeObj
        const clientMutationId = composeClient.id
        const date = new Date().toISOString()

        const res = await fetch('http://localhost:3000/api/createNewYoutubeResource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientMutationId: clientMutationId,
                url: currentTab.url,
                title: currentTab.title,
                createdAt: date,
                updatedAt: date,
                cid: cid
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }
        const data = await res.json();
        return data.newResourceId.data.createIcarusResource.document.id
    }

    const ADD_NOTE = gql`
    mutation ADD_NOTE($input: CreateCardInput!) {
        createCard(input: $input) {
          document {
            id
          }
        }
      }`

    const [addNote, { data, loading, error }] = useMutation(ADD_NOTE, {
        // onCompleted: () => setOpenAddNote(false)
        //To do: need to show some notification that it worked here. 
    });

    const addScreenshotNote = async () => {
        let newYoutubeResourceId = currentResourceId
        if (!currentResourceId) {
            newYoutubeResourceId = await createNewYoutubeResource()
            setCurrentResourceId(newYoutubeResourceId)
        }

        const screenshotObj = await getScreenshotYoutube()
        const { videoTime, cid } = screenshotObj

        addNote({
            variables: {
                input: {
                    content: {
                        createdAt: date,
                        updatedAt: date,
                        resourceId: newYoutubeResourceId,
                        cid: cid,
                        // videoTime: videoTime
                    }
                }
            }
        })
    }

    const showNotesPanel = () => {
        if (showNotes) {
            injectSyncVideo(currentTabId)
        } else {
            clearInterval(intervalId)
        }
        setShowNotes(!showNotes)

    }

    useEffect(() => {
        fetchVideoDetails(videoID, lang);
        injectSyncVideo(currentTabId);
    }, [])

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <div id='subtitle-container' >
            <div id='youtube-panel-menu' className='flex justify-center my-5'>
                <div className='fixed top-0'>
                    <button type="button" title='Change Panel' onClick={() => showNotesPanel()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        {showNotes ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H20.0049ZM8 4H6V20H8V4ZM20 4H10V20H20V4Z"></path></svg>
                        }
                    </button>
                    <button type="button" title='Add Note' onClick={() => setYoutubeOpenAddNote(!openYoutubeAddNote)} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z"></path></svg>
                    </button>
                    <button type="button" title='Youtube Screenshot' onClick={() => addScreenshotNote()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'>
                            <path d="M9.82843 5L7.82843 7H4V19H20V7H16.1716L14.1716 5H9.82843ZM9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7L9 3ZM12 18C8.96243 18 6.5 15.5376 6.5 12.5C6.5 9.46243 8.96243 7 12 7C15.0376 7 17.5 9.46243 17.5 12.5C17.5 15.5376 15.0376 18 12 18ZM12 16C13.933 16 15.5 14.433 15.5 12.5C15.5 10.567 13.933 9 12 9C10.067 9 8.5 10.567 8.5 12.5C8.5 14.433 10.067 16 12 16Z"></path>
                        </svg>
                    </button>
                    <button type="button" title='Refresh' onClick={() => refresh()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path></svg>
                    </button>
                    <button type="button" title='Logout' onClick={() => handleLogout()} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-3 h-3'><path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path></svg>
                    </button>
                </div>
            </div>
            {openYoutubeAddNote ?
                <div className='border-2 rounded fixed p-6 w-full bg-gray-100'>
                    <YoutubeAddNote
                        currentTab={currentTab}
                        youtubeId={youtubeId}
                        currentResourceId={currentResourceId}
                        setCurrentResourceId={setCurrentResourceId}
                        createNewYoutubeResource={createNewYoutubeResource}
                        setYoutubeOpenAddNote={setYoutubeOpenAddNote} />
                </div>
                : null
            }
            <div id='youtube-panel-content'>
                {showNotes ?
                    <YoutubeNotes /> :
                    <YoutubeCaptionsList
                        subtitles={subtitles}
                        styles={styles}
                        currentTabId={currentTab.id}
                        currentTime={currentTime}
                    />}
            </div>
        </div>
    )
}
