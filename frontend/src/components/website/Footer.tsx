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

            {/* Social Pill Buttons with Clean Inline SVGs */}
            <div className="flex items-center gap-3 mt-1">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#116cc6] hover:text-white dark:hover:bg-[#ffbc11] dark:hover:text-[#122035] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#116cc6] hover:text-white dark:hover:bg-[#ffbc11] dark:hover:text-[#122035] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#116cc6] hover:text-white dark:hover:bg-[#ffbc11] dark:hover:text-[#122035] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#116cc6] hover:text-white dark:hover:bg-[#ffbc11] dark:hover:text-[#122035] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
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
