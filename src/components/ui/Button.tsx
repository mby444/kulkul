import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "flex items-center justify-center font-bold h-13 px-6 rounded-xl transition-colors duration-200";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-secondary text-white",
    outline: "border-2 border-primary text-primary hover:bg-primary/5"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
