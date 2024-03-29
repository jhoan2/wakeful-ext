
export default function CardImage({ cid }) {

    if (!cid) return

    return (
        <div>
            <img
                src={`https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/${cid}?img-width=240`}
                alt="Image"
                loading='lazy'
                width={240}
            />
        </div>
    )
}
