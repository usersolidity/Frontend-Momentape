import { useRouter } from "next/router";
import Link from "next/link";
// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

import { useAuthContext } from "../../utils/AuthContext";
import modelAliases from "../../data/model.json";

// import Badge from "@mui/material/Badge";
import AccountCircle from "@mui/icons-material/AccountCircle";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import { Logo, SearchUI } from "../../components";
import { useState } from "react";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function PrimarySearchAppBar() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { selfId, creatorProfile, setAddress, setCreatorProfile } =
        useAuthContext();
    // const [notificationsCounter, setNotificationsCounter] =
    //     React.useState<number>(13);

    // const handleOpenWallet = () => {
    //     console.log("open wallet");
    // };

    async function authenticate() {
        if (creatorProfile.id) {
            router.push({
                pathname: "/[creatorId]",
                query: { creatorId: creatorProfile.id },
            });
            return;
        }
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
            if (did.id) {
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
                if (router.route === "/") {
                    router.push({
                        pathname: "/[creatorId]",
                        query: { creatorId: did.id.replace("did:3:", "") },
                    });
                }
            } else {
                router.push({
                    pathname: "/newCreator",
                });
            }
        }
        setLoading(false);
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <div className="container">
                    <Toolbar>
                        <Logo classes="text-white" />
                        <SearchUI />
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { md: "flex" } }}>
                            {/* <IconButton size='large' aria-label='show 4 new mails' color='inherit' onClick={handleOpenWallet}>
                <AccountBalanceWalletIcon />
              </IconButton>
              <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
                <Badge badgeContent={notificationsCounter} color='error'>
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}

                            {selfId?.current ? (
                                <Link
                                    href={{
                                        pathname: "/[creatorId]",
                                        query: {
                                            creatorId:
                                                selfId.current?.id.replace(
                                                    "did:3:",
                                                    ""
                                                ),
                                        },
                                    }}
                                >
                                    <IconButton
                                        size="large"
                                        edge="end"
                                        aria-label="account of current user"
                                        aria-haspopup="true"
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                </Link>
                            ) : (
                                <LoadingButton
                                    size="large"
                                    loading={loading}
                                    onClick={authenticate}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </LoadingButton>
                            )}
                        </Box>
                    </Toolbar>
                </div>
            </AppBar>
        </Box>
    );
}
