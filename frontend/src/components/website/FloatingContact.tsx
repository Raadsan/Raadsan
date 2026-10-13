"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  ["What services do you offer?", "We provide hosting, domains, custom software, mobile apps, AI solutions, and ICT consulting."],
  ["About Raadsan Tech?", "Raadsan Technology delivers smart, scalable, and secure digital solutions for modern organizations."],
  ["How can I contact you?", "Call +252 61 4897510 or email info@raadsantech.so. You can also use our social links."],
  ["Service pricing?", "Pricing depends on your requirements. Contact our team for a clear, tailored quotation."],
  ["Where are you located?", "Our office is at HQ Digfeer, Hodan, Mogadishu, Somalia."],
  ["Your past projects?", "We have delivered digital projects across software, websites, hosting, mobile apps, and business systems."],
  ["Your team?", "Our team includes software engineers, designers, consultants, and infrastructure specialists."],
] as const;

const socialLinks = [
  { name: "Facebook", icon: "facebook", url: "https://facebook.com/raadsantech", color: "#1877F2" },
  { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com/company/raadsantech", color: "#0A66C2" },
  { name: "Instagram", icon: "instagram", url: "https://instagram.com/raadsantech", color: "#E4405F" },
  { name: "TikTok", icon: "tiktok", url: "https://tiktok.com/@raadsantech", color: "#000000" },
];

export default function FloatingContact() {
  const [chatOpen, setChatOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [conversations, setConversations] = useState<Array<{ question: string; answer: string }>>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [conversations, isThinking]);

  const showAnswer = async (item: (typeof questions)[number]) => {
    if (isThinking) return;
    setConversations((current) => [...current, { question: item[0], answer: "" }]);
    setIsThinking(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setConversations((current) =>
      current.map((entry, index) =>
        index === current.length - 1 ? { ...entry, answer: item[1] } : entry
      )
    );
    setIsThinking(false);
  };

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[105px] right-6 z-[60] flex h-[min(530px,calc(100vh-125px))] w-[min(350px,calc(100vw-32px))] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_65px_rgba(4,24,48,0.30)] dark:border-white/10 dark:bg-[#050d20] max-[480px]:right-4"
            aria-label="Raadsan AI chat"
          >
            <header className="flex items-center justify-between bg-[#071d33] px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#ffbc11]">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold">Raadsan AI</h2>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Online</div>
                </div>
              </div>
              <button type="button" onClick={() => setChatOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10" aria-label="Close chat">
                <X className="h-6 w-6" />
              </button>
            </header>

            <div ref={messagesRef} className="flex-1 space-y-4 overflow-y-auto bg-[#f5f8fc] p-4 dark:bg-[#050b1b]">
              <div className="max-w-[280px] rounded-3xl bg-white px-4 py-3 shadow-sm dark:bg-[#202c42]">
                <p className="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">Hello! Welcome to Raadsan Tech. How can I help you today?</p>
                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>

              <AnimatePresence initial={false}>
                {conversations.map((conversation, index) => (
                  <motion.div key={`${conversation.question}-${index}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="ml-auto max-w-[280px] rounded-3xl rounded-tr-none bg-[#116cc6] px-5 py-3 text-sm font-semibold text-white dark:bg-[#ffbc11] dark:text-[#0c1624]">{conversation.question}</div>
                    <div className="max-w-[280px] rounded-3xl rounded-tl-none bg-white px-5 py-3 text-sm leading-6 text-slate-700 shadow-sm dark:bg-[#202c42] dark:text-slate-200">
                      {isThinking && index === conversations.length - 1 && !conversation.answer ? (
                        <span className="flex h-5 items-center gap-1" aria-label="Thinking">
                          {[0, 1, 2].map((dot) => (
                            <motion.span
                              key={dot}
                              className="h-2 w-2 rounded-full bg-[#116cc6] dark:bg-[#ffbc11]"
                              animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
                              transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.13 }}
                            />
                          ))}
                        </span>
                      ) : conversation.answer}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0c1528]">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">Common questions:</p>
              <div className="flex max-h-[140px] flex-wrap gap-2.5 overflow-y-auto pr-1">
                {questions.map((item) => (
                  <button key={item[0]} type="button" onClick={() => void showAnswer(item)} disabled={isThinking} className="rounded-full border-0 bg-slate-100 px-4 py-2 text-center text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-200 hover:shadow-md disabled:cursor-wait disabled:opacity-50 dark:bg-[#1a2a3a] dark:text-slate-200 dark:hover:bg-[#243547]">{item[0]}</button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-4 max-[480px]:bottom-4 max-[480px]:right-4">
        <AnimatePresence>
          {socialOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-[168px] right-6 z-50 flex flex-col items-center gap-4 max-[480px]:bottom-[144px] max-[480px]:right-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  title={social.name}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffbc11] text-[#0c1624] shadow-lg transition-all hover:scale-110 hover:bg-[#e6a500] dark:bg-[#116cc6] dark:text-white dark:hover:bg-[#0d5399] max-[480px]:h-12 max-[480px]:w-12"
                >
                  {getSocialIcon(social.icon)}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="button"
            size="icon"
            onClick={() => setSocialOpen((open) => !open)}
            className="h-14 w-14 rounded-full bg-[#116cc6] text-white shadow-[0_4px_12px_rgba(17,108,198,0.3)] hover:bg-[#0d5399] hover:shadow-[0_6px_20px_rgba(17,108,198,0.4)] dark:bg-white dark:text-[#116cc6] dark:hover:bg-slate-100 max-[480px]:h-12 max-[480px]:w-12"
            aria-label={socialOpen ? "Close social links" : "Open social links"}
            aria-expanded={socialOpen}
            title="Social Links"
          >
            {socialOpen ? <X aria-hidden="true" className="h-6 w-6" /> : (
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="h-6 w-6">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            )}
          </Button>
        </motion.div>

        <Button
          type="button"
          size="icon"
          onClick={() => setChatOpen((open) => !open)}
          className="h-14 w-14 rounded-full bg-[#ffbc11] text-[#0c1624] shadow-lg hover:scale-110 hover:bg-[#e6a500] hover:shadow-xl max-[480px]:h-12 max-[480px]:w-12 dark:bg-[#ffbc11] dark:text-[#0c1624] dark:hover:bg-[#e6a500]"
          aria-label={chatOpen ? "Close Live Chat" : "Open Live Chat"}
          aria-expanded={chatOpen}
          title="Live Chat"
        >
          {chatOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
        </Button>
      </div>
    </>
  );
}

function getSocialIcon(icon: string) {
  switch (icon) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.044-8.789 0-9.704h3.554v1.374c.43-.664 1.199-1.608 2.925-1.608 2.136 0 3.74 1.393 3.74 4.385v5.553zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.707 0-.951.77-1.708 1.963-1.708 1.192 0 1.915.757 1.94 1.708 0 .949-.748 1.707-1.988 1.707zm1.582 11.597H3.635V9.236h3.284v11.216zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 fill-none stroke-current"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
        </svg>
      );
    case "behance":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M22 7h-7V5.5h7V7zM13.5 13c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5zM9 7H2v10h7c2.209 0 4-1.791 4-4s-1.791-4-4-4z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.507 14.307l-.611-1.418a1.5 1.5 0 0 0-2.275.236l-.5.707a.5.5 0 0 1-.735.047l-1.95-1.95a.5.5 0 0 1 .047-.735l.707-.5a1.5 1.5 0 0 0 .236-2.275l-1.418-.611A1.5 1.5 0 0 0 8 9.5c-.1 0-.2.01-.3.03-4.6.5-8.2 4.2-8.2 8.7 0 4.91 3.99 8.9 8.9 8.9 4.5 0 8.2-3.6 8.7-8.2.02-.1.03-.2.03-.3a1.5 1.5 0 0 0-1.093-1.423z" />
        </svg>
      );
    default:
      return null;
  }
}
