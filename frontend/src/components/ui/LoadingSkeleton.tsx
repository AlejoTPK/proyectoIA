import React from "react";
import { cn } from "../../lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded-md",
        className
      )}
    />
  );
};
