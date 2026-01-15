import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-800/50 backdrop-blur-sm border border-white/5 animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
