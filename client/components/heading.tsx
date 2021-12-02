import React from "react";

export const Heading: React.FC<React.ComponentProps<"h1">> = ({ children }) => (
  <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-purple-800">
    {children}
  </h1>
);
