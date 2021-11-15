import * as React from 'react';

import Button from '@mui/material/Button';

enum ButtonUIType {
  button = 'button',
  submit = 'submit',
}

export interface ButtonProps {
  onClick?: VoidFunction;
  type?: ButtonUIType;
  disabled?: boolean;
}

const ButtonUI: React.FunctionComponent<ButtonProps> = ({ onClick, children, type = ButtonUIType.button, disabled = false, ...props }) => {
  return (
    <Button type={type} variant='contained' onClick={onClick} disabled={disabled} {...props}>
      {children}
    </Button>
  );
};

export default ButtonUI;
