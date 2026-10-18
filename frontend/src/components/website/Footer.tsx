"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#f4f8fc] dark:bg-[#020917] text-slate-700 dark:text-slate-300 pt-16 pb-8 px-6 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="mx-auto max-w-[1320px]">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 pb-14 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="flex flex-col gap-5">
            <Link href="#home" className="relative block w-[170px] h-[54px] flex-none">
              <Image
                className="absolute inset-0 w-full h-full object-contain object-left dark:hidden"
                src="/images/logo-light-mode.png"
                alt="Raadsan Technology"
                width={217}
                height={72}
              />
              <Image
                className="absolute inset-0 w-full h-full object-contain object-left hidden dark:block"
                src="/images/logo-dark-mode.png"
                alt="Raadsan Technology"
                width={217}
                height={72}
              />
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Raadsan Technology combines technical expertise, strategic insight, and innovation to deliver scalable digital solutions.
            </p>

            {/* Social links — same style as Contact page */}
            <div className="flex items-center gap-2.5 mt-1">
              {[
                {
                  label: "Facebook",
                  href: "https://www.facebook.com/raadsantech",
                  icon: (
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/raadsantech/",
                  icon: (
                    <svg
                      className="h-4 w-4 fill-none stroke-current stroke-2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        className="fill-current stroke-none"
                      />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/raadsantech/posts/?feedView=all",
                  icon: (
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5ZM8 19H5V8h3v11ZM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764ZM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19Z" />
                    </svg>
                  ),
                },
                {
                  label: "WhatsApp",
                  href: "https://wa.me/252614897510",
                  icon: (
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]
                             bg-[color-mix(in_srgb,#116cc6_6%,var(--background))] text-[#116cc6]
                             transition-all duration-200 hover:-translate-y-0.5 hover:border-[#116cc6] hover:bg-[#116cc6] hover:text-white
                             dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,188,17,0.08)] dark:text-[#ffbc11]
                             dark:hover:border-[#ffbc11] dark:hover:bg-[#ffbc11] dark:hover:text-[#0c1624]"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Quick Link
            </h3>
            <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#home" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources/blog" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Project
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services We Provide */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Services 
            </h3>
            <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/services/web-hosting" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Web Hosting &amp; Domain
                </Link>
              </li>
              <li>
                <Link href="/services/software-development" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-app-development" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link href="/services/ai-solutions" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  AI-Driven Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/ict-training" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  ICT Training & Consultancy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Contact Info
            </h3>
            <ul className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#116cc6] dark:text-[#ffbc11] flex-none mt-0.5" />
                <span>HQ Digfeer, Hodan Mogadishu-Somalia</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#116cc6] dark:text-[#ffbc11] flex-none mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+252614897510" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                    +252 61 4897510
                  </a>
                  <a href="tel:+252614897509" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                    +252 61 4897509
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#116cc6] dark:text-[#ffbc11] flex-none" />
                <a href="mailto:Info@raadsantech.so" className="hover:text-[#116cc6] dark:hover:text-[#ffbc11] transition-colors">
                  Info@raadsantech.so
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <p className="text-center md:text-left">
            Copyright &copy; {new Date().getFullYear()} Raadsan Technology. All rights reserved.
          </p>

          <p className="text-center md:text-right">
            Powered by <span className="font-semibold text-slate-700 dark:text-slate-300">Raadsan Tech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
