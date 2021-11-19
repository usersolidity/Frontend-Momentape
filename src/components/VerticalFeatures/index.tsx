import { useRouter } from "next/router";

import modelAliases from "../../data/model.json";

import { VerticalFeatureRow } from "./VerticalFeatureRow";
import { ButtonUI } from "../../components";
import { Section } from "../../layout/Section";
import { VariantType } from "../ButtonUI/index";

const VerticalFeatures = () => {
    const router = useRouter();

    async function authenticate() {
        const [address] = await (window as any).ethereum.enable();
        const { EthereumAuthProvider, WebClient } = await import(
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

            const did = await client.authenticate(ethAuthProvider, true);
            if (did.id) {
                router.push({
                    pathname: "/[creatorId]",
                    query: { creatorId: did.id.replace("did:3:", "") },
                });
            } else {
                router.push({
                    pathname: "/newCreator",
                });
            }
        }
    }
    return (
        <Section>
            <VerticalFeatureRow
                title="Collect creators&#39; Top Moments"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim."
                image={{ path: "feature.svg", alt: "feature" }}
            />
            <VerticalFeatureRow
                title="You’re an Artist"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim."
                image={{ path: "feature.svg", alt: "feature" }}
                reverse
            >
                <ButtonUI
                    variant={VariantType.contained}
                    onClick={() =>
                        router.push({
                            pathname: "/newCreator",
                        })
                    }
                >
                    Get started as an artist
                </ButtonUI>
                <br />
                <ButtonUI
                    variant={VariantType.contained}
                    onClick={authenticate}
                >
                    Connect to see your profile
                </ButtonUI>
            </VerticalFeatureRow>
            <VerticalFeatureRow
                title="You’re a Collector"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim."
                image={{ path: "feature.svg", alt: "feature" }}
            />
        </Section>
    );
};

export default VerticalFeatures;
