"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, BriefcaseBusiness, Coffee, GraduationCap, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuName = "services" | "products" | "resources";

const dropdowns: Record<MenuName, { label: string; href: string; description?: string }[]> = {
  services: [
    { label: "Web Hosting & Domain", href: "/services/web-hosting", description: "Domain search and reliable cloud hosting" },
    { label: "Software Development", href: "/services/software-development", description: "Custom software built around your needs" },
    { label: "AI-Driven Solutions", href: "/services/ai-solutions", description: "Smarter systems powered by AI" },
    { label: "Mobile App Development", href: "/services/mobile-app-development", description: "High-quality apps for every device" },
    { label: "ICT Training & Consultancy", href: "/services/ict-training", description: "Practical expertise that moves you forward" },
  ],
  products: [
    { label: "E-Commerce System", href: "/products/ecommerce" },
    { label: "Coffee Shop System", href: "/products/coffee-system" },
  ],
  resources: [
    { label: "Blog", href: "/resources/blog" },
    { label: "Help Center", href: "/contact" },
  ],
};

const SERVICE_ICONS = [
  // Web Hosting
  <><rect key="a" x="3" y="4" width="18" height="6" rx="2" /><rect key="b" x="3" y="14" width="18" height="6" rx="2" /><path key="c" d="M7 7h.01M7 17h.01" /></>,
  // Software
  <><path key="a" d="M8 9 4 12l4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
  // AI
  <><path key="a" d="M12 3 10.4 7.4 6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6L12 3Z" /><path key="b" d="m5 15-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8L5 15ZM19 14l-.6 1.4L17 16l1.4.6L19 18l.6-1.4L21 16l-1.4-.6L19 14Z" /></>,
  // Mobile
  <><rect key="a" x="6" y="2" width="12" height="20" rx="2.5" /><path key="b" d="M10 5h4M11 19h2" /></>,
  // Training
  <><path key="a" d="M4 5h16v11H4zM8 20h8M12 16v4" /><path key="b" d="m8 10 2.2 2.2L16 7" /></>,
];

const PRODUCT_ICONS = [ShoppingBag, Coffee];

function ServiceIcon({ index }: { index: number }) {
  return (
    <svg
      className="w-[22px] h-[22px] fill-none stroke-current"
      style={{ strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as React.CSSProperties}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {SERVICE_ICONS[index]}
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="w-[15px] h-[15px] fill-none stroke-current"
      style={{ strokeWidth: 1.8 } as React.CSSProperties}
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="m5.5 7.75 4.5 4.5 4.5-4.5" />
    </svg>
  );
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg className="w-[21px] h-[21px] fill-none stroke-current" style={{ strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as React.CSSProperties} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 15.2A8.4 8.4 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
    </svg>
  ) : (
    <svg className="w-[21px] h-[21px] fill-none stroke-current" style={{ strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as React.CSSProperties} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("raadsan-theme");
    const shouldUseDark = storedTheme === "dark";
    document.documentElement.classList.toggle("dark", shouldUseDark);
    const frame = window.requestAnimationFrame(() => setDarkMode(shouldUseDark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 16);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    const root = document.documentElement;

    root.classList.add("theme-changing");
    setDarkMode(nextTheme);
    root.classList.toggle("dark", nextTheme);
    localStorage.setItem("raadsan-theme", nextTheme ? "dark" : "light");
    window.dispatchEvent(new Event("raadsan-theme-change"));

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => root.classList.remove("theme-changing"));
    });
  };

  const closeNavigation = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  const openDropdown = (menu: MenuName) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 220);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed z-50 top-0 left-0 w-full border-b border-transparent transition-all duration-240 ease-in-out",
        scrolled
          ? "border-b-[color-mix(in_srgb,#116cc6_12%,transparent)] bg-white/92 dark:bg-[#020b1d]/92 shadow-[0_10px_34px_rgba(17,108,198,0.08)] dark:shadow-[0_10px_34px_rgba(0,0,0,0.2)] backdrop-blur-[18px]"
          : "bg-transparent"
      )}
    >
      <nav
        className="flex items-center w-[min(calc(100%-48px),1320px)] min-h-[104px] mx-auto max-[900px]:relative max-[900px]:w-[min(calc(100%-32px),1240px)] max-[900px]:min-h-[74px] max-[900px]:justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          className="relative block w-[181px] h-[60px] flex-none max-[900px]:w-[157px] max-[900px]:h-[52px] max-[480px]:w-[145px] max-[480px]:h-[48px]"
          href="/"
          onClick={(event) => {
            closeNavigation();
            if (pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          aria-label="Raadsan Tech home"
        >
          <Image
            className="absolute inset-0 w-full h-full object-contain object-left-center dark:hidden"
            src="/images/logo-light-mode.png"
            alt="Raadsan Technology"
            width={217}
            height={72}
            priority
          />
          <Image
            className="absolute inset-0 w-full h-full object-contain object-left-center hidden dark:block"
            src="/images/logo-dark-mode.png"
            alt="Raadsan Technology"
            width={217}
            height={72}
            priority
          />
        </Link>

        {/* Mobile hamburger */}
        <button
          className={cn(
            "hidden max-[900px]:grid w-11 h-11 p-[11px] border-0 rounded-[10px] bg-[color-mix(in_srgb,#116cc6_9%,transparent)] cursor-pointer content-center gap-[5px]",
            mobileOpen && "open"
          )}
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span
            className={cn(
              "block w-[22px] h-[2px] rounded-[3px] bg-[#116cc6] transition-transform duration-180",
              mobileOpen && "translate-y-[7px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block w-[22px] h-[2px] rounded-[3px] bg-[#116cc6] transition-opacity duration-180",
              mobileOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block w-[22px] h-[2px] rounded-[3px] bg-[#116cc6] transition-transform duration-180",
              mobileOpen && "-translate-y-[7px] -rotate-45"
            )}
          />
        </button>

        {/* Nav content */}
        <div
          className={cn(
            "flex items-center flex-1 ml-[72px]",
            "max-[900px]:absolute max-[900px]:top-[calc(100%+1px)] max-[900px]:-right-4 max-[900px]:-left-4",
            "max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:m-0 max-[900px]:ml-0",
            "max-[900px]:max-h-[calc(100vh-74px)] max-[900px]:overflow-y-auto",
            "max-[900px]:border-b max-[900px]:border-[var(--border)] max-[900px]:bg-[var(--surface)] max-[900px]:shadow-[0_20px_34px_rgba(9,32,56,0.12)] max-[900px]:p-4",
            mobileOpen ? "max-[900px]:flex" : "max-[900px]:hidden"
          )}
        >
          {/* Nav links pill */}
          <div className="flex items-stretch gap-[3px] mx-auto px-[14px] py-[9px] border border-[color-mix(in_srgb,#116cc6_10%,transparent)] rounded-full bg-[color-mix(in_srgb,#116cc6_7%,white)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:bg-[#0b1729] dark:border-white/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] max-[900px]:grid max-[900px]:gap-[2px] max-[900px]:m-0 max-[900px]:px-0 max-[900px]:py-0 max-[900px]:border-0 max-[900px]:rounded-none max-[900px]:bg-transparent max-[900px]:shadow-none max-[900px]:dark:bg-transparent max-[900px]:dark:border-0">
            <Link
              className={cn(
                "relative flex items-center gap-[5px] min-h-[44px] px-[11px] border-0 bg-transparent text-[var(--foreground)] text-[14px] font-semibold cursor-pointer transition-colors duration-160 hover:text-[#116cc6] dark:hover:text-[#ffbc11] max-[900px]:w-full max-[900px]:min-h-[48px] max-[900px]:px-3 max-[900px]:text-[15px]",
                pathname === "/" && "text-[#116cc6] dark:text-[#ffbc11]"
              )}
              href="/"
              onClick={closeNavigation}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Home
              {pathname === "/" && (
                <motion.span
                  layoutId="active-nav-indicator"
                  className="absolute bottom-[2px] left-[11px] right-[11px] h-[2px] rounded-full bg-[var(--secondary)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </Link>
            <Link
              className={cn(
                "relative flex items-center gap-[5px] min-h-[44px] px-[11px] border-0 bg-transparent text-[var(--foreground)] text-[14px] font-semibold cursor-pointer transition-colors duration-160 hover:text-[#116cc6] dark:hover:text-[#ffbc11] max-[900px]:w-full max-[900px]:min-h-[48px] max-[900px]:px-3 max-[900px]:text-[15px]",
                pathname.startsWith("/about") && "text-[#116cc6] dark:text-[#ffbc11]"
              )}
              href="/about"
              onClick={closeNavigation}
              aria-current={pathname.startsWith("/about") ? "page" : undefined}
            >
              About
              {pathname.startsWith("/about") && (
                <motion.span
                  layoutId="active-nav-indicator"
                  className="absolute bottom-[2px] left-[11px] right-[11px] h-[2px] rounded-full bg-[var(--secondary)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </Link>

            {(Object.keys(dropdowns) as MenuName[]).map((menu) => (
              <div
                className={cn(
                  "relative",
                  menu === "services" && "max-[900px]:static"
                )}
                key={menu}
                onMouseEnter={() => openDropdown(menu)}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={cn(
                    "relative flex items-center gap-[5px] min-h-[44px] appearance-none border-0 bg-transparent px-[11px] text-[14px] font-semibold text-[var(--foreground)] opacity-100 cursor-pointer transition-colors duration-160 hover:text-[#116cc6] dark:hover:text-[#ffbc11] max-[900px]:w-full max-[900px]:min-h-[48px] max-[900px]:px-3 max-[900px]:text-[15px] max-[900px]:justify-between",
                    pathname.startsWith(`/${menu}`) && "text-[#116cc6] dark:text-[#ffbc11]"
                  )}
                  type="button"
                  aria-expanded={openMenu === menu}
                  onFocus={() => openDropdown(menu)}
                  onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
                >
                  {menu[0].toUpperCase() + menu.slice(1)}
                  <motion.span
                    className="inline-flex"
                    animate={{ rotate: openMenu === menu ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ChevronIcon />
                  </motion.span>
                  {pathname.startsWith(`/${menu}`) && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute bottom-[2px] left-[11px] right-[11px] h-[2px] rounded-full bg-[var(--secondary)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {openMenu === menu && (
                    <motion.div
                      className={cn(
                        "absolute top-[calc(100%+28px)] left-0 grid border border-[var(--border)] rounded-[14px] bg-[var(--surface)] shadow-[0_18px_45px_rgba(8,32,58,0.16)] w-[210px] p-2",
                        "max-[900px]:static max-[900px]:w-auto max-[900px]:m-0 max-[900px]:mb-[6px] max-[900px]:ml-3 max-[900px]:px-2 max-[900px]:py-1 max-[900px]:border-0 max-[900px]:border-l-2 max-[900px]:border-l-[color-mix(in_srgb,#116cc6_28%,transparent)] max-[900px]:rounded-none max-[900px]:shadow-none",
                        menu === "services" && "left-1/2 w-[min(900px,calc(100vw-32px))] p-0 overflow-hidden -translate-x-[36%] max-[900px]:translate-x-0"
                      )}
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -7, scale: 0.985 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {menu === "services" ? (
                        <>
                          <div className="grid grid-cols-3 p-[14px] max-[900px]:grid-cols-1 max-[900px]:p-1">
                            {dropdowns.services.map((item, index) => (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.035, duration: 0.2 }}
                              >
                                <Link
                                  className="group flex items-start gap-[13px] min-h-[92px] p-4 rounded-[12px] hover:bg-[color-mix(in_srgb,#116cc6_8%,white)] dark:hover:bg-[color-mix(in_srgb,#116cc6_8%,#020b1d)] max-[900px]:min-h-[72px] max-[900px]:p-[10px]"
                                  href={item.href}
                                  onClick={closeNavigation}
                                >
                                  <span className="grid w-10 h-10 flex-none rounded-[10px] bg-[color-mix(in_srgb,#116cc6_11%,transparent)] text-[#116cc6] place-items-center transition-colors duration-160 group-hover:bg-[#116cc6] group-hover:text-white dark:text-[#ffbc11] dark:bg-[color-mix(in_srgb,#ffbc11_12%,transparent)] dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#122035]">
                                    <ServiceIcon index={index} />
                                  </span>
                                  <span className="grid gap-[5px]">
                                    <strong className="text-[var(--foreground)] text-[15px] leading-tight">{item.label}</strong>
                                    <small className="text-[var(--muted)] text-[12.5px] leading-snug">{item.description}</small>
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          <Link
                            className="flex items-center justify-center gap-2 p-4 border-t border-[var(--border)] bg-[color-mix(in_srgb,#116cc6_6%,white)] dark:bg-[color-mix(in_srgb,#116cc6_6%,#020b1d)] text-[#116cc6] dark:text-[#ffbc11] text-[14px] font-bold hover:opacity-80 transition-opacity max-[900px]:mt-1 max-[900px]:px-2 max-[900px]:py-[14px] max-[900px]:border-t max-[900px]:border-[var(--border)]"
                            href="/services"
                            onClick={closeNavigation}
                          >
                            Explore All Services{" "}
                            <span className="text-[#ffbc11] text-[20px] leading-none transition-transform duration-160 group-hover:translate-x-1" aria-hidden="true">→</span>
                          </Link>
                        </>
                      ) : (
                        dropdowns[menu].map((item, index) => {
                          const ProductIcon = PRODUCT_ICONS[index];
                          return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.18 }}
                          >
                            <Link
                              className={cn(
                                "group flex items-center gap-3 px-3 py-[11px] rounded-[9px] text-[var(--muted)] font-semibold hover:bg-[color-mix(in_srgb,#116cc6_9%,transparent)] hover:text-[#116cc6]",
                                menu === "products" ? "text-[12px] whitespace-nowrap" : "text-[14px]"
                              )}
                              href={item.href}
                              onClick={closeNavigation}
                            >
                              {menu === "products" && ProductIcon && (
                                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-[#116cc6]/10 text-[#116cc6] transition-colors group-hover:bg-[#116cc6] group-hover:text-white dark:bg-[#ffbc11]/10 dark:text-[#ffbc11] dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#122035]">
                                  <ProductIcon className="h-[18px] w-[18px] stroke-[1.8]" />
                                </span>
                              )}
                              {item.label}
                            </Link>
                          </motion.div>
                          );
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link
              className={cn(
                "relative flex items-center gap-[5px] min-h-[44px] px-[11px] border-0 bg-transparent text-[var(--foreground)] text-[14px] font-semibold cursor-pointer transition-colors duration-160 hover:text-[#116cc6] dark:hover:text-[#ffbc11] max-[900px]:w-full max-[900px]:min-h-[48px] max-[900px]:px-3 max-[900px]:text-[15px]",
                pathname.startsWith("/contact") && "text-[#116cc6] dark:text-[#ffbc11]"
              )}
              href="/contact"
              onClick={closeNavigation}
              aria-current={pathname.startsWith("/contact") ? "page" : undefined}
            >
              Contact
              {pathname.startsWith("/contact") && (
                <motion.span
                  layoutId="active-nav-indicator"
                  className="absolute bottom-[2px] left-[11px] right-[11px] h-[2px] rounded-full bg-[var(--secondary)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-[10px] max-[900px]:mt-[14px] max-[900px]:pt-[14px] max-[900px]:border-t max-[900px]:border-[var(--border)]">
            <button
              className="grid w-[42px] h-[42px] p-0 border border-[var(--border)] rounded-full bg-[var(--surface)] text-[#ffbc11] cursor-pointer place-items-center transition-all duration-160 hover:border-[#ffbc11] hover:rotate-[8deg]"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
              title={`Switch to ${darkMode ? "light" : "dark"} mode`}
            >
              <ThemeIcon dark={darkMode} />
            </button>
            <Link
              className="flex items-center justify-center gap-2 min-h-[44px] px-[21px] rounded-full bg-[#116cc6] shadow-[0_8px_20px_rgba(17,108,198,0.22)] text-white text-[14px] font-bold transition-all duration-160 hover:bg-[#0b559e] hover:-translate-y-px dark:bg-[#ffbc11] dark:shadow-[0_8px_20px_rgba(255,188,17,0.2)] dark:text-black dark:hover:bg-[#eaaa00] max-[900px]:flex-1"
              href="/login"
              onClick={closeNavigation}
            >
              Client Area
              <svg className="w-[17px] h-[17px] fill-none stroke-current" style={{ strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as React.CSSProperties} viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
