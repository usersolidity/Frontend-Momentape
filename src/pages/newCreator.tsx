import { useState } from "react";
import Link from "next/link";

import { useAuthContext } from "../utils/AuthContext";

import { ButtonUI } from "../components";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { uploadResizedImage, loadImage } from "@self.id/image-utils";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";
import modelAliases from "../data/model.json";
import { CeramicApi } from "@ceramicnetwork/common";

const Luca = () => {
    const { selfId, address, setAddress, creatorProfile, setCreatorProfile } =
        useAuthContext();
    const [loading, setLoading] = useState(false);
    const [selectedPFP, setSelectedPFP] = useState(null);
    const [selectedCover, setSelectedCover] = useState(null);
    const [youtubeImported, setYouTubeImported] = useState(false);

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

            if (selfId) {
                selfId.current = new SelfID({ client, did });
                const creator = await selfId.current.get("creator");
                if (creator) {
                    setCreatorProfile({
                        ...creator,
                        id: did.id.replace("did:3:", ""),
                    });
                }
            }

            Caip10Link.fromAccount(
                client.ceramic as unknown as CeramicApi,
                await ethAuthProvider.accountId(),
                { pin: true }
            ).then((link) => {
                if (!link.did) {
                    link.setDid(did, ethAuthProvider, { pin: true });
                }
            });
        }
        setLoading(false);
    }
    async function saveCreatorProfile() {
        setLoading(true);
        if (selectedPFP) {
            const pfp = await uploadImageToIPFS(selectedPFP, 100, 100);
            setCreatorProfile({ pfp });
            creatorProfile.pfp = pfp;
            setSelectedPFP(null);
        }
        if (selectedCover) {
            const cover = await uploadImageToIPFS(selectedCover, 640, 312);
            setCreatorProfile({ cover });
            creatorProfile.cover = cover;
            setSelectedCover(null);
        }
        if (selfId) {
            await selfId.current?.set("creator", creatorProfile);
        }
        setLoading(false);
    }

    async function uploadImageToIPFS(
        image: any,
        width: number,
        height: number
    ) {
        const imageFile = new File([image], "pfp");
        const imageData = await uploadResizedImage(
            "https://ipfs.infura.io:5001/api/v0",
            imageFile.type,
            await loadImage(imageFile),
            { width, height }
        );
        return imageData.src;
    }
    async function setYouTubeChannelOnProfile(gapi: any) {
        const res = await gapi.client.request({
            path: "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings&mine=true",
        });
        const channel = res.result.pageInfo.totalResults
            ? res.result.items[0]
            : null;
        if (channel) {
            try {
                const response = await fetch(
                    channel.snippet.thumbnails.default.url
                );
                const pfp = await uploadImageToIPFS(
                    await response.blob(),
                    100,
                    100
                );
                setCreatorProfile({ pfp });
            } catch (error) {}
            try {
                const response = await fetch(
                    channel.brandingSettings.image.bannerExternalUrl
                );
                const cover = await uploadImageToIPFS(
                    await response.blob(),
                    640,
                    312
                );
                setCreatorProfile({ cover });
            } catch (error) {}
            setCreatorProfile({
                artistName:
                    channel.brandingSettings?.channel?.title ||
                    channel.snippet.title,
                description: channel.snippet.description,
                youtube:
                    "https://youtube.com/" +
                    (channel.snippet.customUrl || "channel/" + channel.id),
            });
            setYouTubeImported(true);
        }
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
        if (isSignedIn) {
            setYouTubeChannelOnProfile(gapi);
        } else {
            oAuth2.isSignedIn.listen(async (isSignedIn: boolean) => {
                if (isSignedIn) {
                    setYouTubeChannelOnProfile(gapi);
                }
            });
            oAuth2.signIn();
        }
    }

    function handleFormChange(event: any) {
        const { name, value } = event.target;
        setCreatorProfile({ [name]: value });
    }

    return (
        <div>
            {address ? (
                <Box component="form" noValidate autoComplete="off">
                    <ul>
                        <li>Account address: {address}</li>
                        {loading && <li>Loading...</li>}
                        <li>DID: {selfId?.current?.id}</li>
                        {!youtubeImported && (
                            <li>
                                <ButtonUI onClick={importFromYouTube}>
                                    Import from YouTube
                                </ButtonUI>
                            </li>
                        )}
                        <li>
                            PFP{" "}
                            <img
                                src={creatorProfile.pfp?.replace(
                                    "ipfs://",
                                    "https://ipfs.infura.io/ipfs/"
                                )}
                                width="50"
                            />
                        </li>
                        <li>
                            Cover{" "}
                            <img
                                src={creatorProfile.cover?.replace(
                                    "ipfs://",
                                    "https://ipfs.infura.io/ipfs/"
                                )}
                                width="640"
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
                            YouTube channel{" "}
                            <TextField
                                name="youtube"
                                value={creatorProfile.youtube}
                                onChange={handleFormChange}
                            />
                        </li>
                        <li>
                            Change PFP
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
                            Change Cover
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
                            <ButtonUI onClick={saveCreatorProfile}>
                                Save
                            </ButtonUI>
                        </li>
                        <li>
                            <Link
                                href={{
                                    pathname: "/[creatorId]",
                                    query: {
                                        creatorId: selfId?.current?.id.replace(
                                            "did:3:",
                                            ""
                                        ),
                                    },
                                }}
                            >
                                <a>Public page</a>
                            </Link>
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
