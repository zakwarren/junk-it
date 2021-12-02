import React from "react";

export const Button: React.FC<React.ComponentProps<"button">> = ({
  children,
  ...otherProps
}) => (
  <button
    className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
    {...otherProps}
  >
    {children}
  </button>
);
