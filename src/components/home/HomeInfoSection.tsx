"use client"

import { ShieldCheck, Zap, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  {
    icon: <Zap className="w-10 h-10 text-[#D4A44A]" />,
    title: "Natychmiastowa Dostawa",
    desc: "Otrzymaj klucz cyfrowy w kilka sekund po zakupie.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-[#D4A44A]" />,
    title: "Bezpieczne Płatności",
    desc: "Zaufane metody płatności i szyfrowane połączenie.",
  },
  {
    icon: <BadgeCheck className="w-10 h-10 text-[#D4A44A]" />,
    title: "Gwarancja Legalności",
    desc: "Wszystkie produkty pochodzą z autoryzowanych źródeł.",
  },
]

export function HomeInfoSection() {
  return (
    <section className="bg-[#2A2A2A] py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="bg-[#1C1C1C] border border-[#3A3A3A] rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h4 className="text-[#F8F8F8] font-bold text-xl mb-2">{item.title}</h4>
            <p className="text-[#A0A0A0]">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
