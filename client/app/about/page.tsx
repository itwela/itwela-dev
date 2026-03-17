'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function AboutPage() {
  const cards = useQuery(api.projects.getAll)

  const aboutCard = cards?.find((c) => c.cardType === 'about') ?? null
  const skillsCards = cards?.filter((c) => c.cardType === 'skill') ?? []

  const name = aboutCard?.title ?? 'Itwela Ibomu'
  const role = aboutCard?.description ?? 'AI product engineer & technical solutions specialist'
  const bio = aboutCard?.longDescription ?? aboutCard?.body ?? ''

  return (
    <main className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#050816] text-white">
      <div className="mx-auto max-w-3xl px-5 py-10 space-y-10">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-300/80 mb-2">About</p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            {name}
          </h1>
          <p className="mt-2 text-sm md:text-base text-purple-100/80">
            {role}
          </p>
        </header>

        <section className="space-y-4 text-sm md:text-base text-gray-200 leading-relaxed">
          {bio
            ? bio.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            : (
              <p>
                I design and ship AI‑driven products end‑to‑end – from backend architecture and data
                modeling to frontend experience and deployment. This portfolio demonstrates that with a live
                macOS‑style desktop, global music system, AI agent, and embedded JobKompass app.
              </p>
            )}
        </section>

        {skillsCards.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-200">Technical Skills</h2>
            <div className="space-y-3">
              {skillsCards.map((card) => (
                <div key={card._id} className="space-y-1">
                  <p className="text-xs font-semibold text-purple-100/80 uppercase tracking-[0.14em]">
                    {card.description}
                  </p>
                  <p className="text-sm text-gray-200">
                    {card.tags.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

