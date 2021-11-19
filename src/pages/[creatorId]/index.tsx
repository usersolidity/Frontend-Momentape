// import { useRouter } from "next/router";

import { Core } from "@self.id/core";
import modelAliases from "../../data/model.json";

import { Base } from "../../templates/Base";
import { CreatorContent } from "../../components";
import { IContentItemProps } from "../../components/CreatorContent/ContentItem";
// import { useEffect, useRef } from "react";

export type Creator = {
    artistName: string;
    description: string;
    pfp: string;
    cover: string;
    id: string;
};
const core = new Core({
    ceramic: "testnet-clay-gateway",
    model: modelAliases,
});
export async function getServerSideProps(context: any) {
    const creatorId = context.params.creatorId;
    const DID = await core.toDID("did:3:" + creatorId);
    const [cryptoAccounts, creator] = await Promise.all([
        core.get("cryptoAccounts", DID),
        core.get("creator", DID),
    ]);
    return {
        props: {
            creator: {
                ...creator,
                did: creatorId,
            },
            cryptoAccounts,
        },
    };
}

const Creator = ({
    creator,
    cryptoAccounts,
}: {
    creator: Creator;
    cryptoAccounts: any;
}) => {
    // const router = useRouter();
    console.log(cryptoAccounts);

    const profileIMG = creator.pfp
        ? creator.pfp.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
        : `https://via.placeholder.com/96x96?text=PFP+Not+Set`;
    const coverIMG = creator.cover
        ? creator.cover.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
        : `https://via.placeholder.com/1000x300?text=Cover+Not+Set`;
    const ethAddress = "0xFE92A2bbA39CdF36b53Cab3C8e6cC61bE9710eF6";
    const content: IContentItemProps[] = [
        {
            title: "example",
            imgPath: `/assets/images/photo-2.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-1.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-2.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-1.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-1.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-2.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-1.jpg`,
            price: 1000,
        },
        {
            title: "example",
            imgPath: `/assets/images/photo-1.jpg`,
            price: 1000,
        },
    ];
    return (
        <Base>
            <strong>Bio: {creator.description}</strong>
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
