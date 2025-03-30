import React from "react";

const Button = ({ children, onClick, variant = "primary" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-300";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
