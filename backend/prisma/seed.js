import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const testimonials = [
  {
    name: "Ahmed Hassan",
    role: "Managing Director",
    company: "SomTech Solutions",
    content:
      "Raadsan transformed our operational workflow with custom software that saved our engineering team hundreds of hours each month. Their support is outstanding.",
    rating: 5,
    initials: "AH",
    order: 1,
  },
  {
    name: "Fatima Mohamed",
    role: "Head of Operations",
    company: "Global Logistics Ltd",
    content:
      "Our website uptime and speed improved dramatically after migrating to Raadsan's NVMe Cloud Hosting. Highly reliable enterprise hosting with genuine 24/7 support.",
    rating: 5,
    initials: "FM",
    order: 2,
  },
  {
    name: "Omar Ali",
    role: "CEO & Co-Founder",
    company: "Apex Digital Agency",
    content:
      "From domain registration to full custom ERP deployment, Raadsan delivers top-notch quality on every single project. Strongly recommend them to any growing business.",
    rating: 5,
    initials: "OA",
    order: 3,
  },
  {
    name: "Dr. Abdullahi Nur",
    role: "IT Director",
    company: "Digfeer Health Services",
    content:
      "Raadsan built a highly secure database system for our medical records. The efficiency gains and ease of use for our staff have been phenomenal.",
    rating: 5,
    initials: "AN",
    order: 4,
  },
  {
    name: "Zamzam Farah",
    role: "General Manager",
    company: "Horn Retail Enterprise",
    content:
      "Their mobile app development team brought our retail app idea to life in record time. User engagement went up by 150% in the first quarter post-launch.",
    rating: 5,
    initials: "ZF",
    order: 5,
  },
]

const contactHero = {
  title: "Contact Our Team",
  highlight: "",
  subtitle:
    "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  order: 1,
}

const contactInformation = [
  {
    icon: "mail",
    label: "Email Us",
    value: "info@raadsantech.so",
    href: "mailto:info@raadsantech.so",
    order: 1,
  },
  {
    icon: "phone",
    label: "Phone",
    value: "+252 61 4897510",
    href: "tel:+252614897510",
    order: 2,
  },
  {
    icon: "map",
    label: "Office",
    value: "HQ Digfeer, Hodan, Mogadishu, Somalia",
    href: null,
    order: 3,
  },
]

const products = [
  {
    title: "E-Commerce System",
    slug: "ecommerce",
    description:
      "Launch your online store, manage inventory seamlessly, and accept local mobile money (EVC Plus, eDahab) & credit cards in one platform.",
    order: 1,
    features: [
      {
        icon: "lock",
        title: "Authentication",
        description:
          "Secure OTP login, SMS/Email verification, social logins & token session auth.",
      },
      {
        icon: "package",
        title: "Products & Categories",
        description:
          "Multi-level category hierarchy, subcategories, product variants & image galleries.",
      },
      {
        icon: "search",
        title: "Search & Filter",
        description:
          "Instant auto-complete search with history memory, price sliders & tag filters.",
      },
      {
        icon: "shopping-bag",
        title: "Cart & Wishlist",
        description:
          "Real-time cart quantity controls, price calculation & server-synced wishlist.",
      },
      {
        icon: "credit-card",
        title: "Checkout & Payments",
        description:
          "Fast checkout with EVC Plus, eDahab, Zaad, Sahal, Visa & Mastercard support.",
      },
      {
        icon: "truck",
        title: "Orders & Tracking",
        description:
          "Real-time order status timeline, delivery courier assignment & push notifications.",
      },
      {
        icon: "layers",
        title: "Inventory",
        description:
          "Automatic stock deduction, low-stock warnings & multi-warehouse inventory management.",
      },
      {
        icon: "star",
        title: "Reviews & Ratings",
        description:
          "Customer product ratings, photo reviews & verified buyer badge verification.",
      },
      {
        icon: "ticket",
        title: "Coupons & Discounts",
        description:
          "Promo code management, percentage/fixed discounts & flash sale timers.",
      },
      {
        icon: "layout-dashboard",
        title: "Admin Dashboard",
        description:
          "Complete web management hub for store administrators & operational managers.",
      },
      {
        icon: "users",
        title: "Customers & Users",
        description:
          "Customer directory, user roles, permission management & customer activity logs.",
      },
      {
        icon: "settings",
        title: "Reports & Settings",
        description:
          "Sales revenue analytics, exportable reports, store profile & payment settings.",
      },
    ],
  },
  {
    title: "Coffee Shop System",
    slug: "coffee-system",
    description:
      "Speed up barista orders, track inventory per shot, print receipts, and accept EVC Plus & eDahab payments effortlessly.",
    order: 2,
    features: [
      {
        icon: "monitor",
        title: "Touchscreen POS Terminal",
        description:
          "Ultra-responsive touch interface designed for fast barista ordering during morning rush hours.",
      },
      {
        icon: "receipt",
        title: "Instant EVC Plus Receipts",
        description:
          "Automatic phone payment prompts for Hormuud EVC Plus & eDahab with receipt printing.",
      },
      {
        icon: "utensils",
        title: "Table & Order Management",
        description:
          "Visual floor map for dine-in tables, takeaway order queues, and kitchen display integration.",
      },
      {
        icon: "flame",
        title: "Recipe & Milk Stock Tracking",
        description:
          "Automatic inventory deduction per espresso shot, syrup pumps, milk liters, and baked goods.",
      },
      {
        icon: "users",
        title: "Staff Shifts & Cash Register",
        description:
          "Daily shift opening/closing audits, cash drawer reconciliation, and barista sales tracking.",
      },
      {
        icon: "clock",
        title: "Real-Time Sales Reports",
        description:
          "Instant access to hourly revenue spikes, peak customer hours, and top-performing beverages.",
      },
    ],
  },
]

const aboutCompany = {
  title: "About our company",
  content:
    "Raadsan Technology is a technology and consulting firm delivering smart, scalable, and secure digital solutions that help organizations grow and innovate. We work with startups, enterprises, and public institutions to design and build modern systems, mobile applications, and AI-powered solutions.\n\nOur focus is on creating reliable technology that solves real business challenges. By combining innovation, technical expertise, and strategic thinking, we empower organizations to streamline operations, enhance decision-making, and achieve sustainable long-term success.",
  image: "/images/about image.jpg",
}

const aboutVisionMission = [
  {
    type: "vision",
    title: "Our Vision",
    text: "To be a trusted technology partner that helps organizations across Somalia and beyond thrive in a connected world.",
    icon: "eye",
    order: 1,
  },
  {
    type: "mission",
    title: "Our Mission",
    text: "To deliver accessible, dependable, and innovative digital solutions that create lasting value for our clients and communities.",
    icon: "target",
    order: 2,
  },
]

const aboutCoreValues = [
  {
    title: "Innovation",
    text: "We turn ambitious ideas into useful, future-ready digital products.",
    icon: "lightbulb",
    order: 1,
  },
  {
    title: "Integrity",
    text: "We work transparently, communicate clearly, and keep every promise.",
    icon: "shield",
    order: 2,
  },
  {
    title: "Excellence",
    text: "We care about the details and hold every solution to a high standard.",
    icon: "medal",
    order: 3,
  },
  {
    title: "Partnership",
    text: "We grow alongside our clients through trust and shared success.",
    icon: "handshake",
    order: 4,
  },
]

const aboutWhyChoose = [
  {
    title: "Experienced Technology Team",
    text: "Our multidisciplinary specialists combine technical expertise, creative thinking, and local market knowledge to solve complex challenges.",
    icon: "users",
    order: 1,
  },
  {
    title: "Solutions Built Around You",
    text: "We design every solution around your organization's goals, workflows, and users—so the technology delivers practical business value.",
    icon: "settings",
    order: 2,
  },
  {
    title: "Reliable Long-Term Support",
    text: "From planning and delivery to maintenance and growth, our team remains available with dependable guidance and responsive support.",
    icon: "lifebuoy",
    order: 3,
  },
  {
    title: "Scalable, Future-Ready Systems",
    text: "Our solutions are engineered to perform today and evolve tomorrow, giving your organization room to grow without unnecessary limitations.",
    icon: "zap",
    order: 4,
  },
  {
    title: "Security You Can Trust",
    text: "We apply dependable security practices throughout every project to protect your systems, business information, and users.",
    icon: "lock",
    order: 5,
  },
  {
    title: "Local Insight, Global Quality",
    text: "We understand the local environment while applying modern international standards to deliver relevant, high-quality digital products.",
    icon: "globe",
    order: 6,
  },
]

const faqs = [
  {
    question: "What web hosting packages does Raadsan Tech offer?",
    answer:
      "Raadsan Tech offers high-performance NVMe Cloud Hosting, cPanel Managed Hosting, Business Shared Hosting, and Dedicated Cloud Servers. All packages include free SSL certificates, automated daily backups, high-speed NVMe storage, and 99.9% uptime guarantee.",
    order: 1,
  },
  {
    question: "How fast can custom software or ERP systems be developed?",
    answer:
      "Project timelines depend on system complexity. Standard web portals and mobile applications take 2–4 weeks, while full enterprise ERPs and multi-module management systems are delivered in structured 6–8 week sprints with continuous testing and deployment.",
    order: 2,
  },
  {
    question: "Can I transfer my existing domain to Raadsan Technology?",
    answer:
      "Yes, transferring your domain to Raadsan Tech is quick and seamless. Simply request an authorization (EPP) code from your current registrar and enter it on our domain transfer page. Our team handles the configuration with zero downtime.",
    order: 3,
  },
  {
    question: "What kind of technical support do you provide after project launch?",
    answer:
      "We provide true 24/7 technical support via WhatsApp, live phone, email, and support tickets. We also offer dedicated SLA maintenance packages, security updates, database optimization, and feature enhancements.",
    order: 4,
  },
  {
    question: "What payment methods are supported for services and hosting?",
    answer:
      "We support instant local mobile payments (EVC Plus, Zaad, Sahal, Premier Bank, E-Dahab) as well as international Credit/Debit cards and Bank Wire Transfers.",
    order: 5,
  },
]

async function upsertByUnique(model, where, data, label) {
  const existing = await model.findFirst({ where })
  if (existing) {
    await model.update({ where: { id: existing.id }, data })
    console.log(`Updated ${label}`)
  } else {
    await model.create({ data })
    console.log(`Created ${label}`)
  }
}

async function main() {
  for (const item of testimonials) {
    await upsertByUnique(
      prisma.testimonial,
      { name: item.name, company: item.company },
      item,
      `testimonial: ${item.name}`,
    )
  }

  await upsertByUnique(
    prisma.contactHero,
    { subtitle: contactHero.subtitle },
    contactHero,
    "contact hero",
  )

  // Keep only email / phone / office — remove old social rows
  await prisma.contactInformation.deleteMany({
    where: {
      icon: { in: ["facebook", "instagram", "linkedin", "github"] },
    },
  })

  for (const item of contactInformation) {
    await upsertByUnique(
      prisma.contactInformation,
      { icon: item.icon, label: item.label },
      item,
      `contact info: ${item.label}`,
    )
  }

  for (const item of faqs) {
    await upsertByUnique(
      prisma.faq,
      { question: item.question },
      item,
      `faq: ${item.question.slice(0, 40)}…`,
    )
  }

  await upsertByUnique(
    prisma.aboutCompany,
    { title: aboutCompany.title },
    aboutCompany,
    "about company",
  )

  for (const item of aboutVisionMission) {
    await upsertByUnique(
      prisma.aboutVisionMission,
      { type: item.type },
      item,
      `about ${item.type}`,
    )
  }

  for (const item of aboutCoreValues) {
    await upsertByUnique(
      prisma.aboutCoreValue,
      { title: item.title },
      item,
      `core value: ${item.title}`,
    )
  }

  for (const item of aboutWhyChoose) {
    await upsertByUnique(
      prisma.aboutWhyChoose,
      { title: item.title },
      item,
      `why choose: ${item.title}`,
    )
  }

  for (const item of products) {
    await upsertByUnique(
      prisma.product,
      { slug: item.slug },
      item,
      `product: ${item.title}`,
    )
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
