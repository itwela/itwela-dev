'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FiDownload, FiExternalLink } from 'react-icons/fi'

export default function ResumePage() {
  const resume = useQuery(api.resume.get)
  const loading = resume === undefined
  const link = resume?.downloadUrl?.trim() || ''

  return (
    <main className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#050816] text-white">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-300/80 mb-2">Resume</p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            {resume?.name ?? 'Itwela Ibomu'}
          </h1>
          {resume?.citizenship && (
            <p className="text-sm mt-1 text-purple-100/80">{resume.citizenship}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-purple-100/80">
            {resume?.email && <span>{resume.email}</span>}
            {resume?.linkedin && (
              <>
                <span>·</span>
                <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                  LinkedIn <FiExternalLink size={10} />
                </a>
              </>
            )}
            {resume?.github && (
              <>
                <span>·</span>
                <a href={resume.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                  GitHub <FiExternalLink size={10} />
                </a>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={link || '#'}
              onClick={(e) => { if (!link) e.preventDefault() }}
              target={link ? '_blank' : undefined}
              rel={link ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                link
                  ? 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                  : 'border-white/15 text-white/40 bg-white/5'
              }`}
            >
              <FiExternalLink size={11} />
              Open PDF
            </a>
            <a
              href={link || '#'}
              onClick={(e) => { if (!link) e.preventDefault() }}
              target={link ? '_blank' : undefined}
              rel={link ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                link
                  ? 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                  : 'border-white/15 text-white/40 bg-white/5'
              }`}
            >
              <FiDownload size={11} />
              Download
            </a>
          </div>
        </header>

        <section className="space-y-6 text-sm leading-relaxed text-gray-100">
          <Block title="Education" loading={loading}>
            {(resume?.education ?? []).map((edu, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{edu.school}</div>
                  <div className="text-xs text-purple-100/80 mt-0.5">{edu.degree}</div>
                  {edu.coursework && (
                    <div className="text-xs text-purple-100/60 mt-1">{edu.coursework}</div>
                  )}
                </div>
                <div className="text-xs text-purple-100/60 text-right flex-shrink-0">
                  <div>{edu.location}</div>
                  <div>{edu.period}</div>
                </div>
              </div>
            ))}
          </Block>

          <Block title="Experience" loading={loading}>
            {(resume?.experience ?? []).map((exp, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{exp.title}</div>
                    <div className="text-xs text-purple-100/80 mt-0.5">{exp.company}</div>
                  </div>
                  <div className="text-xs text-purple-100/60 text-right flex-shrink-0">
                    <div>{exp.period}</div>
                    <div>{exp.location}</div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-xs text-gray-100">
                      <span className="text-purple-300/80 flex-shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Block>

          <Block title="Projects" loading={loading}>
            {(resume?.projects ?? []).map((proj, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-semibold">
                    {proj.title}
                    {proj.tech && (
                      <span className="font-normal text-purple-100/70"> · {proj.tech}</span>
                    )}
                  </div>
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-300 hover:underline flex-shrink-0 inline-flex items-center gap-1"
                    >
                      View <FiExternalLink size={10} />
                    </a>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {proj.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-xs text-gray-100">
                      <span className="text-purple-300/80 flex-shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Block>

          <Block title="Technical Skills" loading={loading}>
            {(resume?.skills ?? []).map((s, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <span className="w-32 flex-shrink-0 font-semibold text-purple-100/80">{s.group}</span>
                <span className="text-gray-100">{s.items}</span>
              </div>
            ))}
          </Block>
        </section>
      </div>
    </main>
  )
}

function Block({
  title,
  loading,
  children,
}: {
  title: string
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] uppercase tracking-[0.2em] text-purple-200/85">{title}</h2>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-white/10 rounded w-3/4" />
          ))}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

