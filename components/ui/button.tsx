import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
}

const Button = ({ children, onClick, variant = "primary", className = "", ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    // Matches your #981a3c red used in header
    primary: "bg-[#981a3c] text-white hover:bg-[#7a1530] focus:ring-[#981a3c]",
    // Matches your generic dark/light zinc styles
    secondary: "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
