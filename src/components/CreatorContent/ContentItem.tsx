// import styles from "./CreatorContent.module.css";
import { useRouter } from "next/router";
import { ButtonUI } from "../../components";
import { VariantType } from "../ButtonUI";
import { useAuthContext } from "../../utils/AuthContext";
export type IContentItemProps = {
    imgPath: string;
    title: string;
    date: string;
    creatorId: string;
    streamId: string;
    price: string;
};

const ContentItem: React.FunctionComponent<IContentItemProps> = ({
    imgPath,
    title,
    date,
    creatorId,
    streamId,
    price,
}) => {
    const router = useRouter();
    const { creatorProfile } = useAuthContext();
    return (
        <div className="w-1/4 p-2">
            <img
                src={imgPath}
                alt={title}
                style={{ width: "100%", height: "200px" }}
                className="object-cover"
            />
            <div className="bg-main-100 p-4">
                <div className="flex justify-between mb-3">
                    <p className="text-white uppercase font-light">{title}</p>
                    <p className="text-white uppercase font-light">
                        {price} ETH
                    </p>
                </div>
                <p className="text-white font-light">
                    Date: {new Date(date).toLocaleString()}
                </p>
                <ButtonUI
                    variant={VariantType.outlinedWhite}
                    onClick={() =>
                        router.push({
                            pathname: "/[creatorId]/[streamId]",
                            query: {
                                creatorId,
                                streamId,
                            },
                        })
                    }
                >
                    {creatorProfile.id === creatorId ? "Go" : "Unlock"}
                </ButtonUI>
            </div>
        </div>
    );
};

export default ContentItem;
