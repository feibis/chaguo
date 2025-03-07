import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const kbdVariants = cva({
  base: "inline-flex gap-[0.2em] whitespace-nowrap tabular-nums rounded-sm border px-[0.4em] py-[0.088em] text-xs/tight font-medium text-secondary-foreground",

  variants: {
    variant: {
      soft: "border-transparent bg-accent",
      outline: "",
    },
  },

  defaultVariants: {
    variant: "outline",
  },
})

type KbdProps = ComponentProps<"span"> &
  VariantProps<typeof kbdVariants> & {
    meta?: boolean
    shift?: boolean
    alt?: boolean
    ctrl?: boolean
    className?: string
  }

export const Kbd = ({
  children,
  className,
  variant,
  meta,
  shift,
  alt,
  ctrl,
  ...props
}: KbdProps) => {
  return (
    <span className={cx(kbdVariants({ variant, className }))} {...props}>
      {meta && <span>⌘</span>}
      {shift && <span>⇧</span>}
      {alt && <span>⌥</span>}
      {ctrl && <span>⌃</span>}
      {children && <span>{children}</span>}
    </span>
  )
}
