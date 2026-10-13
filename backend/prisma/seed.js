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

async function main() {
  for (const item of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: {
        name: item.name,
        company: item.company,
      },
    })

    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: item,
      })
      console.log(`Updated testimonial: ${item.name}`)
    } else {
      await prisma.testimonial.create({ data: item })
      console.log(`Created testimonial: ${item.name}`)
    }
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
