import * as React from 'react';

enum ButtonUIType {
  button = 'button',
  submit = 'submit',
}

export enum VariantType {
  outlined = 'outlined',
  contained = 'contained',
  text = 'text',
}

export interface ButtonProps {
  onClick?: VoidFunction;
  type?: ButtonUIType;
  disabled?: boolean;
  variant?: VariantType;
  color?: string;
}

const ButtonUI: React.FunctionComponent<ButtonProps> = ({ onClick, children, type = ButtonUIType.button, disabled = false, variant = VariantType.contained, color = 'main-100' }) => {
  const colorNumber: number = parseFloat(color.split('-')[1] || '100');
  const hoverColor = `${color.split('-')[0]}-${colorNumber + 100}`;
  console.log(color, hoverColor, colorNumber, 'hoverColor');
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={variant === VariantType.contained ? `bg-${color} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded` : `bg-transparent hover:bg-${color}-200 text-main-700 font-semibold text-white py-2 px-4 border border-main-500 rounded mx-2`}
    >
      {children}
    </button>
  );
};

export default ButtonUI;
