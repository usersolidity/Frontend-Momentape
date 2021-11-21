import { useRouter } from "next/router";

import { Base } from "../templates/Base";
import { VerticalFeatures } from "../components";
import { VariantType } from "../components/ButtonUI";
import { Creator } from "../utils/AuthContext";

import { ButtonUI } from "../components";
import { useEffect, useState } from "react";

type LiveStream = {
    id: string;
    streamId: string;
    creatorId: string;
    name: string;
    date: string;
    cover: string;
    keyPrice: string;
    livepeerId: string;
    createdAt: number;
    isActive: boolean;
};

const Index = () => {
    const router = useRouter();
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
                    {creators.map((creator, i: number) => (
                        <div className="w-1/4 p-2" key={i}>
                            <img
                                src={
                                    creator.pfp
                                        ? creator.pfp.replace(
                                              "ipfs://",
                                              "https://ipfs.infura.io/ipfs/"
                                          )
                                        : `https://via.placeholder.com/96x96?text=PFP+Not+Set`
                                }
                                alt={creator.artistName}
                                style={{ width: "100%", height: "200px" }}
                                className="object-cover"
                            />
                            <div className="bg-main-100 p-4">
                                <div className="flex justify-between mb-3">
                                    <p className="text-white uppercase font-light">
                                        {creator.artistName}
                                    </p>
                                </div>
                                <p className="text-white font-light">
                                    {creator.description}
                                </p>
                                <ButtonUI
                                    variant={VariantType.outlinedWhite}
                                    onClick={() =>
                                        router.push({
                                            pathname: "/[creatorId]",
                                            query: {
                                                creatorId: creator.id,
                                            },
                                        })
                                    }
                                >
                                    Go
                                </ButtonUI>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="container p-6">
                <h2>Next Drop</h2>
                <p>What will you find here ?</p>

                <div className="flex flex-wrap">
                    {streams.map((stream, i: number) => (
                        <div className="w-1/4 p-2" key={i}>
                            <img
                                src={
                                    stream.cover
                                        ? stream.cover.replace(
                                              "ipfs://",
                                              "https://ipfs.infura.io/ipfs/"
                                          )
                                        : `https://via.placeholder.com/400x400?text=Stream+Cover+Not+Set`
                                }
                                alt={stream.name}
                                style={{ width: "100%", height: "200px" }}
                                className="object-cover"
                            />
                            <div className="bg-main-100 p-4">
                                <div className="flex justify-between mb-3">
                                    <p className="text-white uppercase font-light">
                                        {stream.name}
                                    </p>
                                </div>
                                <p className="text-white font-light">
                                    Date:{" "}
                                    {new Date(stream.date).toLocaleString()}
                                </p>
                                <ButtonUI
                                    variant={VariantType.outlinedWhite}
                                    onClick={() =>
                                        router.push({
                                            pathname: "/[creatorId]/[streamId]",
                                            query: {
                                                creatorId: stream.creatorId,
                                                streamId: stream.streamId,
                                            },
                                        })
                                    }
                                >
                                    Go
                                </ButtonUI>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Base>
    );
};

export default Index;
