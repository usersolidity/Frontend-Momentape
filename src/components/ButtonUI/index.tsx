import * as React from 'react';
import className from 'classnames';

export enum ButtonUIType {
  button = 'button',
  submit = 'submit',
}

export enum VariantType {
  outlinedWhite = 'outlined-white',
  outlinedMain = 'outlined-main',
  contained = 'contained',
}

export interface ButtonProps {
  onClick?: VoidFunction;
  type?: ButtonUIType;
  disabled?: boolean;
  variant?: VariantType;
}

const ButtonUI: React.FunctionComponent<ButtonProps> = ({ onClick, children, type = ButtonUIType.button, disabled = false, variant = VariantType.contained }) => {
  const buttonClass = className('text-gr', 'font-bold', 'py-2', 'px-4', 'rounded', 'max-w-sm', {
    'bg-main-100 hover:bg-main-200 text-white': variant === VariantType.contained,
    'bg-transparent text-main-100 border border-main-100': variant === VariantType.outlinedMain,
    'bg-transparent text-white border border-gray-100': variant === VariantType.outlinedWhite,
  });
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buttonClass}>
      {children}
    </button>
  );
};

export default ButtonUI;
