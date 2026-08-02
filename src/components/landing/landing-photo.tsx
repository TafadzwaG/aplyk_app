import { cn } from "@/lib/utils"

type LandingPhotoProps = {
  src: string
  alt: string
  className?: string
  overlay?: "left" | "bottom" | "full" | "none"
  loading?: "lazy" | "eager"
  width?: number
  height?: number
}

export function LandingPhoto({
  src,
  alt,
  className,
  overlay = "left",
  loading = "lazy",
  width = 800,
  height = 600,
}: LandingPhotoProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-muted", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className="h-full w-full object-cover"
      />
      {overlay === "left" && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-navy/72 via-brand-navy/28 to-transparent"
          aria-hidden="true"
        />
      )}
      {overlay === "bottom" && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/65 via-brand-navy/15 to-transparent"
          aria-hidden="true"
        />
      )}
      {overlay === "full" && (
        <div
          className="pointer-events-none absolute inset-0 bg-brand-navy/55"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
