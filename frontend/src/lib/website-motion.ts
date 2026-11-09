/** Use instead of `initial={{ opacity: 0, … }}` so first paint is never invisible. */
export const motionInitial = false as const

export const defaultInViewViewport = {
  once: true,
  amount: 0.15,
} as const
