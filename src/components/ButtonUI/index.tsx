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
}

const ButtonUI: React.FunctionComponent<ButtonProps> = ({ onClick, children, type = ButtonUIType.button, disabled = false, variant = VariantType.contained, ...props }) => {
  return (
    <button className={variant === VariantType.contained ? 'bg-main-100 hover:bg-main-200 text-white font-bold py-2 px-4 rounded' : 'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'}>
      Button
    </button>
  );
};

export default ButtonUI;
