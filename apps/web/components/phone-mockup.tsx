"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

/** Real-device frame wrapping an actual app screenshot. */
export function PhoneMockup({
  src,
  alt,
  className,
  priority = false,
  tilt = 0,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  tilt?: number
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[280px] shrink-0 transition-transform duration-500 motion-reduce:transition-none sm:w-[300px]",
        className
      )}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      {/* device body */}
      <div className="border-foreground/15 relative overflow-hidden rounded-[2.75rem] border-[7px] bg-black shadow-[0_24px_60px_-16px_rgb(0_0_0_/_0.35)]">
        {/* dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        {/* side buttons */}
        <div className="absolute -left-[10px] top-24 h-10 w-[3px] rounded-full bg-foreground/25" />
        <div className="absolute -left-[10px] top-36 h-14 w-[3px] rounded-full bg-foreground/25" />
        <div className="absolute -right-[10px] top-28 h-16 w-[3px] rounded-full bg-foreground/25" />
        {/* screen */}
        <div className="relative aspect-[1206/2622] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 70vw, 300px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  )
}

/** Screenshot with a soft card treatment (no device frame). */
export function ScreenshotCard({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border bg-muted shadow-lg",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={603}
        height={1311}
        sizes="(max-width: 640px) 85vw, 420px"
        className="h-auto w-full object-cover object-top"
      />
    </div>
  )
}

/** Rotating hero preview — cycles real screens with a crossfade. */
export function HeroScreenshotCycle({
  shots,
  intervalMs = 4500,
}: {
  shots: { src: string; alt: string; label: string }[]
  intervalMs?: number
}) {
  const [i, setI] = useState(0)
  return (
    <div className="relative">
      <PhoneMockup
        src={shots[i]!.src}
        alt={shots[i]!.alt}
        priority
        className="relative z-10"
      />
      {/* dot switcher — keyboard accessible */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {shots.map((s, n) => (
          <button
            key={s.label}
            onClick={() => setI(n)}
            aria-label={`Show ${s.label} screen`}
            className={cn(
              "h-2 rounded-full transition-all motion-reduce:transition-none",
              n === i ? "w-6 bg-lime-500" : "w-2 bg-foreground/20 hover:bg-foreground/40"
            )}
          />
        ))}
      </div>
      {/* auto-cycle, pauses on interaction */}
      <AutoAdvance
        index={i}
        count={shots.length}
        interval={intervalMs}
        onTick={setI}
      />
      {/* label chip */}
      <p className="text-muted-foreground mt-2 text-center text-xs font-medium">
        {shots[i]!.label}
      </p>
    </div>
  )
}

function AutoAdvance({
  index,
  count,
  interval,
  onTick,
}: {
  index: number
  count: number
  interval: number
  onTick: (n: number) => void
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => onTick((index + 1) % count), interval)
    return () => clearInterval(t)
  }, [index, count, interval, onTick])
  return null
}

/** Categorized gallery — real screenshots per tab. */
export function ScreenshotGallery({
  groups,
}: {
  groups: { label: string; src: string; alt: string }[]
}) {
  const [active, setActive] = useState(0)
  const g = groups[active]!
  return (
    <div>
      {/* category tabs */}
      <div
        role="tablist"
        aria-label="App screens"
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {groups.map((x, i) => (
          <button
            key={x.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              i === active
                ? "border-lime-500 bg-lime-500/10 text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            {x.label}
          </button>
        ))}
      </div>
      {/* screenshot */}
      <div className="flex justify-center">
        <PhoneMockup key={g.src} src={g.src} alt={g.alt} />
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">{g.alt}</p>
    </div>
  )
}
