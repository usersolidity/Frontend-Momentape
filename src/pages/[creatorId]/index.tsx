import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthContext, Creator } from "../../utils/AuthContext";

import { Web3Service } from "@unlock-protocol/unlock-js";

import { CeramicApi } from "@ceramicnetwork/common";
import { Core } from "@self.id/core";
import { TileLoader } from "@glazed/tile-loader";
import modelAliases from "../../data/model.json";

import { Base } from "../../templates/Base";
import { CreatorContent } from "../../components";
import { ButtonUI } from "../../components";

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

type LiveStream = {
    id: string;
    name: string;
    date: string;
    cover: string;
    keyPrice: string;
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
    const { address, creatorProfile } = useAuthContext();
    const [creator, setCreator] = useState<Creator>();
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

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
            ]).then(async ([cryptoAccounts, contents]) => {
                console.log("cryptoAccounts", cryptoAccounts);
                if (!contents) {
                    console.log("No livestreams");
                    return;
                }
                const liveStreamsDocs = await Promise.all(
                    contents.contents.map((content: string) =>
                        loader.load(content)
                    )
                );
                const liveStreams = await Promise.all(
                    liveStreamsDocs.map(async (liveStream: any) => {
                        const [lock, res] = await Promise.all([
                            web3Service.getLock(
                                liveStream.state.content.lockAddress,
                                rinkeby.id
                            ),
                            fetch(
                                "https://momentape-api.vercel.app/api/getStream?livepeerId=" +
                                    liveStream.state.content.livepeerId
                            ),
                        ]);
                        return {
                            ...lock,
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
    }, [creatorProfile, router.query]);

    return (
        <Base>
            {creator ? (
                <div>
                    <p>
                        <strong>Bio: {creator.description}</strong>
                    </p>
                    <p>
                        <strong>YouTube: {creator.youtube}</strong>
                    </p>
                    {creatorProfile.id === creator.id && (
                        <>
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
                            <p>
                                <ButtonUI
                                    onClick={() => router.push("/creator")}
                                >
                                    Edit profile
                                </ButtonUI>
                            </p>
                        </>
                    )}
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
                        ethAddress={address || ""}
                        content={liveStreams.map((liveStream) => ({
                            title: liveStream.name,
                            imgPath: liveStream.cover
                                ? liveStream.cover.replace(
                                      "ipfs://",
                                      "https://ipfs.infura.io/ipfs/"
                                  )
                                : `https://via.placeholder.com/400x400?text=Stream+Cover+Not+Set`,
                            price: liveStream.keyPrice,
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
