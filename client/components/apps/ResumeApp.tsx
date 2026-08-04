'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FiDownload, FiExternalLink } from 'react-icons/fi'

export function ResumeApp() {
  const resume = useQuery(api.resume.get)
  const seed   = useMutation(api.resume.seed)
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const loading = resume === undefined
  const resumeLink = resume?.downloadUrl?.trim() || ''

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const copyLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itwela.dev'
    const url = `${origin}/?app=resume`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 1800)
    } catch {
      // ignore
    }
  }

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
    <div className="h-full flex flex-col mac-content-bg" style={{ fontSize: '13px' }}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-2 finder-sidebar border-b border-black/5 dark:border-white/10">
        <span className="sidebar-text text-xs font-medium">Resume — {resume?.name ?? 'Itwela Ibomu'}</span>
        <div className="flex items-center gap-2">
          {!resume && !loading && (
            <button onClick={() => seed()} className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
              + Seed Resume
            </button>
          )}
          <button
            onClick={copyLink}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/80 transition-colors"
            title="Copy link to Resume"
          >
            {copiedLink ? '✓ Copied' : '⎘ Copy Link'}
          </button>
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

      {/* The compact layout embeds the PDF; desktop now does the same so both
          views show the identical document instead of diverging into a
          hand-rendered text copy that has to be kept in sync. */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#17191d]">
        {resumeLink ? (
          <iframe
            src={resumeLink}
            title="Resume preview"
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center px-6">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-white/80">Preview unavailable</div>
              <div className="text-xs mt-1 text-gray-500 dark:text-white/50">
                Add your resume link in the content manager to show it here.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
