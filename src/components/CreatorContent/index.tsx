import styles from "./CreatorContent.module.css";
import ContentItem, { IContentItemProps } from "./ContentItem";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { ButtonUI } from "../../components";
import Link from "next/link";
import { useRouter } from "next/router";
type ICreatorContentProps = {
    imgPath: {
        profile: string;
        cover: string;
    };
    name: string;
    ethAddress: string;
    content: IContentItemProps[];
    creator: any;
    editProfile: boolean;
    loadingStreams: boolean;
};

const CreatorContent: React.FunctionComponent<ICreatorContentProps> = ({
    imgPath,
    name,
    ethAddress,
    content,
    creator,
    editProfile,
    loadingStreams,
}) => {
    const router = useRouter();
    return (
        <>
            <div
                className={styles.cover}
                style={{ backgroundImage: `url(${imgPath.cover})` }}
            ></div>
            <div className="container p-6">
                <div className="flex">
                    <div className="w-24 h-24 rounded relative bottom-16 left-2">
                        <img
                            src={imgPath.profile}
                            alt="profile img"
                            className="w-24 h-24 rounded object-cover"
                        />
                        {editProfile ? (
                            <Link href={"/creator"}>
                                <p
                                    className={
                                        " hover:text-red-700 ml-4 text-gray-800 text-xs"
                                    }
                                >
                                    Edit Profile
                                </p>
                            </Link>
                        ) : (
                            " "
                        )}
                    </div>
                    <div className={"w-50"}>
                        <span className="text-gray-900 text-2xl font-bold ml-4 block">
                            {name}
                            <a
                                className="ml-4 hover:text-red-700 duration-200 transition-colors"
                                href={creator.youtube}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faYoutube} />
                            </a>
                        </span>
                        <span className="text-gray-800 block ml-4">
                            {ethAddress}
                        </span>
                        <span className="text-gray-800 block ml-4">
                            <p>{creator.description}</p>
                        </span>
                    </div>
                </div>
                {editProfile && (
                    <div className={"my-5"}>
                        <p>
                            <ButtonUI
                                onClick={() =>
                                    router.push({
                                        pathname: "/[creatorId]/newStream",
                                        query: {
                                            creatorId: creator.id,
                                        },
                                    })
                                }
                            >
                                New stream
                            </ButtonUI>
                        </p>
                    </div>
                )}
                <div className="flex flex-wrap">
                    {loadingStreams
                        ? "Loading streams"
                        : content.length
                        ? content.map((item, i: number) => (
                              <ContentItem
                                  imgPath={item.imgPath}
                                  title={item.title}
                                  price={item.price}
                                  streamId={item.streamId}
                                  date={item.date}
                                  creatorId={item.creatorId}
                                  key={i}
                              />
                          ))
                        : "No streams yet"}
                </div>
            </div>
        </>
    );
};

export default CreatorContent;
