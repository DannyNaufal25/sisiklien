import React from "react";

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  edit: "bg-yellow-500 text-white hover:bg-yellow-600",
  delete: "bg-red-600 text-white hover:bg-red-700",
  info: "bg-green-600 text-white hover:bg-green-700",
};

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded font-semibold transition ${variantStyles[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
