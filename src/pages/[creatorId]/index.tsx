import { useRouter } from "next/router";

import { CeramicApi } from "@ceramicnetwork/common";
import { Core } from "@self.id/core";
import { TileLoader } from "@glazed/tile-loader";
import modelAliases from "../../data/model.json";

import { Base } from "../../templates/Base";
import { CreatorContent } from "../../components";
import { IContentItemProps } from "../../components/CreatorContent/ContentItem";
import { ButtonUI } from "../../components";

type Creator = {
    artistName: string;
    description: string;
    youtube: string;
    pfp: string;
    cover: string;
    id: string;
};
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
export async function getServerSideProps(context: any) {
    const creatorId = context.params.creatorId;
    const DID = await core.toDID("did:3:" + creatorId);
    const [cryptoAccounts, creator, { contents }] = await Promise.all([
        core.get("cryptoAccounts", DID),
        core.get("creator", DID),
        core.get("contents", DID),
    ]);
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
    return {
        props: {
            creator: {
                ...creator,
                id: creatorId,
            },
            cryptoAccounts,
            liveStreams,
        },
    };
}

const Creator = ({
    creator,
    // cryptoAccounts,
    liveStreams,
}: {
    creator: Creator;
    cryptoAccounts: any;
    liveStreams: LiveStream[];
}) => {
    const router = useRouter();

    const profileIMG = creator.pfp
        ? creator.pfp.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
        : `https://via.placeholder.com/96x96?text=PFP+Not+Set`;
    const coverIMG = creator.cover
        ? creator.cover.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
        : `https://via.placeholder.com/1000x300?text=Cover+Not+Set`;
    const ethAddress = "0xFE92A2bbA39CdF36b53Cab3C8e6cC61bE9710eF6";
    const content: IContentItemProps[] = liveStreams.map((liveStream) => ({
        title: liveStream.name,
        imgPath: liveStream.cover
            ? liveStream.cover.replace(
                  "ipfs://",
                  "https://ipfs.infura.io/ipfs/"
              )
            : `https://via.placeholder.com/400x400?text=Stream+Cover+Not+Set`,
        price: 0,
        creatorId: creator.id,
        streamId: liveStream.id,
        date: liveStream.date,
    }));
    return (
        <Base>
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
                    cover: coverIMG,
                    profile: profileIMG,
                }}
                name={creator.artistName}
                ethAddress={ethAddress}
                content={content}
            />
        </Base>
    );
};

export default Creator;
