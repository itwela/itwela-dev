'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  FiFolder,
  FiCode,
  FiGithub,
  FiExternalLink,
  FiGrid,
  FiList,
  FiSearch,
  FiStar,
  FiBriefcase,
  FiAward,
  FiLink,
  FiMusic,
  FiX,
} from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'

type Section = 'all' | 'featured' | 'projects' | 'roles' | 'achievements' | 'skills' | 'about' | 'social' | 'music'

const SIDEBAR_GROUPS: { label: string; items: { id: Section; label: string; icon: React.ReactNode }[] }[] = [
  {
    label: 'Favorites',
    items: [
      { id: 'all', label: 'All', icon: <FiFolder size={13} /> },
      { id: 'featured', label: 'Featured', icon: <FiStar size={13} /> },
    ],
  },
  {
    label: 'Work',
    items: [
      { id: 'projects', label: 'Projects', icon: <FiCode size={13} /> },
      { id: 'roles', label: 'Roles', icon: <FiBriefcase size={13} /> },
      { id: 'achievements', label: 'Achievements', icon: <FiAward size={13} /> },
    ],
  },
  {
    label: 'About',
    items: [
      { id: 'about', label: 'About', icon: <BsPerson size={13} /> },
      { id: 'skills', label: 'Skills', icon: <FiCode size={13} /> },
      { id: 'social', label: 'Social', icon: <FiLink size={13} /> },
    ],
  },
  {
    label: 'iCloud',
    items: [
      { id: 'music', label: 'Music', icon: <FiMusic size={13} /> },
    ],
  },
]

const CARD_STYLES: Record<string, { gradient: string; iconColor: string }> = {
  project:     { gradient: 'linear-gradient(135deg,rgba(168,85,247,.25),rgba(59,130,246,.25))',  iconColor: 'text-purple-400' },
  achievement: { gradient: 'linear-gradient(135deg,rgba(251,191,36,.25),rgba(245,158,11,.25))',  iconColor: 'text-yellow-400' },
  role:        { gradient: 'linear-gradient(135deg,rgba(34,197,94,.25),rgba(16,185,129,.25))',   iconColor: 'text-green-400'  },
  about:       { gradient: 'linear-gradient(135deg,rgba(236,72,153,.25),rgba(168,85,247,.25))',  iconColor: 'text-pink-400'   },
  skill:       { gradient: 'linear-gradient(135deg,rgba(6,182,212,.25),rgba(59,130,246,.25))',   iconColor: 'text-cyan-400'   },
  social:      { gradient: 'linear-gradient(135deg,rgba(249,115,22,.25),rgba(239,68,68,.25))',   iconColor: 'text-orange-400' },
  music:       { gradient: 'linear-gradient(135deg,rgba(239,68,68,.25),rgba(236,72,153,.25))',   iconColor: 'text-rose-400'   },
}

function cardIcon(type: string, size = 22) {
  const cls = CARD_STYLES[type]?.iconColor ?? 'text-gray-400'
  switch (type) {
    case 'role':        return <FiBriefcase size={size} className={cls} />
    case 'achievement': return <FiAward size={size} className={cls} />
    case 'about':       return <BsPerson size={size} className={cls} />
    case 'skill':       return <FiCode size={size} className={cls} />
    case 'social':      return <FiLink size={size} className={cls} />
    case 'music':       return <FiMusic size={size} className={cls} />
    default:            return <FiCode size={size} className={cls} />
  }
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── Types ─────────────────────────────────────────────────────────────────────

type ProjectDoc = {
  _id: string
  cardType: 'project' | 'achievement' | 'role' | 'skill' | 'about' | 'social'
  title: string
  description: string
  longDescription: string
  tags: string[]
  highlights?: string[]
  company?: string
  period?: string
  links?: { name: string; url: string; icon: string }[]
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  orientation?: 'portrait' | 'landscape' | 'square' | 'phone'
  featured: boolean
  order: number
}

type MusicDoc = {
  _id: string
  title: string
  artist: string
  album?: string
  duration?: number
  coverUrl?: string
  order: number
}

type SelectedItem =
  | { kind: 'project'; data: ProjectDoc }
  | { kind: 'music'; data: MusicDoc }

function getItemId(item: SelectedItem) {
  return item.data._id
}

function getItemTitle(item: SelectedItem) {
  return item.data.title
}

function getItemSubtitle(item: SelectedItem) {
  return item.kind === 'music' ? item.data.artist : item.data.description
}

function getItemPreviewUrl(item: SelectedItem) {
  return item.kind === 'music' ? item.data.coverUrl : item.data.imageUrl
}

function getItemOrientation(item: SelectedItem): 'portrait' | 'landscape' | 'square' | 'phone' {
  if (item.kind === 'music') return 'square'
  return item.data.orientation ?? 'square'
}

function getItemTypeLabel(item: SelectedItem) {
  return item.kind === 'music' ? 'Music' : item.data.cardType
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function DetailPanel({ item, onClose }: { item: SelectedItem; onClose: () => void }) {
  if (item.kind === 'music') {
    const t = item.data
    const style = CARD_STYLES.music
    return (
      <div className="w-56 flex-shrink-0 border-l border-gray-200 dark:border-white/10 flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30">Info</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white/70"><FiX size={12} /></button>
        </div>
        <div className="p-3 overflow-y-auto flex-1">
          <div className="w-full h-28 rounded-xl mb-3 flex items-center justify-center" style={{ background: style.gradient }}>
            {cardIcon('music', 32)}
          </div>
          <div className="text-gray-900 dark:text-white font-semibold text-sm">{t.title}</div>
          <div className="text-gray-500 dark:text-white/50 text-xs mt-0.5">{t.artist}</div>
          {t.album && <div className="text-gray-400 dark:text-white/30 text-xs mt-0.5">{t.album}</div>}
          {t.duration != null && (
            <div className="text-gray-400 dark:text-white/30 text-xs mt-1">{formatDuration(t.duration)}</div>
          )}
        </div>
      </div>
    )
  }

  const p = item.data
  const style = CARD_STYLES[p.cardType] ?? CARD_STYLES.project

  return (
    <div className="w-56 flex-shrink-0 border-l border-gray-200 dark:border-white/10 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-white/10">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30">Info</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white/70"><FiX size={12} /></button>
      </div>
      <div className="p-3 overflow-y-auto flex-1 space-y-3">
        <div className="w-full h-24 rounded-xl flex items-center justify-center" style={{ background: style.gradient }}>
          {cardIcon(p.cardType, 32)}
        </div>

        <div>
          <div className="text-gray-900 dark:text-white font-semibold text-sm leading-tight">{p.title}</div>
          <div className="text-gray-500 dark:text-white/50 text-xs mt-0.5">{p.description}</div>
        </div>

        {p.company && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-0.5">Company</div>
            <div className="text-gray-700 dark:text-white/70 text-xs">{p.company}</div>
          </div>
        )}

        {p.period && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-0.5">Period</div>
            <div className="text-gray-700 dark:text-white/70 text-xs">{p.period}</div>
          </div>
        )}

        {p.longDescription && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">About</div>
            <div className="text-gray-600 dark:text-white/60 text-[11px] leading-relaxed">{p.longDescription}</div>
          </div>
        )}

        {p.highlights && p.highlights.length > 0 && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">Highlights</div>
            <ul className="space-y-1">
              {p.highlights.map((h, i) => (
                <li key={i} className="text-[11px] text-gray-600 dark:text-white/60 flex gap-1.5">
                  <span className="text-gray-400 dark:text-white/30 flex-shrink-0">·</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.cardType === 'skill' && p.tags.length > 0 && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">Skills</div>
            <div className="flex flex-wrap gap-1">
              {p.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {p.cardType === 'social' && p.links && p.links.length > 0 && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">Links</div>
            <div className="space-y-1">
              {p.links.map((l) => (
                <a
                  key={l.name}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <FiExternalLink size={10} />
                  {l.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {p.cardType === 'project' && p.tags.length > 0 && (
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">Stack</div>
            <div className="flex flex-wrap gap-1">
              {p.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {(p.githubUrl || p.liveUrl) && (
          <div className="flex flex-col gap-1">
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FiGithub size={11} /> GitHub
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FiExternalLink size={11} /> Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function GridCard({ item, selected, onClick }: { item: SelectedItem; selected: boolean; onClick: () => void }) {
  const isMusic = item.kind === 'music'
  const type = isMusic ? 'music' : item.data.cardType
  const title = getItemTitle(item)
  const subtitle = getItemSubtitle(item)
  const previewUrl = getItemPreviewUrl(item)
  const orientation = getItemOrientation(item)
  const tags = isMusic ? [] : (item.data as ProjectDoc).tags

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-2.5 cursor-pointer transition-all border ${
        selected
          ? 'bg-blue-500/15 border-blue-500/35'
          : 'border-gray-200 dark:border-white/10 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
      }`}
    >
      <div className="w-full h-[92px] rounded-lg mb-2 flex items-center justify-center overflow-hidden bg-black/[0.04] dark:bg-white/[0.05]">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            draggable={false}
            className={`max-w-full max-h-full object-contain ${
              orientation === 'portrait' || orientation === 'phone'
                ? 'h-full w-auto'
                : orientation === 'landscape'
                ? 'w-full h-auto'
                : 'w-full h-full'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: (CARD_STYLES[type] ?? CARD_STYLES.project).gradient }}>
            {cardIcon(type, 24)}
          </div>
        )}
      </div>
      <div className="text-gray-900 dark:text-white font-medium text-[11px] leading-tight text-center line-clamp-1">{title}</div>
      <div className="text-gray-500 dark:text-white/40 text-[10px] mt-0.5 line-clamp-1 text-center">{subtitle}</div>
      {tags.length > 0 && (
        <div className="flex justify-center flex-wrap gap-1 mt-1.5">
          {tags.slice(0, 1).map((tag) => (
            <span key={tag} className="text-[8px] px-1 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── List row ──────────────────────────────────────────────────────────────────

function ListRow({ item, selected, onClick }: { item: SelectedItem; selected: boolean; onClick: () => void }) {
  const isMusic = item.kind === 'music'
  const type = isMusic ? 'music' : item.data.cardType
  const style = CARD_STYLES[type] ?? CARD_STYLES.project
  const title = getItemTitle(item)
  const subtitle = isMusic ? `${item.data.artist}${item.data.album ? ` · ${item.data.album}` : ''}` : item.data.description
  const previewUrl = getItemPreviewUrl(item)
  const tags = isMusic ? [] : (item.data as ProjectDoc).tags.slice(0, 3)

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors border ${
        selected
          ? 'bg-blue-500/15 border-blue-500/30'
          : 'border-gray-100 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5'
      }`}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-black/[0.04] dark:bg-white/[0.05]">
        {previewUrl ? (
          <img src={previewUrl} alt={title} draggable={false} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: style.gradient }}>
            {cardIcon(type, 15)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-gray-900 dark:text-white text-xs font-medium truncate">{title}</div>
        <div className="text-gray-500 dark:text-white/40 text-[10px] truncate">{subtitle}</div>
      </div>
      {tags.length > 0 && (
        <div className="flex gap-1 flex-shrink-0">
          {tags.map((tag) => (
            <span key={tag} className="text-[8px] px-1 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryView({
  item,
  items,
  onSelect,
  onClose,
}: {
  item: SelectedItem
  items: SelectedItem[]
  onSelect: (next: SelectedItem) => void
  onClose: () => void
}) {
  const previewUrl = getItemPreviewUrl(item)
  const orientation = getItemOrientation(item)
  const title = getItemTitle(item)
  const subtitle = getItemSubtitle(item)
  const type = item.kind === 'music' ? 'music' : item.data.cardType
  const style = CARD_STYLES[type] ?? CARD_STYLES.project

  return (
    <div className="flex h-full min-h-0">
      <div className="flex-1 min-w-0 flex flex-col border-r border-gray-200 dark:border-white/10">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10">
          <div className="text-[11px] text-gray-500 dark:text-white/40">
            <span className="font-medium text-gray-700 dark:text-white/70">{title}</span>
            <span className="mx-1.5">·</span>
            <span className="capitalize">{getItemTypeLabel(item)}</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-4">
          <div className="h-full rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/10 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={title}
                draggable={false}
                className={`object-contain rounded-xl shadow-sm ${
                  orientation === 'portrait' || orientation === 'phone'
                    ? 'h-[90%] w-auto max-w-[55%]'
                    : orientation === 'landscape'
                    ? 'w-[92%] h-auto max-h-[82%]'
                    : 'w-[76%] h-auto max-h-[80%]'
                }`}
              />
            ) : (
              <div className="w-[56%] h-[56%] rounded-2xl flex items-center justify-center" style={{ background: style.gradient }}>
                {cardIcon(type, 44)}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {items.map((entry) => {
              const id = getItemId(entry)
              const active = id === getItemId(item)
              const thumb = getItemPreviewUrl(entry)
              return (
                <button
                  key={id}
                  onClick={() => onSelect(entry)}
                  className={`w-[92px] h-[76px] rounded-lg flex-shrink-0 border overflow-hidden transition-colors ${
                    active
                      ? 'border-blue-500/60 bg-blue-500/10'
                      : 'border-gray-200 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                  }`}
                  title={getItemTitle(entry)}
                >
                  {thumb ? (
                    <img src={thumb} alt={getItemTitle(entry)} draggable={false} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {cardIcon(entry.kind === 'music' ? 'music' : entry.data.cardType, 18)}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-2 text-[10px] text-gray-500 dark:text-white/40 line-clamp-1">{subtitle}</div>
        </div>
      </div>

      <DetailPanel item={item} onClose={onClose} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FinderApp() {
  const [section, setSection] = useState<Section>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<SelectedItem | null>(null)
  const [isCompactLayout, setIsCompactLayout] = useState(false)

  const dbProjects = useQuery(api.projects.getAll) ?? []
  const dbMusic = useQuery(api.music.getAll) ?? []

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Build unified item list
  const projectItems: SelectedItem[] = dbProjects.map((p) => ({ kind: 'project' as const, data: p as unknown as ProjectDoc }))
  const musicItems: SelectedItem[] = dbMusic.map((m) => ({ kind: 'music' as const, data: m as unknown as MusicDoc }))

  // Filter by section
  const sectionItems: SelectedItem[] = (() => {
    if (section === 'music') return musicItems
    if (section === 'all') return projectItems
    if (section === 'featured') return projectItems.filter((i) => i.kind === 'project' && i.data.featured)
    if (section === 'projects') return projectItems.filter((i) => i.kind === 'project' && i.data.cardType === 'project')
    if (section === 'roles') return projectItems.filter((i) => i.kind === 'project' && i.data.cardType === 'role')
    if (section === 'achievements') return projectItems.filter((i) => i.kind === 'project' && i.data.cardType === 'achievement')
    if (section === 'skills') return projectItems.filter((i) => i.kind === 'project' && i.data.cardType === 'skill')
    if (section === 'about') return projectItems.filter((i) => i.kind === 'project' && i.data.cardType === 'about')
    if (section === 'social') return projectItems.filter((i) => i.kind === 'project' && i.data.cardType === 'social')
    return projectItems
  })()

  // Search filter
  const q = search.toLowerCase()
  const displayItems = q
    ? sectionItems.filter((item) => {
        if (item.kind === 'music') {
          return item.data.title.toLowerCase().includes(q) || item.data.artist.toLowerCase().includes(q)
        }
        return (
          item.data.title.toLowerCase().includes(q) ||
          item.data.description.toLowerCase().includes(q) ||
          item.data.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
    : sectionItems

  const sectionLabel = SIDEBAR_GROUPS.flatMap((g) => g.items).find((i) => i.id === section)?.label ?? 'All'
  const selectedInScope =
    selected && displayItems.some((item) => getItemId(item) === getItemId(selected)) ? selected : null
  const selectedInScopeId = selectedInScope ? getItemId(selectedInScope) : null

  const allItems: SelectedItem[] = [...projectItems, ...musicItems]
  const mobileQueryItems = q
    ? allItems.filter((item) => {
        if (item.kind === 'music') {
          return item.data.title.toLowerCase().includes(q) || item.data.artist.toLowerCase().includes(q)
        }
        return (
          item.data.title.toLowerCase().includes(q) ||
          item.data.description.toLowerCase().includes(q) ||
          item.data.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
    : allItems

  const recentItems = [...mobileQueryItems]
    .sort((a, b) => {
      const ao = a.kind === 'music' ? a.data.order : a.data.order
      const bo = b.kind === 'music' ? b.data.order : b.data.order
      return bo - ao
    })
    .slice(0, 4)

  const mobileGroups: { id: string; label: string; items: SelectedItem[] }[] = [
    {
      id: 'suggestions',
      label: 'Suggestions',
      items: mobileQueryItems.filter((item) => item.kind === 'music' || (item.kind === 'project' && item.data.featured)).slice(0, 4),
    },
    { id: 'recent', label: 'Recently Added', items: recentItems },
    {
      id: 'social',
      label: 'Social',
      items: mobileQueryItems.filter((item) => item.kind === 'project' && item.data.cardType === 'social').slice(0, 4),
    },
    {
      id: 'productivity',
      label: 'Productivity',
      items: mobileQueryItems
        .filter((item) => item.kind === 'project' && ['project', 'role', 'achievement'].includes(item.data.cardType))
        .slice(0, 4),
    },
    {
      id: 'utilities',
      label: 'Utilities',
      items: mobileQueryItems.filter((item) => item.kind === 'project' && ['about', 'skill'].includes(item.data.cardType)).slice(0, 4),
    },
    { id: 'entertainment', label: 'Entertainment', items: mobileQueryItems.filter((item) => item.kind === 'music').slice(0, 4) },
  ].filter((group) => group.items.length > 0)

  const selectedMobile =
    selected && mobileQueryItems.some((item) => getItemId(item) === getItemId(selected)) ? selected : null

  if (isCompactLayout) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-[#0b0c0f] text-gray-900 dark:text-white">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 bg-black/[0.05] dark:bg-white/[0.08]">
            <FiSearch size={14} className="text-gray-500 dark:text-white/40 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="App Library"
              className="bg-transparent w-full outline-none text-[16px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/35"
            />
          </div>
        </div>

        {selectedMobile ? (
          <div className="px-4 pb-4">
            <button
              onClick={() => setSelected(null)}
              className="mb-3 text-[12px] text-blue-600 dark:text-blue-300 font-medium"
            >
              Back to Library
            </button>

            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-white/[0.04] overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-white/10">
                <div className="text-[20px] font-semibold leading-tight text-gray-900 dark:text-white">
                  {getItemTitle(selectedMobile)}
                </div>
                <div className="text-[13px] mt-1 capitalize text-gray-500 dark:text-white/55">
                  {getItemTypeLabel(selectedMobile)}
                </div>
              </div>

              <div className="p-4">
                <div className="h-[220px] rounded-2xl flex items-center justify-center overflow-hidden bg-black/[0.04] dark:bg-white/[0.05]">
                  {getItemPreviewUrl(selectedMobile) ? (
                    <img
                      src={getItemPreviewUrl(selectedMobile)}
                      alt={getItemTitle(selectedMobile)}
                      draggable={false}
                      className={`max-w-full max-h-full object-contain ${
                        getItemOrientation(selectedMobile) === 'portrait' || getItemOrientation(selectedMobile) === 'phone'
                          ? 'h-full w-auto'
                          : getItemOrientation(selectedMobile) === 'landscape'
                          ? 'w-full h-auto'
                          : 'w-full h-full object-cover'
                      }`}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          (CARD_STYLES[selectedMobile.kind === 'music' ? 'music' : selectedMobile.data.cardType] ?? CARD_STYLES.project).gradient,
                      }}
                    >
                      {cardIcon(selectedMobile.kind === 'music' ? 'music' : selectedMobile.data.cardType, 38)}
                    </div>
                  )}
                </div>

                <div className="mt-3 text-[14px] text-gray-700 dark:text-white/75">
                  {getItemSubtitle(selectedMobile)}
                </div>

                {selectedMobile.kind === 'project' && selectedMobile.data.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedMobile.data.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-6 grid grid-cols-2 gap-3">
            {mobileGroups.map((group) => (
              <div key={group.id} className="rounded-[22px] p-3 bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.04] dark:border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  {group.items.slice(0, 4).map((item) => {
                    const id = getItemId(item)
                    const preview = getItemPreviewUrl(item)
                    const type = item.kind === 'music' ? 'music' : item.data.cardType
                    return (
                      <button
                        key={id}
                        onClick={() => setSelected(item)}
                        className="aspect-square rounded-[12px] overflow-hidden bg-white/80 dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/10"
                        title={getItemTitle(item)}
                      >
                        {preview ? (
                          <img src={preview} alt={getItemTitle(item)} draggable={false} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: (CARD_STYLES[type] ?? CARD_STYLES.project).gradient }}>
                            {cardIcon(type, 18)}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-2 text-[12px] text-gray-700 dark:text-white/80">{group.label}</div>
              </div>
            ))}

            {mobileGroups.length === 0 && (
              <div className="col-span-2 py-8 text-center text-sm text-gray-500 dark:text-white/50">
                No items found
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full text-gray-900 dark:text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 pt-3 pb-4 finder-sidebar overflow-y-auto">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-3 mb-1">
              <span className="text-gray-400 dark:text-white/30 text-[9px] font-semibold uppercase tracking-widest">
                {group.label}
              </span>
            </div>
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSelected(null) }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs transition-colors rounded-md mx-1 ${
                  section === item.id
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                    : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{ width: 'calc(100% - 8px)' }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 flex-shrink-0 border-b border-gray-200 dark:border-white/10" style={{ height: 40 }}>
          <span className="text-gray-500 dark:text-white/40 text-xs font-medium">{sectionLabel}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1" style={{ width: 180 }}>
              <FiSearch size={11} className="text-gray-400 dark:text-white/30 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-gray-900 dark:text-white text-xs outline-none placeholder-gray-400 dark:placeholder-white/30 w-full"
              />
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70'}`}
              >
                <FiGrid size={12} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70'}`}
              >
                <FiList size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-white/20">
              <FiFolder size={32} className="mb-2" />
              <div className="text-xs">No items</div>
            </div>
          ) : selectedInScope ? (
            <GalleryView
              item={selectedInScope}
              items={displayItems}
              onSelect={setSelected}
              onClose={() => setSelected(null)}
            />
          ) : viewMode === 'grid' ? (
            <div className="h-full overflow-y-auto p-3">
              <div className="grid grid-cols-4 gap-2.5">
              {displayItems.map((item) => {
                const id = getItemId(item)
                return (
                  <GridCard
                    key={id}
                    item={item}
                    selected={selectedInScopeId === id}
                    onClick={() => setSelected(item)}
                  />
                )
              })}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-3">
              <div className="space-y-1.5">
              {displayItems.map((item) => {
                const id = getItemId(item)
                return (
                  <ListRow
                    key={id}
                    item={item}
                    selected={selectedInScopeId === id}
                    onClick={() => setSelected(item)}
                  />
                )
              })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
