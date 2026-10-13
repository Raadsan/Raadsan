import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Check, CheckCircle2, Code2, GraduationCap, Globe2, Server, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import FloatingContact from "@/components/website/FloatingContact";
import DomainSection from "@/components/website/DomainSection";
import HostingPackagesSection from "@/components/website/HostingPackagesSection";
import WhyChooseSection from "@/components/website/WhyChooseSection";

type ServiceDetail = {
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  deliverables: string[];
  technologies: string[];
};

const serviceDetails: Record<string, ServiceDetail> = {
  "web-hosting": {
    title: "Web Hosting & Domain",
    tagline: "Your domain and reliable hosting, together in one place.",
    description: "Find the right domain, launch your website, and keep it running on fast, secure infrastructure with simple management and expert support.",
    icon: Server,
    benefits: ["99.9% uptime guarantee", "Fast NVMe SSD storage", "Free SSL certificates", "Automated daily backups", "24/7 technical support", "Easy cPanel management"],
    deliverables: ["Hosting account setup", "Website or application migration", "Security and SSL configuration", "Backup and monitoring setup"],
    technologies: ["NVMe SSD", "cPanel", "CloudLinux", "LiteSpeed"],
  },
  "domain-registration": {
    title: "Domain Registration",
    tagline: "Give your brand the right home online.",
    description: "Secure and manage the perfect domain name with reliable DNS, privacy protection, and support for global and local extensions.",
    icon: Globe2,
    benefits: ["Global and local TLDs", "Free WHOIS privacy", "Fast DNS management", "Domain transfer support", "Renewal protection", "DNSSEC security"],
    deliverables: ["Domain search and registration", "DNS record configuration", "Privacy and security setup", "Email and hosting connection"],
    technologies: ["DNSSEC", "Anycast DNS", "WHOIS Privacy", "Domain Guard"],
  },
  "software-development": {
    title: "Custom Software Development",
    tagline: "Software designed around how your business works.",
    description: "We design and build scalable web applications, management systems, portals, and platforms that solve real operational challenges.",
    icon: Code2,
    benefits: ["Purpose-built workflows", "Scalable architecture", "Secure API integrations", "Responsive user experience", "Quality assurance", "Long-term support"],
    deliverables: ["Product discovery and planning", "UI/UX design", "Frontend and backend development", "Testing, deployment, and support"],
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "Python"],
  },
  "ai-solutions": {
    title: "AI-Driven Solutions",
    tagline: "Turn data and repetitive work into intelligent outcomes.",
    description: "We integrate practical artificial intelligence into your organization through assistants, automation, analytics, and custom intelligent workflows.",
    icon: Sparkles,
    benefits: ["Custom AI assistants", "Process automation", "Predictive insights", "Faster customer support", "Knowledge search", "Secure integrations"],
    deliverables: ["AI opportunity assessment", "Prototype and validation", "Model and workflow integration", "Monitoring and continuous improvement"],
    technologies: ["OpenAI API", "Python", "FastAPI", "PyTorch", "TensorFlow"],
  },
  "mobile-app-development": {
    title: "Mobile App Development",
    tagline: "Modern mobile experiences for iOS and Android.",
    description: "From concept to launch, we create intuitive and dependable mobile apps connected to secure cloud services and designed for real users.",
    icon: Smartphone,
    benefits: ["iOS and Android support", "Intuitive UI/UX", "Offline capability", "Push notifications", "Secure cloud APIs", "Store publishing support"],
    deliverables: ["Product strategy and wireframes", "Mobile UI/UX design", "App and backend development", "Testing and store launch"],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
  },
  "ict-training": {
    title: "ICT Training & Consultancy",
    tagline: "Practical expertise that strengthens your team.",
    description: "Build internal capability and make better technology decisions through hands-on training, security reviews, and strategic IT guidance.",
    icon: GraduationCap,
    benefits: ["Customized workshops", "Experienced trainers", "Hands-on learning", "Cybersecurity audits", "Infrastructure reviews", "Strategic IT roadmaps"],
    deliverables: ["Skills and needs assessment", "Tailored training program", "Consultancy findings and recommendations", "Implementation roadmap"],
    technologies: ["Cloud Security", "DevOps", "IT Governance", "Agile", "Cybersecurity"],
  },
};

export function generateStaticParams() {
  return Object.keys(serviceDetails).map((slug) => ({ slug }));
}

/** CMS / alternate slugs → existing service page keys */
const slugAliases: Record<string, string> = {
  "domain-registration": "web-hosting",
  "web-hosting-domain": "web-hosting",
  "custom-software-development": "software-development",
  "ai-driven-solutions": "ai-solutions",
  "ict-training-consultancy": "ict-training",
  "ict-training&consultancy": "ict-training",
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const canonical = slugAliases[slug] || slug;

  if (canonical !== slug) redirect(`/services/${canonical}`);

  const service = serviceDetails[canonical];
  if (!service) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <section
          className="relative flex flex-col items-center justify-center overflow-hidden bg-[#f6f9ff] px-6 pb-24 pt-[calc(var(--header-height)+100px)] text-center dark:bg-[#020b1d]"
          aria-labelledby="service-hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-[-60px] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.13),transparent_70%)]" />
            <div className="absolute right-[-100px] top-[40px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,17,0.09),transparent_70%)]" />
            <div className="absolute bottom-[-20px] left-[-60px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,108,198,0.07),transparent_70%)]" />
          </div>
          <h1
            id="service-hero-heading"
            className="relative z-10 max-w-[900px] text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.12] tracking-[-0.045em] text-[var(--foreground)]"
          >
            Explore&nbsp;
            <span className="text-[#116cc6] dark:text-[#ffbc11]">{service.title}</span>
          </h1>
          <p className="relative z-10 mt-5 max-w-[650px] text-[clamp(17px,1.5vw,20px)] leading-[1.65] text-[var(--muted)]">
            {service.description}
          </p>
        </section>

        {canonical === "web-hosting" && (
          <>
            <DomainSection />
            <HostingPackagesSection />
          </>
        )}

        {canonical !== "web-hosting" && (
          <section className="bg-[#f6f9ff] px-6 py-24 dark:bg-[#020917]" aria-labelledby="service-offering-title">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 id="service-offering-title" className="text-[clamp(36px,4.5vw,54px)] font-black leading-tight tracking-[-0.04em]">
                  What We <span className="text-[#116cc6] dark:text-[#ffbc11]">Offer</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                  Essential capabilities designed to deliver a reliable solution that supports your goals.
                </p>
              </div>

              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {service.benefits.map((benefit) => (
                  <article key={benefit} className="group rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#116cc6]/35 hover:shadow-xl dark:border-white/[0.08] dark:bg-[#09172d] dark:hover:border-[#ffbc11]/35">
                    <div className="flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#116cc6]/10 text-[#116cc6] transition-colors group-hover:bg-[#116cc6] group-hover:text-white dark:bg-[#ffbc11]/10 dark:text-[#ffbc11] dark:group-hover:bg-[#ffbc11] dark:group-hover:text-[#122035]">
                        <Check className="h-5 w-5 stroke-[2.5]" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-lg font-extrabold">{benefit}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Included as part of our end-to-end {service.title.toLowerCase()} service.</p>
                  </article>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Link href="/contact" className="inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#116cc6] px-8 font-extrabold text-white shadow-lg shadow-[#116cc6]/20 transition hover:-translate-y-0.5 dark:bg-[#ffbc11] dark:text-[#122035]">
                  Discuss your project <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#f6f9ff] px-6 py-24 dark:bg-[#020917]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#116cc6] dark:text-[#ffbc11]">Our delivery process</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">A clear path from idea to launch.</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-[var(--muted)]">You always know what we are working on, what comes next, and how each stage supports the final result.</p>
            </div>
            <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-[#116cc6]/20 via-[#116cc6]/50 to-[#ffbc11]/40 lg:block" />
              {service.deliverables.map((item, index) => (
                <article key={item} className="relative rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-white/[0.08] dark:bg-[#09172d]">
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-[#116cc6] text-sm font-black text-white shadow-md dark:bg-[#ffbc11] dark:text-[#122035]">0{index + 1}</span>
                  <h3 className="mt-7 text-lg font-extrabold">{item}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Planned collaboratively, completed carefully, and reviewed before moving forward.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <WhyChooseSection />

        <section className="bg-white px-6 py-24 dark:bg-[#030d21]">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-[#f7faff] px-8 py-12 shadow-[0_18px_55px_rgba(17,108,198,0.09)] dark:border-white/[0.08] dark:bg-[#08162c] md:px-12 md:py-14">
            <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
              <div className="flex max-w-3xl items-start gap-5">
                <div className="hidden h-14 w-14 flex-none items-center justify-center rounded-2xl bg-[#116cc6]/10 text-[#116cc6] dark:bg-[#ffbc11]/10 dark:text-[#ffbc11] sm:flex">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#116cc6] dark:text-[#ffbc11]">Let&apos;s work together</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">Ready to bring your idea to life?</h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">Share your goals with our team and we&apos;ll help you choose the right way forward.</p>
                </div>
              </div>
              <Link href="/contact" className="inline-flex min-h-14 flex-none items-center gap-3 rounded-xl bg-[#116cc6] px-8 font-extrabold text-white shadow-lg shadow-[#116cc6]/20 transition hover:-translate-y-0.5 hover:bg-[#0b559e] dark:bg-[#ffbc11] dark:text-[#122035] dark:hover:bg-[#eaaa00]">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
