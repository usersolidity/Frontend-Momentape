import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Web3Service } from "@unlock-protocol/unlock-js";

import { CeramicApi } from "@ceramicnetwork/common";
import { TileLoader } from "@glazed/tile-loader";
import { Core } from "@self.id/core";
import modelAliases from "../../data/model.json";

import { Base } from "../../templates/Base";
import Video from "../../components/Video";
import { useAuthContext } from "../../utils/AuthContext";

export const rinkeby = {
    unlockAddress: "0xd8c88be5e8eb88e38e6ff5ce186d764676012b0b",
    provider:
        "https://eth-rinkeby.alchemyapi.io/v2/X_uPmnzfP1MG1VS3ddT-0bCecmpckTBS",
    id: 4,
};
interface IWeb3Service {
    [key: string]: any;
    readOnlyProvider: string;
    unlockAddress: string;
    network: number;
}
const web3Service = new Web3Service({
    [rinkeby.id]: rinkeby,
} as unknown as IWeb3Service);

export type Creator = {
    artistName: string;
    pfp: string;
    id: string;
};
export type LiveStream = {
    id: string;
    name: string;
    cover: string;
    description: string;
    livepeerId: string;
    createdAt: number;
    playbackId: string;
    isActive: boolean;
    keyPrice: string;
    lockAddress: string;
    maxNumberOfKeys: number;
    balance: string;
};
const core = new Core({
    ceramic: "testnet-clay-gateway",
    model: modelAliases,
});
const loader = new TileLoader({
    ceramic: core.ceramic as unknown as CeramicApi,
});

const StreamId = () => {
    const router = useRouter();
    const { address } = useAuthContext();
    const [creator, setCreator] = useState<Creator>();
    const [stream, setStream] = useState<LiveStream>();
    const [lockStatus, setLockStatus] = useState("locked");
    const [isLockManager, setIsLockManager] = useState(false);
    const playerRef = useRef(null);

    useEffect(() => {
        const creatorId = router.query.creatorId;
        const streamId = router.query.streamId;
        if (!(creatorId && streamId)) {
            return;
        }

        async function loadData() {
            const [
                creator,
                {
                    state: { content: liveStream },
                },
            ] = await Promise.all([
                core.get("creator", await core.toDID("did:3:" + creatorId)),
                loader.load("ceramic://" + streamId),
            ]);
            setCreator({
                ...creator,
                id: creatorId,
            });
            const res = await fetch(
                "https://livepeer.com/api/stream/" + liveStream.livepeerId,
                {
                    headers: {
                        Authorization:
                            "Bearer fdf8f2c0-ba4d-4e4f-be66-7d40ad261a4e",
                    },
                }
            );
            const livepeerStream = await res.json();
            const lockAddress = liveStream.lockAddress;
            const lock = await web3Service.getLock(lockAddress, rinkeby.id);
            setStream({
                ...lock,
                ...livepeerStream,
                ...liveStream,
            });
            const unlockProtocol: any = await new Promise((resolve) => {
                const element = document.getElementsByTagName("script")[0];
                (window as any).unlockProtocolConfig = {
                    network: rinkeby.id,
                    locks: {
                        [lockAddress]: {
                            network: rinkeby.id,
                            name: lock.name,
                        },
                    },
                    icon: liveStream.cover?.replace(
                        "ipfs://",
                        "https://ipfs.infura.io/ipfs/"
                    ),
                    callToAction: {
                        default: liveStream.description,
                    },
                };
                if (element) {
                    const js = document.createElement("script");
                    js.id = "unlock-paywall";
                    js.src =
                        "https://paywall.unlock-protocol.com/static/unlock.latest.min.js";
                    js.async = true;
                    js.defer = true;
                    element.parentNode?.insertBefore(js, element);
                    js.onload = async () =>
                        resolve((window as any).unlockProtocol);
                }
            });
            window.addEventListener("unlockProtocol.status", (e: any) => {
                console.log("unlockProtocol.status", e.detail.state);
                setLockStatus(e.detail.state);
            });
            window.addEventListener("unlockProtocol.authenticated", (e: any) => {
                console.log("unlockProtocol.authenticated", e.detail);
            });
            const lockState = unlockProtocol.getState();
            console.log("lockState", lockState);
            if (lockState) {
                setLockStatus(lockState);
                if (lockState === "locked") {
                    unlockProtocol && unlockProtocol.loadCheckoutModal();
                }
            }
        }

        loadData();
    }, [router.query]);

    useEffect(() => {
        async function load() {
            if (stream && address) {
                const isLockManager = await web3Service.isLockManager(
                    stream.lockAddress,
                    address,
                    rinkeby.id
                );
                console.log("isLockManager", isLockManager);
                setIsLockManager(isLockManager);
            }
        }
        load();
        console.log(address, stream);
    }, [address, stream]);

    const videoJsOptions = {
        // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: `https://cdn.livepeer.com/hls/${stream?.playbackId}/index.m3u8`,
                // src: `http://localhost:3001/api/hls?livepeerId=${stream?.id}`,
                type: "application/x-mpegURL",
            },
        ],
    };

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;
    };

    return (
        <Base>
            {creator && stream ? (
                <ul>
                    <li>
                        <Link
                            href={{
                                pathname: "/[creatorId]",
                                query: {
                                    creatorId: creator.id,
                                },
                            }}
                        >
                            <a>Artist name: {creator.artistName}</a>
                        </Link>
                    </li>
                    <li>
                        Artist PFP:
                        <img
                            src={
                                creator.pfp
                                    ? creator.pfp.replace(
                                          "ipfs://",
                                          "https://ipfs.infura.io/ipfs/"
                                      )
                                    : `https://via.placeholder.com/96x96?text=PFP+Not+Set`
                            }
                            width="50"
                        />
                    </li>
                    <li>Livepeer playback ID: {stream.playbackId}</li>
                    <li>Created at: {stream.createdAt}</li>
                    <li>Is active: {stream.isActive.toString()}</li>
                    <li>Name: {stream.name}</li>
                    <li>Description: {stream.description}</li>
                    <li>
                        Cover:
                        <img
                            src={stream.cover?.replace(
                                "ipfs://",
                                "https://ipfs.infura.io/ipfs/"
                            )}
                            width="640"
                        />
                    </li>
                    <li>Price: {stream.keyPrice} ETH</li>
                    <li>Maximum keys: {stream.maxNumberOfKeys}</li>
                    {isLockManager && (
                        <li>
                            <strong>Purchased: {stream.balance} ETH</strong>
                        </li>
                    )}
                    {lockStatus === "locked" && !isLockManager ? (
                        <li>Content is locked until you purchase the key</li>
                    ) : (
                        <li>
                            <Video
                                options={videoJsOptions}
                                onReady={handlePlayerReady}
                            />
                        </li>
                    )}
                </ul>
            ) : (
                "Loading..."
            )}
        </Base>
    );
};

export default StreamId;
