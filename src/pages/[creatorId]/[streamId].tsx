import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { CeramicApi } from "@ceramicnetwork/common";
import { TileLoader } from "@glazed/tile-loader";
import { Core } from "@self.id/core";
import modelAliases from "../../data/model.json";

import { Base } from "../../templates/Base";
import Video from "../../components/Video";

export type Creator = {
    artistName: string;
    pfp: string;
    id: string;
};
export type LiveStream = {
    name: string;
    cover: string;
    description: string;
    livepeerId: string;
    createdAt: number;
    playbackId: string;
    isActive: boolean;
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
    const [creator, setCreator] = useState<Creator>();
    const [stream, setStream] = useState<LiveStream>();
    const playerRef = useRef(null);

    useEffect(() => {
        const creatorId = router.query.creatorId;
        const streamId = router.query.streamId;
        if (!(creatorId && streamId)) {
            return
        }

        async function loadData() {
            const [creator, liveStream] = await Promise.all([
                core.get("creator", await core.toDID("did:3:" + creatorId)),
                loader.load("ceramic://" + streamId),
            ]);
            setCreator({
                ...creator,
                id: creatorId,
            });
            const res = await fetch(
                "https://livepeer.com/api/stream/" +
                    liveStream.state.content.livepeerId,
                {
                    headers: {
                        Authorization:
                            "Bearer fdf8f2c0-ba4d-4e4f-be66-7d40ad261a4e",
                    },
                }
            );
            const livepeerStream = await res.json();
            setStream({
                ...livepeerStream,
                ...liveStream.state.content,
            });
        }

        loadData();
    }, [router.query]);

    const videoJsOptions = {
        // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: `https://cdn.livepeer.com/hls/${stream?.playbackId}/index.m3u8`,
                type: "application/x-mpegURL",
            },
        ],
    };

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;

        // you can handle player events here
        player.on("waiting", () => {
            console.log("player is waiting");
        });

        player.on("dispose", () => {
            console.log("player will dispose");
        });
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
                    <li>
                        <Video
                            options={videoJsOptions}
                            onReady={handlePlayerReady}
                        />
                    </li>
                </ul>
            ) : (
                "Loading..."
            )}
        </Base>
    );
};

export default StreamId;
