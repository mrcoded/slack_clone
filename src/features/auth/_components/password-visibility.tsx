"use client";

import React from "react";
import { Eye, EyeClosedIcon } from "lucide-react";

const PasswordVisibility = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <span
      className="absolute right-0 top-1/2 transform -translate-y-3/4 m-2 cursor-pointer"
      onClick={togglePasswordVisibility}
    >
      {showPassword ? (
        <Eye className="size-4 " />
      ) : (
        <EyeClosedIcon className="size-4" />
      )}
    </span>
  );
};

export default PasswordVisibility;
