"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = "medium" }) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-24 w-24",
  };

  return (
    <div className="flex justify-center items-center">
      <Loader2
        className={`animate-spin text-purple-500 ${
          sizeClasses[size] || sizeClasses.medium
        }`}
      />
    </div>
  );
}
