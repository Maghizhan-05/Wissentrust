import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/** Centered max-width content wrapper with responsive gutters. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
