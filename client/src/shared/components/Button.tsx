import React, { FC } from "react";
import type { ButtonProps } from '@/types';

const Button: FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold transition duration-300';

  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-100'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;
