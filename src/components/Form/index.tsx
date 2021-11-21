import { useState } from "react";
import { InputBase, ButtonImage, ButtonUI } from "../../components";
import { Section } from "../../layout/Section";
import { ButtonUIType } from "../ButtonUI";
import modelAliases from "../../data/model.json";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";
import { CeramicApi } from "@ceramicnetwork/common";
import { loadImage, uploadResizedImage } from "@self.id/image-utils";
import Link from "next/link";
import { useAuthContext } from "../../utils/AuthContext";
import * as React from "react";

const Form = () => {
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
                    setCreatorProfile(creator);
                }
                setCreatorProfile({
                    id: did.id.replace("did:3:", ""),
                });
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
        height: number,
        filename = "creatorImages"
    ) {
        const imageFile = new File([image], filename);
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
    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    return (
        <Section>
            {address ? (
                <form
                    className="w-150 m-auto"
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                >
                    <div className="my-6 lg:my-6 container  mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                        <h4 className="text-1xl font-bold leading-tight text-gray-800 dark:text-gray-100">
                            Web3 Addresses
                        </h4>
                    </div>
                    <InputBase
                        label="Wallet"
                        value={address}
                        disabled
                        onChange={() => {}}
                    />

                    {creatorProfile.id ? (
                        <div>
                            <InputBase
                                label="DID"
                                value={creatorProfile.id}
                                disabled
                                onChange={() => {}}
                            />
                        </div>
                    ) : (
                        <div>
                            <ButtonUI
                                type={ButtonUIType.submit}
                                classAttrs={"my-6"}
                            >
                                Connecting dId...
                            </ButtonUI>
                        </div>
                    )}

                    <div className="my-6 lg:my-6 container  mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                        <h4 className="text-1xl font-bold leading-tight text-gray-800 dark:text-gray-100">
                            Creator Profile
                        </h4>
                    </div>

                    {!youtubeImported && (
                        <div>
                            <ButtonUI onClick={importFromYouTube}>
                                Import from YouTube
                            </ButtonUI>
                        </div>
                    )}

                    {creatorProfile.pfp ? (
                        <>
                            <ButtonImage
                                src={creatorProfile.pfp.replace(
                                    "ipfs://",
                                    "https://ipfs.infura.io/ipfs/"
                                )}
                            />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="pfp-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Change</span>
                                    <input
                                        id="pfp-upload"
                                        name="pfp-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={(e: any) => {
                                            setCreatorProfile({
                                                pfp: URL.createObjectURL(
                                                    e.target.files[0]
                                                ),
                                            });
                                            setSelectedPFP(e.target.files[0]);
                                        }}
                                    />
                                </label>
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="my-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Profile Picture
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="pfp-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="pfp-upload"
                                                    name="pfp-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e: any) => {
                                                        setCreatorProfile({
                                                            pfp: URL.createObjectURL(
                                                                e.target
                                                                    .files[0]
                                                            ),
                                                        });
                                                        setSelectedPFP(
                                                            e.target.files[0]
                                                        );
                                                    }}
                                                />
                                            </label>
                                            <p className="pl-1">
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {creatorProfile.cover ? (
                        <>
                            <ButtonImage
                                src={creatorProfile.cover?.replace(
                                    "ipfs://",
                                    "https://ipfs.infura.io/ipfs/"
                                )}
                                width={"300"}
                                label={"Banner"}
                            />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="cover-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Change</span>
                                    <input
                                        id="cover-upload"
                                        name="cover-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={(e: any) => {
                                            setCreatorProfile({
                                                cover: URL.createObjectURL(
                                                    e.target.files[0]
                                                ),
                                            });
                                            setSelectedCover(e.target.files[0]);
                                        }}
                                    />
                                </label>
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="my-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Banner
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="cover-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="cover-upload"
                                                    name="cover-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e: any) => {
                                                        setCreatorProfile({
                                                            cover: URL.createObjectURL(
                                                                e.target
                                                                    .files[0]
                                                            ),
                                                        });
                                                        setSelectedCover(
                                                            e.target.files[0]
                                                        );
                                                    }}
                                                />
                                            </label>
                                            <p className="pl-1">
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="col-span-6 sm:col-span-3 mt-2">
                        <label
                            htmlFor={"youtube"}
                            className="block text-sm font-medium text-gray-700"
                        >
                            Channel URL
                        </label>
                        <input
                            type={"text"}
                            name={"youtube"}
                            id={"youtube"}
                            value={creatorProfile.youtube}
                            placeholder={"Video channel URL"}
                            onChange={handleFormChange}
                            className={
                                "mt-1 p-2 focus:ring-main-100 focus:border-main-100 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            }
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3 mt-2">
                        <label
                            htmlFor={"artistName"}
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type={"text"}
                            name={"artistName"}
                            id={"artistName"}
                            value={creatorProfile.artistName}
                            placeholder={"Your full name"}
                            onChange={handleFormChange}
                            className={
                                "mt-1 p-2 focus:ring-main-100 focus:border-main-100 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            }
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3 mt-2">
                        <label
                            htmlFor={"description"}
                            className="block text-sm font-medium text-gray-700"
                        >
                            Bio
                        </label>
                        <textarea
                            type={"text"}
                            name={"description"}
                            id={"description"}
                            value={creatorProfile.description}
                            placeholder={"A bit about yourself"}
                            onChange={handleFormChange}
                            className={
                                "mt-1 p-2 focus:ring-main-100 focus:border-main-100 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            }
                        />
                    </div>
                    
                    <ButtonUI
                        classAttrs={"my-6"}
                        onClick={saveCreatorProfile}
                        type={ButtonUIType.submit}
                    >
                        {loading
                            ? creatorProfile.id
                                ? "Saving"
                                : "Waiting for DiD... "
                            : "Save"}
                    </ButtonUI>
                    <br />
                    <ButtonUI classAttrs={"my-6"}>
                        <Link
                            href={{
                                pathname: "/[creatorId]",
                                query: {
                                    creatorId: creatorProfile.id?.replace(
                                        "did:3:",
                                        ""
                                    ),
                                },
                            }}
                        >
                            <a>Go to Profile</a>
                        </Link>
                    </ButtonUI>
                </form>
            ) : (
                <>
                    <div className="my-6 lg:my-6 container  mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
                        <h3>Momentape is a Web3 company</h3>
                    </div>
                    <ButtonUI onClick={authenticate}>
                        Connect your wallet
                    </ButtonUI>
                </>
            )}
        </Section>
    );
};

export default Form;
