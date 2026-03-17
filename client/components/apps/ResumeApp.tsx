'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FiDownload, FiExternalLink } from 'react-icons/fi'

export function ResumeApp() {
  const resume = useQuery(api.resume.get)
  const seed   = useMutation(api.resume.seed)
  const [isCompactLayout, setIsCompactLayout] = useState(false)

  const loading = resume === undefined
  const resumeLink = resume?.downloadUrl?.trim() || ''

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (isCompactLayout) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-[#0f1013] text-gray-900 dark:text-white">
        <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#14161a]/95 backdrop-blur-md">
          <div className="text-[22px] font-semibold leading-tight">{resume?.name ?? 'Resume'}</div>
          <div className="text-[12px] text-gray-500 dark:text-white/55 mt-1">Resume</div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] font-medium text-gray-700 dark:text-white/80">Live Preview</div>
              <div className="text-[11px] text-gray-500 dark:text-white/45">PDF / Link</div>
            </div>

            <div className="mt-2 h-[52vh] min-h-[320px] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#17191d]">
              {resumeLink ? (
                <iframe
                  src={resumeLink}
                  title="Resume preview"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center px-5">
                  <div>
                    <div className="text-[14px] font-medium text-gray-700 dark:text-white/80">Preview coming soon</div>
                    <div className="text-[12px] mt-1 text-gray-500 dark:text-white/50">Add your resume link in content manager to show it here.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={resumeLink || '#'}
                onClick={(e) => { if (!resumeLink) e.preventDefault() }}
                target={resumeLink ? '_blank' : undefined}
                rel={resumeLink ? 'noopener noreferrer' : undefined}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium border ${
                  resumeLink
                    ? 'border-blue-500/35 text-blue-600 dark:text-blue-300 bg-blue-500/10'
                    : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/35 bg-gray-100 dark:bg-white/[0.03]'
                }`}
              >
                <FiExternalLink size={12} />
                Open Link
              </a>
              <a
                href={resumeLink || '#'}
                onClick={(e) => { if (!resumeLink) e.preventDefault() }}
                target={resumeLink ? '_blank' : undefined}
                rel={resumeLink ? 'noopener noreferrer' : undefined}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium border ${
                  resumeLink
                    ? 'border-blue-500/35 text-blue-600 dark:text-blue-300 bg-blue-500/10'
                    : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/35 bg-gray-100 dark:bg-white/[0.03]'
                }`}
              >
                <FiDownload size={12} />
                Download
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-4">
            <div className="text-[12px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/45 mb-2">Contact</div>
            <div className="space-y-1.5 text-[13px]">
              {resume?.email && <div className="text-gray-700 dark:text-white/80">{resume.email}</div>}
              {resume?.linkedin && (
                <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 inline-flex items-center gap-1">
                  LinkedIn <FiExternalLink size={11} />
                </a>
              )}
              {resume?.github && (
                <a href={resume.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 inline-flex items-center gap-1">
                  GitHub <FiExternalLink size={11} />
                </a>
              )}
            </div>
          </div>

          {!resume && !loading && (
            <button
              onClick={() => seed()}
              className="w-full rounded-lg px-3 py-2 text-[12px] font-medium text-gray-600 dark:text-white/70 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10"
            >
              + Seed Resume
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto mac-content-bg" style={{ fontSize: '13px' }}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-2 finder-sidebar border-b border-black/5 dark:border-white/10">
        <span className="sidebar-text text-xs font-medium">Resume — {resume?.name ?? 'Itwela Ibomu'}</span>
        <div className="flex items-center gap-2">
          {!resume && !loading && (
            <button onClick={() => seed()} className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
              + Seed Resume
            </button>
          )}
          <a
            href={resumeLink || '#'}
            onClick={(e) => { if (!resumeLink) e.preventDefault() }}
            target={resumeLink ? '_blank' : undefined}
            rel={resumeLink ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            style={{ background: 'rgba(0,122,255,0.15)', color: 'rgb(0,122,255)' }}
          >
            <FiDownload size={11} /> Download PDF
          </a>
        </div>
      </div>

      <div className="px-8 py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{resume?.name ?? '—'}</h1>
          {resume?.citizenship && <p className="text-xs mt-1 text-gray-500 dark:text-white/50">{resume.citizenship}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-400 dark:text-white/40">
            {resume?.email && <span>{resume.email}</span>}
            {resume?.email && <span>·</span>}
            {resume?.linkedin && (
              <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                {resume.linkedin.replace('https://', '')} <FiExternalLink size={10} />
              </a>
            )}
            {resume?.github && <span>·</span>}
            {resume?.github && (
              <a href={resume.github} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                {resume.github.replace('https://', '')} <FiExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {/* Education */}
        <section className="mb-6">
          <SectionHeader>Education</SectionHeader>
          {loading ? <Skeleton /> : (resume?.education ?? []).map((edu, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{edu.school}</div>
                <div className="text-xs mt-0.5 text-gray-500 dark:text-white/50">{edu.degree}</div>
                {edu.coursework && <div className="text-xs mt-1 text-gray-500 dark:text-white/50">{edu.coursework}</div>}
              </div>
              <div className="text-xs flex-shrink-0 text-right text-gray-400 dark:text-white/40">
                <div>{edu.location}</div>
                <div>{edu.period}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="mb-6">
          <SectionHeader>Experience</SectionHeader>
          {loading ? <Skeleton /> : (
            <div className="space-y-5">
              {(resume?.experience ?? []).map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{exp.title}</div>
                      <div className="text-xs mt-0.5 text-gray-500 dark:text-white/50">{exp.company}</div>
                    </div>
                    <div className="text-xs flex-shrink-0 text-right text-gray-400 dark:text-white/40">
                      <div>{exp.period}</div>
                      <div>{exp.location}</div>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-xs flex gap-2 text-gray-600 dark:text-white/60">
                        <span className="text-gray-500 dark:text-white/50 flex-shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Projects */}
        <section className="mb-6">
          <SectionHeader>Projects</SectionHeader>
          {loading ? <Skeleton /> : (
            <div className="space-y-5">
              {(resume?.projects ?? []).map((proj, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {proj.title}
                      {proj.tech && <span className="font-normal text-gray-500 dark:text-white/40"> | {proj.tech}</span>}
                    </div>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs text-blue-500 hover:underline flex items-center gap-1">
                        <FiExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {proj.bullets.map((b, j) => (
                      <li key={j} className="text-xs flex gap-2 text-gray-600 dark:text-white/60">
                        <span className="text-gray-500 dark:text-white/50 flex-shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills */}
        <section>
          <SectionHeader>Technical Skills</SectionHeader>
          {loading ? <Skeleton /> : (
            <div className="space-y-1.5">
              {(resume?.skills ?? []).map((s, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-500 dark:text-white/50">{s.group}</span>
                  <span className="text-gray-700 dark:text-white/70">{s.items}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400 dark:text-white/30">
      {children}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2].map(i => <div key={i} className="h-3 bg-black/5 dark:bg-white/5 rounded w-3/4" />)}
    </div>
  )
}
