import styles from "./CreatorContent.module.css";
import _ from "lodash";
import ContentItem, { IContentItemProps } from "./ContentItem";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
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
};

const CreatorContent: React.FunctionComponent<ICreatorContentProps> = ({
    imgPath,
    name,
    ethAddress,
    content,
    creator,
    editProfile,
}) => {
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
                            {_.truncate(ethAddress, {
                                length: 14,
                                separator: " ",
                            })}
                        </span>
                        <span className="text-gray-800 block ml-4">
                            <p>{creator.description}</p>
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    {content.map((item, i: number) => (
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
        </>
    );
};

export default CreatorContent;
