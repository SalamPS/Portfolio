import { cn } from "@/app/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }