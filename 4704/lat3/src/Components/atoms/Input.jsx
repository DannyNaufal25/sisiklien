import React from "react";

const Input = ({ type = "text", value, onChange, placeholder, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus-blue-300"
    {...props}
  />
);

export default Input;
