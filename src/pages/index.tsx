import { Base } from "../templates/Base";
import { VerticalFeatures } from "../components";
import ContentItem from "../components/CreatorContent/ContentItem";
import { Creator } from "../utils/AuthContext";

import { CeramicApi } from "@ceramicnetwork/common";
import { Core } from "@self.id/core";
import { TileLoader } from "@glazed/tile-loader";
import modelAliases from "../data/model.json";
import { useEffect, useState } from "react";

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

const Index = () => {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [streams, setStreams] = useState<LiveStream[]>([]);
    useEffect(() => {
        async function load() {
            const [creatorsList, streamsList] = await Promise.all([
                fetch(
                    process.env.NEXT_PUBLIC_API_URL + "/api/getCreators"
                ).then((res) => res.json()),
                fetch(process.env.NEXT_PUBLIC_API_URL + "/api/getStreams").then(
                    (res) => res.json()
                ),
            ]);
            setCreators(creatorsList);
            setStreams(streamsList);
        }
        load();
    }, []);
    return (
        <Base>
            <VerticalFeatures />
            <div className="container p-6">
                <h2>You are a fan</h2>
                <p>Welcome into your new livestream word</p>

                <div className="flex flex-wrap">
                    {creators.map((item: any, i: number) => (
                        <ContentItem
                            imgPath={item.imgPath}
                            title={item.title}
                            price={item.price}
                            streamId={item.streamId}
                            date={item.date}
                            creatorId={item.creatorId}
                            key={i}
                        />
                    ))}
                </div>
            </div>
            <div className="container p-6">
                <h2>Next Drop</h2>
                <p>What will you find here ?</p>

                <div className="flex flex-wrap">
                    {streams.map((item: any, i: number) => (
                        <ContentItem
                            imgPath={item.imgPath}
                            title={item.title}
                            price={item.price}
                            streamId={item.streamId}
                            date={item.date}
                            creatorId={item.creatorId}
                            key={i}
                        />
                    ))}
                </div>
            </div>
        </Base>
    );
};

export default Index;
