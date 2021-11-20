import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthContext, Creator } from "../../utils/AuthContext";

import { CeramicApi } from "@ceramicnetwork/common";
import { Core } from "@self.id/core";
import { TileLoader } from "@glazed/tile-loader";
import modelAliases from "../../data/model.json";

import { Base } from "../../templates/Base";
import { CreatorContent } from "../../components";
import { ButtonUI } from "../../components";

type LiveStream = {
    id: string;
    name: string;
    date: string;
    cover: string;
    livepeerId: string;
    createdAt: number;
    isActive: boolean;
};
const core = new Core({
    ceramic: "testnet-clay-gateway",
    model: modelAliases,
});
const loader = new TileLoader({
    ceramic: core.ceramic as unknown as CeramicApi,
});

const Creator = () => {
    const router = useRouter();
    const { creatorProfile } = useAuthContext();
    const [creator, setCreator] = useState<Creator>();
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>();

    useEffect(() => {
        const creatorId = router.query.creatorId;
        if (!creatorId) {
            return;
        }

        async function load() {
            const DID = await core.toDID("did:3:" + creatorId);
            if (creatorId === creatorProfile.id) {
                setCreator(creatorProfile);
            } else {
                setCreator({
                    ...(await core.get("creator", DID)),
                    id: "" + creatorId,
                });
            }

            Promise.all([
                core.get("cryptoAccounts", DID),
                core.get("contents", DID),
            ]).then(async ([cryptoAccounts, { contents }]) => {
                console.log("cryptoAccounts", cryptoAccounts);
                const liveStreamsDocs = await Promise.all(
                    contents.map((content: string) => loader.load(content))
                );
                const liveStreams = await Promise.all(
                    liveStreamsDocs.map(async (liveStream: any) => {
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
                        return {
                            ...(await res.json()),
                            ...liveStream.state.content,
                            id: liveStream.id.toString(),
                        };
                    })
                );
                setLiveStreams(liveStreams);
            });
        }

        load();
    }, [router.query]);

    const ethAddress = "0xFE92A2bbA39CdF36b53Cab3C8e6cC61bE9710eF6";

    return (
        <Base>
            {creator && liveStreams ? (
                <div>
                    <p>
                        <strong>Bio: {creator.description}</strong>
                    </p>
                    <p>
                        <strong>YouTube: {creator.youtube}</strong>
                    </p>
                    <p>
                        <ButtonUI
                            onClick={() =>
                                router.push({
                                    pathname: "/[creatorId]/newStream",
                                    query: {
                                        creatorId: creator.id,
                                    },
                                })
                            }
                        >
                            New stream
                        </ButtonUI>
                    </p>
                    <CreatorContent
                        imgPath={{
                            cover: creator.cover
                                ? creator.cover.replace(
                                      "ipfs://",
                                      "https://ipfs.infura.io/ipfs/"
                                  )
                                : `https://via.placeholder.com/1000x300?text=Cover+Not+Set`,
                            profile: creator.pfp
                                ? creator.pfp.replace(
                                      "ipfs://",
                                      "https://ipfs.infura.io/ipfs/"
                                  )
                                : `https://via.placeholder.com/96x96?text=PFP+Not+Set`,
                        }}
                        name={creator.artistName || ""}
                        ethAddress={ethAddress}
                        content={liveStreams.map((liveStream) => ({
                            title: liveStream.name,
                            imgPath: liveStream.cover
                                ? liveStream.cover.replace(
                                      "ipfs://",
                                      "https://ipfs.infura.io/ipfs/"
                                  )
                                : `https://via.placeholder.com/400x400?text=Stream+Cover+Not+Set`,
                            price: 0,
                            creatorId: creator.id || "",
                            streamId: liveStream.id,
                            date: liveStream.date,
                        }))}
                    />{" "}
                </div>
            ) : (
                "Loading..."
            )}
        </Base>
    );
};

export default Creator;
