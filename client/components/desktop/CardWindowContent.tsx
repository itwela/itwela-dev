'use client'

import { DesktopCard, CardContent } from '@/lib/types'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { motion } from 'framer-motion'
import { SiGithub, SiX, SiSoundcloud, SiYoutube } from 'react-icons/si'
import { BsLinkedin } from 'react-icons/bs'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

// ── Animation helpers ────────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
}

function AnimItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={item} className={className}>{children}</motion.div>
}

// ── Shared layout shell ──────────────────────────────────────────────────────

function CardShell({
  imageUrl,
  orientation,
  gradient,
  badge,
  badgeColor,
  stacked = false,
  children,
}: {
  imageUrl?: string
  orientation?: 'portrait' | 'landscape' | 'square' | 'phone'
  gradient: string
  badge: string
  badgeColor: string
  stacked?: boolean
  children: React.ReactNode
}) {
  // Image sizing inside the left panel based on orientation
  const imgStyle: React.CSSProperties =
    orientation === 'portrait'
      ? { width: 'auto', height: '60%', maxWidth: '100%', objectFit: 'cover' }
      : orientation === 'phone'
      ? { maxWidth: '100%', maxHeight: '70%', width: 'auto', height: 'auto', objectFit: 'contain' }
      : orientation === 'landscape'
      ? { width: '85%', height: 'auto', maxHeight: '48%' }
      : { width: '55%', height: 'auto', maxHeight: '65%' } // square / default

  return (
    <div className={`h-full min-h-0 ${stacked ? 'flex flex-col' : 'flex'}`}>
      {/* Left — image */}
      <div className={stacked ? 'w-full h-[42%] flex-shrink-0 flex items-center justify-center p-4 overflow-hidden' : 'w-[55%] flex-shrink-0 flex items-center justify-center p-6 h-full overflow-hidden'}>
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt=""
            className={
              orientation === 'phone'
                ? `object-contain ${stacked ? 'rounded-xl' : 'rounded-[30px]'}`
                : orientation === 'landscape'
                ? 'object-cover rounded-2xl'
                : orientation === 'portrait'
                ? `object-cover ${stacked ? 'rounded-lg' : 'rounded-2xl'}`
                : 'object-cover rounded-[40px]'
            }
            style={imgStyle}
            draggable={false}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 }}
          />
        ) : (
          <motion.div
            className="w-full rounded-[28px]"
            style={{ height: '50%', background: gradient }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          />
        )}
      </div>

      {/* Right — content animates in staggered */}
      <motion.div
        className={`flex-1 flex flex-col overflow-y-auto text-gray-900 dark:text-white ${stacked ? 'p-5' : 'p-7'}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimItem className="mb-4">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        </AnimItem>
        {children}
      </motion.div>
    </div>
  )
}

// ── Project ──────────────────────────────────────────────────────────────────

function ProjectContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'project' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone' | 'phone'; stacked?: boolean }) {
  const dbProjects = useQuery(api.projects.getAll)
  const project = dbProjects?.find((p) => p.title === content.title)
  const shortDescription = project?.description || content.description
  const longDescription = project?.longDescription
  const github = project?.githubUrl || content.github
  const live = project?.liveUrl || content.url
  const image = project?.imageUrl || imageUrl
  const orient = (project?.orientation ?? orientation) as 'portrait' | 'landscape' | 'square' | undefined

  return (
    <CardShell
      imageUrl={image}
      orientation={orient}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(168,85,247,0.35) 0%, rgba(59,130,246,0.35) 100%)"
      badge="Project"
      badgeColor="bg-purple-500/20 text-purple-700 dark:text-purple-300"
    >
      <AnimItem><h2 className="text-2xl font-bold mb-2">{content.title}</h2></AnimItem>
      <AnimItem><p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{shortDescription}</p></AnimItem>
      {longDescription && (
        <AnimItem><p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{longDescription}</p></AnimItem>
      )}
      {content.body && (
        <AnimItem><p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.body}</p></AnimItem>
      )}
      {content.highlights && content.highlights.length > 0 && (
        <AnimItem>
          <ul className="space-y-2 mb-4 flex-1">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/80">
                <span className="text-purple-400 mt-0.5 flex-shrink-0">→</span>
                {h}
              </li>
            ))}
          </ul>
        </AnimItem>
      )}
      {content.tags.length > 0 && (
        <AnimItem>
          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
            {content.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </AnimItem>
      )}
      <AnimItem>
        <div className="flex gap-3 flex-wrap">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-800 dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors">
              <FiGithub size={14} /> GitHub
            </a>
          )}
          {live && live !== '#' && (
            <a href={live} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-700 dark:text-white bg-blue-500/20 dark:bg-blue-500/30 hover:bg-blue-500/30 dark:hover:bg-blue-500/40 transition-colors">
              <FiExternalLink size={14} /> Visit Site
            </a>
          )}
        </div>
      </AnimItem>
    </CardShell>
  )
}

// ── Achievement ───────────────────────────────────────────────────────────────

function AchievementContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'achievement' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone'; stacked?: boolean }) {
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(234,179,8,0.35) 0%, rgba(249,115,22,0.3) 100%)"
      badge="Achievement"
      badgeColor="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
    >
      <AnimItem><h2 className="text-2xl font-bold mb-2">{content.title}</h2></AnimItem>
      <AnimItem><p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.description}</p></AnimItem>
      {content.body && (
        <AnimItem><p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.body}</p></AnimItem>
      )}
      {content.highlights.length > 0 && (
        <AnimItem>
          <ul className="space-y-2 mb-4 flex-1">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/80">
                <span className="text-yellow-500 mt-0.5 flex-shrink-0">→</span>
                {h}
              </li>
            ))}
          </ul>
        </AnimItem>
      )}
      <AnimItem>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {content.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </AnimItem>
    </CardShell>
  )
}

// ── Role ─────────────────────────────────────────────────────────────────────

function RoleContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'role' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone'; stacked?: boolean }) {
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(6,182,212,0.25) 100%)"
      badge="Role"
      badgeColor="bg-green-500/20 text-green-700 dark:text-green-300"
    >
      <AnimItem>
        <h2 className="text-2xl font-bold mb-0.5">{content.title}</h2>
        <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-0.5">{content.company}</p>
        <p className="text-gray-400 dark:text-white/40 text-xs mb-4">{content.period}</p>
      </AnimItem>
      <AnimItem><p className="text-green-700 dark:text-green-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.description}</p></AnimItem>
      {content.body && (
        <AnimItem><p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.body}</p></AnimItem>
      )}
      {content.highlights.length > 0 && (
        <AnimItem>
          <ul className="space-y-2 mb-4 flex-1">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/80">
                <span className="text-green-500 mt-0.5 flex-shrink-0">→</span>
                {h}
              </li>
            ))}
          </ul>
        </AnimItem>
      )}
      <AnimItem>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {content.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-700 dark:text-green-300 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </AnimItem>
    </CardShell>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

function AboutContent({
  content,
  imageUrl,
  orientation,
  stacked,
}: {
  content: Extract<CardContent, { type: 'about' }>
  imageUrl?: string
  orientation?: 'portrait' | 'landscape' | 'square' | 'phone'
  stacked?: boolean
}) {
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(236,72,153,0.2) 100%)"
      badge="About"
      badgeColor="bg-rose-500/20 text-rose-700 dark:text-rose-300"
    >
      <AnimItem><h2 className="text-2xl font-bold mb-1">{content.name}</h2></AnimItem>
      <AnimItem><p className="text-rose-600 dark:text-rose-300 text-sm mb-4">{content.role}</p></AnimItem>
      <AnimItem><p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.bio}</p></AnimItem>
      {content.body && (
        <AnimItem>
          <p className="text-gray-600 dark:text-white/65 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {content.body}
          </p>
        </AnimItem>
      )}
      {content.highlights && content.highlights.length > 0 && (
        <AnimItem>
          <ul className="space-y-2 mb-4 flex-1">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/80">
                <span className="text-rose-400 mt-0.5 flex-shrink-0">→</span>
                {h}
              </li>
            ))}
          </ul>
        </AnimItem>
      )}
      {content.tags.length > 0 && (
        <AnimItem>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {content.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </AnimItem>
      )}
    </CardShell>
  )
}

// ── Skill ─────────────────────────────────────────────────────────────────────

function SkillContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'skill' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone'; stacked?: boolean }) {
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.25) 100%)"
      badge="Skills"
      badgeColor="bg-sky-500/20 text-sky-700 dark:text-sky-300"
    >
      <AnimItem><h2 className="text-2xl font-bold mb-1">{content.title}</h2></AnimItem>
      <AnimItem><p className="text-sky-700 dark:text-sky-300 text-xs mb-5">{content.category}</p></AnimItem>
      <AnimItem>
        <div className="flex flex-wrap gap-2 flex-1 content-start">
          {content.skills.map((skill, i) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full text-sm font-semibold text-gray-800 dark:text-gray-100"
              style={{
                background: `hsla(${(i * 43 + 25) % 360}, 78%, 60%, 0.18)`,
                border: `1px solid hsla(${(i * 43 + 25) % 360}, 72%, 48%, 0.38)`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </AnimItem>
    </CardShell>
  )
}

// ── Social ────────────────────────────────────────────────────────────────────

function SocialContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'social' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone'; stacked?: boolean }) {
  const iconMap: Record<string, React.ReactNode> = {
    github: <SiGithub size={20} />,
    linkedin: <BsLinkedin size={20} />,
    twitter: <SiX size={20} />,
    soundcloud: <SiSoundcloud size={20} />,
    youtube: <SiYoutube size={20} />,
  }
  const bgClass: Record<string, string> = {
    github: 'bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.08)]',
    linkedin: 'bg-[rgba(10,102,194,0.28)] dark:bg-[rgba(10,102,194,0.25)]',
    twitter: 'bg-[rgba(29,155,240,0.25)] dark:bg-[rgba(29,155,240,0.2)]',
    soundcloud: 'bg-[rgba(255,85,0,0.24)] dark:bg-[rgba(255,85,0,0.2)]',
    youtube: 'bg-[rgba(255,0,0,0.22)] dark:bg-[rgba(255,0,0,0.2)]',
  }
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.2) 100%)"
      badge="Social"
      badgeColor="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
    >
      <AnimItem><h2 className="text-2xl font-bold mb-1">{content.title}</h2></AnimItem>
      {content.description && (
        <AnimItem><p className="text-indigo-700 dark:text-indigo-300 text-xs mb-5">{content.description}</p></AnimItem>
      )}
      <AnimItem>
        <div className="space-y-2 flex-1">
          {content.links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:brightness-95 dark:hover:brightness-110 cursor-pointer border border-gray-200/50 dark:border-white/10 ${bgClass[link.icon] ?? 'bg-gray-100 dark:bg-white/5'}`}
            >
              <span className="text-gray-900 dark:text-white">{iconMap[link.icon]}</span>
              <span className="text-gray-900 dark:text-white font-medium text-sm">{link.name}</span>
              <FiExternalLink size={12} className="ml-auto text-gray-500 dark:text-white/40" />
            </a>
          ))}
        </div>
      </AnimItem>
    </CardShell>
  )
}

// ── Client ────────────────────────────────────────────────────────────────────

function ClientContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'client' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone'; stacked?: boolean }) {
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(20,184,166,0.3) 0%, rgba(6,182,212,0.25) 100%)"
      badge="Client"
      badgeColor="bg-teal-500/20 text-teal-700 dark:text-teal-300"
    >
      <AnimItem>
        <h2 className="text-2xl font-bold mb-0.5">{content.title}</h2>
        <p className="text-teal-600 dark:text-teal-400 text-sm font-medium mb-0.5">{content.company}</p>
        <p className="text-gray-400 dark:text-white/40 text-xs mb-4">{content.period}</p>
      </AnimItem>
      <AnimItem><p className="text-teal-700 dark:text-teal-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{content.description}</p></AnimItem>
      {content.highlights.length > 0 && (
        <AnimItem>
          <ul className="space-y-2 mb-4 flex-1">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-white/80">
                <span className="text-teal-400 mt-0.5 flex-shrink-0">→</span>
                {h}
              </li>
            ))}
          </ul>
        </AnimItem>
      )}
      {content.tags.length > 0 && (
        <AnimItem>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {content.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-300 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </AnimItem>
      )}
    </CardShell>
  )
}

// ── Education ─────────────────────────────────────────────────────────────────

function EducationContent({ content, imageUrl, orientation, stacked }: { content: Extract<CardContent, { type: 'education' }>; imageUrl?: string; orientation?: 'portrait' | 'landscape' | 'square' | 'phone'; stacked?: boolean }) {
  return (
    <CardShell
      imageUrl={imageUrl}
      orientation={orientation}
      stacked={stacked}
      gradient="linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.2) 100%)"
      badge="Education"
      badgeColor="bg-blue-500/20 text-blue-700 dark:text-blue-300"
    >
      <AnimItem><h2 className="text-2xl font-bold mb-1">{content.school}</h2></AnimItem>
      <AnimItem><p className="text-blue-600 dark:text-blue-300 text-sm font-medium mb-0.5">{content.degree}</p></AnimItem>
      {content.location && (
        <AnimItem><p className="text-gray-400 dark:text-white/40 text-xs mb-1">{content.location}</p></AnimItem>
      )}
      {content.period && (
        <AnimItem><p className="text-gray-400 dark:text-white/40 text-xs mb-4">{content.period}</p></AnimItem>
      )}
      {content.coursework && (
        <AnimItem><p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">{content.coursework}</p></AnimItem>
      )}
    </CardShell>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────

export function CardWindowContent({ card, stacked = false }: { card: DesktopCard; stacked?: boolean }) {
  const { content, imageUrl, orientation } = card
  switch (content.type) {
    case 'project':     return <ProjectContent     content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'achievement': return <AchievementContent content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'role':        return <RoleContent        content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'about':       return <AboutContent       content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'skill':       return <SkillContent       content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'social':      return <SocialContent      content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'client':      return <ClientContent      content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    case 'education':   return <EducationContent   content={content} imageUrl={imageUrl} orientation={orientation} stacked={stacked} />
    default: return <div className="p-6 text-gray-900 dark:text-white">Content coming soon</div>
  }
}
