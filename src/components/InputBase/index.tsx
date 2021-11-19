import * as React from "react";

enum InputType {
    text = "text",
    number = "number",
}

export interface IInputProps {
    onChange: any;
    type?: InputType;
    value: any;
    label: string;
    name?: string;
    textArea?: boolean;
    disabled?: boolean;
}
const InputBase: React.FunctionComponent<IInputProps> = ({
    onChange,
    type = InputType.text,
    value,
    name,
    label,
    textArea = false,
    disabled = false,
}) => {
    const classes =
        "mt-1 p-2 focus:ring-main-100 focus:border-main-100 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md";
    return (
        <div className="col-span-6 sm:col-span-3 mt-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            {textArea ? (
                <textarea
                    name={label}
                    id={label}
                    rows={3}
                    className={classes}
                    defaultValue={value}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    id={label}
                    value={value}
                    onChange={(e: any) => onChange(e.target)}
                    className={classes}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

export default InputBase;
