import { useReducer, useRef, useState } from "react";

import { ButtonUI } from "../components";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { uploadResizedImage, loadImage } from "@self.id/image-utils";
import type { SelfID } from "@self.id/web";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";
import modelAliases from "../data/model.json";
import { CeramicApi } from "@ceramicnetwork/common";

// var stream = await fetch('https://livepeer.com/api/stream/80f1938a-afd4-44ce-a8ef-de4fa7667ab6', {
//   headers: {
//     'Authorization': 'Bearer fdf8f2c0-ba4d-4e4f-be66-7d40ad261a4e'
//   }
// })

const Luca = () => {
    const selfId = useRef<SelfID>();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null);
    const [selectedPFP, setSelectedPFP] = useState(null);
    const [DID, setDID] = useState("");
    const initialCreatorProfile = {
        name: "",
        artistName: "",
        description: "",
        pfp: "",
    };
    const [creatorProfile, dispatchCreatorProfileChange] = useReducer(
        (curVals: any, newVals: any) => ({ ...curVals, ...newVals }),
        initialCreatorProfile
    );
    async function authenticate() {
        setLoading(true);
        const [address] = await (window as any).ethereum.enable();
        setAddress(address);

        const { EthereumAuthProvider, SelfID, WebClient } = await import(
            "@self.id/web"
        );
        const client = new WebClient({
            ceramic: "testnet-clay",
            model: modelAliases,
        });
        if (address) {
            const ethAuthProvider = new EthereumAuthProvider(
                (window as any).ethereum,
                address
            );

            const [did, link] = await Promise.all([
                client.authenticate(ethAuthProvider, true),
                Caip10Link.fromAccount(
                    client.ceramic as unknown as CeramicApi,
                    await ethAuthProvider.accountId(),
                    { pin: true }
                ),
            ]);
            setDID(did.id);

            if (!link.did) {
                link.setDid(did, ethAuthProvider, { pin: true });
            }

            selfId.current = new SelfID({ client, did });
            const creator = await selfId.current.get("creator");
            if (creator) {
                console.log(creator, did.id);
                dispatchCreatorProfileChange(creator);
            }
        }
        setLoading(false);
    }
    async function saveCreatorProfile() {
        setLoading(true);
        if (selectedPFP) {
            const imageFile = new File([selectedPFP], "pfp");
            const image = await loadImage(imageFile);
            const imageData = await uploadResizedImage(
                "https://ipfs.infura.io:5001/api/v0",
                imageFile.type,
                image,
                { width: 100, height: 100 }
            );
            dispatchCreatorProfileChange({ pfp: imageData.src });
            creatorProfile.pfp = imageData.src;
            setSelectedPFP(null);
        }
        await selfId.current?.set("creator", creatorProfile);

        await selfId.current?.set("cryptoAccounts", []);
        setLoading(false);
    }
    async function importFromYouTube() {
        const gapi: any = await new Promise((resolve) => {
            const element = document.getElementsByTagName("script")[0];
            if (element) {
                const js = document.createElement("script");
                js.id = "google-api";
                js.src = "//apis.google.com/js/api.js";
                js.async = true;
                js.defer = true;
                element.parentNode?.insertBefore(js, element);
                js.onload = async () => {
                    const gapi = (window as any).gapi;
                    gapi.load("client", () => resolve(gapi));
                };
            }
        });
        try {
            await gapi.client.init({
                apiKey: "AIzaSyD1k6nGbTW9iUGLdVYM_v3XLdvJLTxUgNg",
                scope: "https://www.googleapis.com/auth/youtube.readonly",
                clientId:
                    "732770340547-b4ovccv04ehbeptri2frjlh7l5tbg5kk.apps.googleusercontent.com",
            });
        } catch (error) {}
        const oAuth2 = gapi.auth2.getAuthInstance();
        const isSignedIn = oAuth2.isSignedIn.get();
        console.log("isSignedIn", isSignedIn);
        if (isSignedIn) {
            const channels = await gapi.client.request({
                path: "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true",
            });
            console.log(channels);
        } else {
            oAuth2.isSignedIn.listen(async (isSignedIn: boolean) => {
                console.log(isSignedIn);
                if (isSignedIn) {
                    const channels = await gapi.client.request({
                        path: "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true",
                    });
                    console.log(channels);
                }
            });
            oAuth2.signIn();
        }
    }

    function handleFormChange(event: any) {
        const { name, value } = event.target;
        dispatchCreatorProfileChange({ [name]: value });
    }

    return (
        <div>
            {address ? (
                <Box component="form" noValidate autoComplete="off">
                    <ul>
                        <li>Account address: {address}</li>
                        {loading && <li>Loading...</li>}
                        <li>DID: {DID}</li>
                        <li>
                            <ButtonUI onClick={importFromYouTube}>
                                Import from YouTube
                            </ButtonUI>
                        </li>
                        <li>
                            <img
                                src={creatorProfile.pfp.replace(
                                    "ipfs://",
                                    "https://ipfs.infura.io/ipfs/"
                                )}
                                width="50"
                            />
                        </li>
                        <li>
                            Name{" "}
                            <TextField
                                name="name"
                                value={creatorProfile.name}
                                onChange={handleFormChange}
                            />
                        </li>
                        <li>
                            Artist name{" "}
                            <TextField
                                name="artistName"
                                value={creatorProfile.artistName}
                                onChange={handleFormChange}
                            />
                        </li>
                        <li>
                            Short bio{" "}
                            <TextField
                                name="description"
                                value={creatorProfile.description}
                                multiline
                                onChange={handleFormChange}
                            />
                        </li>
                        <li>
                            {selectedPFP && (
                                <img
                                    src={URL.createObjectURL(selectedPFP)}
                                    width="100"
                                />
                            )}
                            <input
                                accept="image/png, image/jpeg"
                                type="file"
                                onChange={(e: any) =>
                                    setSelectedPFP(e.target.files[0])
                                }
                            />
                        </li>
                        <li>
                            <ButtonUI onClick={saveCreatorProfile}>
                                Save
                            </ButtonUI>
                        </li>
                    </ul>
                </Box>
            ) : (
                <ButtonUI onClick={authenticate}>Authenticate</ButtonUI>
            )}
        </div>
    );
};

export default Luca;
