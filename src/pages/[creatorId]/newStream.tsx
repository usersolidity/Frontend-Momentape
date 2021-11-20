import { useReducer, useState } from "react";
import { useRouter } from "next/router";

import { useAuthContext } from "../../utils/AuthContext";
import { uploadResizedImage, loadImage } from "@self.id/image-utils";
import modelAliases from "../../data/model.json";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Base } from "../../templates/Base";
import { ButtonUI } from "../../components";

const NewStream = () => {
    const router = useRouter();
    const { selfId, address, setAddress, creatorProfile, setCreatorProfile } =
        useAuthContext();
    const [loading, setLoading] = useState(false);
    const [selectedCover, setSelectedCover] = useState(null);
    const initialStream = {
        name: "",
        description: "",
        date: new Date(),
        livepeerId: null,
    };
    const [stream, dispatchStreamChange] = useReducer(
        (curVals: any, newVals: any) => ({ ...curVals, ...newVals }),
        initialStream
    );

    const profileIMG = creatorProfile.pfp
        ? creatorProfile.pfp.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
        : `https://via.placeholder.com/96x96?text=PFP+Not+Set`;

    async function authenticate() {
        setLoading(true);

        const [[address], { EthereumAuthProvider, SelfID, WebClient }] =
            await Promise.all([
                (window as any).ethereum.enable(),
                import("@self.id/web"),
            ]);
        setAddress(address);

        if (address) {
            const client = new WebClient({
                ceramic: "testnet-clay",
                model: modelAliases,
            });
            const ethAuthProvider = new EthereumAuthProvider(
                (window as any).ethereum,
                address
            );

            const did = await client.authenticate(ethAuthProvider, true);
            if (
                router.query.creatorId &&
                did.id.includes(router.query.creatorId.toString())
            ) {
                if (selfId) {
                    selfId.current = new SelfID({ client, did });
                    const creator = await selfId.current.get("creator");
                    if (creator) {
                        setCreatorProfile({
                            ...creator,
                            id: did.id.replace(
                                "did:3:",
                                ""
                            )
                        });
                    }
                }
            } else {
                router.push({
                    pathname: "/[creatorId]/newStream",
                    query: { creatorId: did.id.replace("did:3:", "") },
                });
            }
        }
        setLoading(false);
    }
    async function createStream() {
        setLoading(true);

        if (selectedCover) {
            const imageFile = new File([selectedCover], "cover");
            const cover = await uploadResizedImage(
                "https://ipfs.infura.io:5001/api/v0",
                imageFile.type,
                await loadImage(imageFile),
                { width: 640, height: 312 }
            );
            dispatchStreamChange({ cover: cover.src });
            stream.cover = cover.src;
            setSelectedCover(null);
        }

        const res = await fetch("https://livepeer.com/api/stream", {
            headers: {
                Authorization: "Bearer fdf8f2c0-ba4d-4e4f-be66-7d40ad261a4e",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                name: stream.name,
                profiles: [],
            }),
        });
        const livepeerStream = await res.json();
        dispatchStreamChange({ livepeerId: livepeerStream.id });
        stream.livepeerId = livepeerStream.id;

        if (selfId) {
            const [newStream, contentsList] = await Promise.all([
                selfId.current?.client.dataModel.createTile("LiveStream", {
                    description: stream.description,
                    livepeerId: stream.livepeerId,
                    cover: stream.cover,
                    date: stream.date.toISOString(),
                }),
                selfId.current?.get("contents"),
            ]);
            const contents = contentsList?.contents ?? [];
            console.log("contents", contents);
            await selfId.current?.set("contents", {
                contents: [...contents, newStream?.id.toUrl()],
            });
            router.push({
                pathname: "/[creatorId]/[streamId]",
                query: {
                    creatorId: selfId.current?.id.replace("did:3:", ""),
                    streamId: newStream?.id.toString(),
                },
            });
        }

        setLoading(false);
    }

    function handleFormChange(event: any) {
        const { name, value } = event.target;
        dispatchStreamChange({ [name]: value });
    }

    return (
        <Base>
            {address ? (
                <ul>
                    {loading && <li>Loading...</li>}
                    <li>Artist name: {creatorProfile.artistName}</li>
                    <li>
                        Artist PFP:
                        <img src={profileIMG} width="50" />
                    </li>
                    <li>
                        Stream name{" "}
                        <TextField
                            name="name"
                            value={stream.name}
                            onChange={handleFormChange}
                        />
                    </li>
                    <li>
                        Description{" "}
                        <TextField
                            name="description"
                            value={stream.description}
                            multiline
                            onChange={handleFormChange}
                        />
                    </li>
                    <li>
                        Date{" "}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props: any) => (
                                    <TextField {...props} />
                                )}
                                label="DateTimePicker"
                                value={stream.date}
                                onChange={(newValue: any) =>
                                    dispatchStreamChange({ date: newValue })
                                }
                            />
                        </LocalizationProvider>
                    </li>
                    <li>
                        Cover
                        {selectedCover && (
                            <img
                                src={URL.createObjectURL(selectedCover)}
                                width="100"
                            />
                        )}
                        <input
                            accept="image/png, image/jpeg"
                            type="file"
                            onChange={(e: any) =>
                                setSelectedCover(e.target.files[0])
                            }
                        />
                    </li>
                    <li>
                        <ButtonUI onClick={createStream}>
                            Create Livepeer stream
                        </ButtonUI>
                    </li>
                </ul>
            ) : (
                <ButtonUI onClick={authenticate}>Authenticate</ButtonUI>
            )}
        </Base>
    );
};

export default NewStream;
