import * as React from "react";

export interface IButtonImageProps {
    src?: string;
    width?: string;
    label?: string;
}
const ButtonImage: React.FunctionComponent<IButtonImageProps> = ({
    src,
    width,
    label = "Profile picture",
}) => {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 flex items-center">
                {!width ? (
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {src ? (
                            <img src={src} width={"50"} />
                        ) : (
                            <svg
                                className="h-full w-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </span>
                ) : (
                    <img src={src} width={"300"} />
                )}


            </div>
        </div>
    );
};

export default ButtonImage;
