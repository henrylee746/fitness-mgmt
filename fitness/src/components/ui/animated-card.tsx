import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AnimatedCard({ className, ...props }: CardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      className={cn(
        "group/animated-card relative w-[280px] sm:w-[320px] md:w-[356px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }: CardProps) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 border-t p-4",
        className
      )}
      {...props}
    />
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg leading-none font-semibold tracking-tight text-black dark:text-white",
        className
      )}
      {...props}
    />
  )
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> { }

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  )
}

export function CardVisual({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("h-[150px] w-[280px] sm:h-[165px] sm:w-[320px] md:h-[180px] md:w-[356px] overflow-hidden", className)}
      {...props}
    />
  )
}
