import type { ComponentType } from "react"
import {
  BarChart3,
  Clock,
  CreditCard,
  Flame,
  Globe,
  LayoutDashboard,
  Layers,
  Lock,
  Monitor,
  Package,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Ticket,
  Truck,
  Users,
  UtensilsCrossed,
  type LucideProps,
} from "lucide-react"

export type LucideIcon = ComponentType<LucideProps>

export const PRODUCT_FEATURE_ICONS: Record<string, LucideIcon> = {
  monitor: Monitor,
  receipt: Receipt,
  utensils: UtensilsCrossed,
  utensilscrossed: UtensilsCrossed,
  flame: Flame,
  users: Users,
  clock: Clock,
  lock: Lock,
  package: Package,
  search: Search,
  "shopping-bag": ShoppingBag,
  shoppingbag: ShoppingBag,
  "credit-card": CreditCard,
  creditcard: CreditCard,
  truck: Truck,
  layers: Layers,
  star: Star,
  ticket: Ticket,
  "layout-dashboard": LayoutDashboard,
  layoutdashboard: LayoutDashboard,
  settings: Settings,
  smartphone: Smartphone,
  "shield-check": ShieldCheck,
  shieldcheck: ShieldCheck,
  globe: Globe,
  "bar-chart": BarChart3,
  barchart3: BarChart3,
}

const TITLE_ICON_RULES: { match: RegExp; icon: string }[] = [
  { match: /auth|login|otp|secure|security|password/i, icon: "lock" },
  { match: /product|categor|variant|gallery/i, icon: "package" },
  { match: /search|filter|auto-?complete/i, icon: "search" },
  { match: /cart|wishlist|storefront|shop/i, icon: "shopping-bag" },
  {
    match: /checkout|payment|card|visa|evc|edahab|zaad|sahal/i,
    icon: "credit-card",
  },
  { match: /order|track|delivery|courier/i, icon: "truck" },
  { match: /inventory|warehouse|stock/i, icon: "layers" },
  { match: /review|rating|star/i, icon: "star" },
  { match: /coupon|discount|promo|flash/i, icon: "ticket" },
  { match: /admin|dashboard|management hub/i, icon: "layout-dashboard" },
  { match: /customer|user|staff|shift|barista/i, icon: "users" },
  { match: /report|setting|analytics|revenue/i, icon: "settings" },
  { match: /touch|pos|terminal|monitor|screen/i, icon: "monitor" },
  { match: /receipt|print/i, icon: "receipt" },
  { match: /table|dine|kitchen|utensil|order manage/i, icon: "utensils" },
  { match: /recipe|milk|espresso|syrup|flame/i, icon: "flame" },
  { match: /sales|hourly|peak|real-?time|clock/i, icon: "clock" },
  { match: /mobile|phone|tablet/i, icon: "smartphone" },
  { match: /language|currency|globe|multi/i, icon: "globe" },
  { match: /ssl|encrypt|backup|bank/i, icon: "shield-check" },
]

export function resolveProductFeatureIcon(
  name: string,
  fallback: LucideIcon = Package,
): LucideIcon {
  const key = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
  return (
    PRODUCT_FEATURE_ICONS[key] ||
    PRODUCT_FEATURE_ICONS[key.replace(/-/g, "")] ||
    fallback
  )
}

/** Pick an icon key from a feature title (used when registering features). */
export function iconFromFeatureTitle(title: string, fallback = "monitor") {
  const text = String(title || "").trim()
  if (!text) return fallback
  for (const rule of TITLE_ICON_RULES) {
    if (rule.match.test(text)) return rule.icon
  }
  return fallback
}
