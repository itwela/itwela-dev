'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'

// ── Change this to your desired admin password ────────────────────────────────
const ADMIN_PASSWORD = 'itwela'
// ─────────────────────────────────────────────────────────────────────────────

type CardType = 'project' | 'achievement' | 'role' | 'skill' | 'about' | 'social' | 'education' | 'resume' | 'client'

type ProjectDoc = {
  _id: Id<'projects'>
  cardType: CardType
  title: string
  description: string
  longDescription: string
  tags: string[]
  body?: string
  highlights?: string[]
  company?: string
  period?: string
  links?: { name: string; url: string; icon: string }[]
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  order: number
}

type MailResponse = {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  attachments?: { name: string; type: string; size: number }[]
  createdAt: number
}

type MusicTrack = {
  _id: Id<'music'>
  title: string
  artist: string
  album?: string
  audioUrl?: string
  coverUrl?: string
  duration?: number
  order: number
}

type Playlist = {
  _id: Id<'playlists'>
  name: string
  trackIds: Id<'music'>[]
  order: number
}

type BlogCategory = {
  _id: Id<'blogCategories'>
  name: string
  slug: string
  order: number
}

type BlogPost = {
  _id: Id<'blogPosts'>
  title: string
  slug: string
  excerpt: string
  body: string
  categoryId?: Id<'blogCategories'>
  categoryName?: string
  emoji?: string
  imageUrl?: string
  publishedAt: number
  featured: boolean
  order: number
  gallery?: string[]
}

async function copyText(text: string) {
  const value = text.trim()
  if (!value) return

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return
    }
  } catch {
    // fall through to legacy copy
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

type FormData = Omit<ProjectDoc, '_id' | 'tags' | 'highlights'> & {
  tagsStr: string
  highlightsStr: string
}

// ─────────────────────────────────────────────────────────────────────────────
//  Terminal view
// ─────────────────────────────────────────────────────────────────────────────
type TLine = { kind: 'in' | 'out' | 'err' | 'sys'; text: string }

const terminalAppSession: {
  unlocked: boolean
  cms: {
    selectedId: Id<'projects'> | null
    creating: boolean
    cmsMode: 'cards' | 'music' | 'blog'
    mailPanelOpen: boolean
    selectedPlaylistId: Id<'playlists'> | null
    newPlaylistName: string
    trackForm: {
      title: string
      artist: string
      album: string
      audioUrl: string
      coverUrl: string
    }
    selectedBlogPostId: Id<'blogPosts'> | null
    selectedBlogCategoryId: Id<'blogCategories'> | null
    creatingBlogPost: boolean
    newBlogCategoryName: string
    blogForm: {
      title: string
      slug: string
      excerpt: string
      body: string
      emoji: string
      imageUrl: string
      categoryId: string
      publishedAt: string
      featured: boolean
      order: number
      galleryUrls: string
    }
  }
} = {
  unlocked: false,
  cms: {
    selectedId: null,
    creating: false,
    cmsMode: 'cards',
    mailPanelOpen: false,
    selectedPlaylistId: null,
    newPlaylistName: '',
    trackForm: { title: '', artist: '', album: '', audioUrl: '', coverUrl: '' },
    selectedBlogPostId: null,
    selectedBlogCategoryId: null,
    creatingBlogPost: false,
    newBlogCategoryName: '',
    blogForm: {
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      emoji: '📰',
      imageUrl: '',
      categoryId: '',
      publishedAt: '',
      featured: false,
      order: 0,
      galleryUrls: '',
    },
  },
}

function Terminal({ onUnlock }: { onUnlock: () => void }) {
  const [lines, setLines] = useState<TLine[]>([
    { kind: 'sys', text: 'itwela-portfolio — terminal' },
    { kind: 'out', text: 'Type "help" for available commands.' },
    { kind: 'out', text: '' },
  ])
  const [input, setInput] = useState('')
  const [awaitingPw, setAwaitingPw] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const push = (...ls: TLine[]) => setLines(p => [...p, ...ls])

  const run = (raw: string) => {
    const cmd = raw.trim()

    if (awaitingPw) {
      setAwaitingPw(false)
      if (raw === ADMIN_PASSWORD) {
        push({ kind: 'out', text: 'Access granted. Opening Content Manager...' })
        setTimeout(onUnlock, 600)
      } else {
        push({ kind: 'err', text: 'sudo: incorrect password.' })
      }
      return
    }

    if (cmd) push({ kind: 'in', text: `itwela@portfolio ~ % ${cmd}` })

    switch (cmd.toLowerCase()) {
      case 'help':
        push(
          { kind: 'out', text: '' },
          { kind: 'out', text: '  help        show this message' },
          { kind: 'out', text: '  whoami      about this terminal' },
          { kind: 'out', text: '  ls          list portfolio sections' },
          { kind: 'out', text: '  clear       clear the screen' },
          { kind: 'out', text: '  sudo cms    open content manager' },
          { kind: 'out', text: '' },
        )
        break
      case 'whoami':
        push(
          { kind: 'out', text: 'itwela — Full-Stack Engineer & AI Builder' },
          { kind: 'out', text: 'portfolio.itwela.dev' },
        )
        break
      case 'ls':
        push({ kind: 'out', text: 'projects/  roles/  achievements/  music/  photos/  blog/' })
        break
      case 'clear':
        setLines([])
        break
      case 'sudo cms':
        push({ kind: 'out', text: '[sudo] password for itwela:' })
        setAwaitingPw(true)
        break
      case '':
        break
      default:
        push({ kind: 'err', text: `zsh: command not found: ${cmd}` })
    }
  }

  return (
    <div
      className="h-full bg-[#1c1c1e] font-mono text-[13px] flex flex-col select-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-[2px]">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.kind === 'in'  ? 'text-white' :
              l.kind === 'err' ? 'text-red-400' :
              l.kind === 'sys' ? 'text-blue-400' :
              'text-green-400'
            }
          >
            {l.text || '\u00A0'}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 px-4 pb-4 pt-2 border-t border-white/5">
        {awaitingPw
          ? <span className="text-yellow-400 shrink-0 select-none">Password:</span>
          : <span className="text-green-400 shrink-0 select-none">itwela@portfolio ~ %</span>
        }
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { run(input); setInput('') } }}
          type={awaitingPw ? 'password' : 'text'}
          className="flex-1 bg-transparent outline-none text-white caret-green-400 font-mono"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Edit form
// ─────────────────────────────────────────────────────────────────────────────
const BLANK_FORM: FormData = {
  cardType: 'project',
  title: '',
  description: '',
  longDescription: '',
  tagsStr: '',
  highlightsStr: '',
  body: '',
  company: '',
  period: '',
  imageUrl: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  order: 99,
}

function docToForm(doc: Partial<ProjectDoc>): FormData {
  return {
    cardType:       doc.cardType       ?? 'project',
    title:          doc.title          ?? '',
    description:    doc.description    ?? '',
    longDescription:doc.longDescription ?? '',
    tagsStr:        (doc.tags          ?? []).join(', '),
    highlightsStr:  (doc.highlights    ?? []).join('\n'),
    body:           doc.body           ?? '',
    company:        doc.company        ?? '',
    period:         doc.period         ?? '',
    imageUrl:       doc.imageUrl       ?? '',
    liveUrl:        doc.liveUrl        ?? '',
    githubUrl:      doc.githubUrl      ?? '',
    featured:       doc.featured       ?? false,
    order:          doc.order          ?? 99,
  }
}

function formToDoc(f: FormData): Omit<ProjectDoc, '_id'> {
  const base: Omit<ProjectDoc, '_id'> = {
    cardType:        f.cardType,
    title:           f.title,
    description:     f.description,
    longDescription: f.longDescription,
    tags:            f.tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    featured:        f.featured,
    order:           Number(f.order) || 0,
  }
  if (f.body)           base.body           = f.body
  if (f.company)        base.company        = f.company
  if (f.period)         base.period         = f.period
  if (f.imageUrl)       base.imageUrl       = f.imageUrl
  if (f.liveUrl)        base.liveUrl        = f.liveUrl
  if (f.githubUrl)      base.githubUrl      = f.githubUrl
  if (f.highlightsStr)  base.highlights     = f.highlightsStr.split('\n').map(h => h.trim()).filter(Boolean)
  return base
}

function TextField({
  label, field, multi = false, rows = 3, f, set,
}: {
  label: string
  field: keyof FormData
  multi?: boolean
  rows?: number
  f: FormData
  set: (k: keyof FormData, v: string | boolean | number) => void
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] text-gray-500 uppercase tracking-wider">{label}</label>
      {multi ? (
        <textarea
          rows={rows}
          value={f[field] as string}
          onChange={e => set(field, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 resize-none font-mono transition-colors"
        />
      ) : (
        <input
          type="text"
          value={f[field] as string}
          onChange={e => set(field, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
        />
      )}
    </div>
  )
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false)

  const handleFirstClick = () => setConfirming(true)
  const handleCancel = () => setConfirming(false)

  return (
    <div className="relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait" initial={false}>
        {confirming ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="flex gap-1"
          >
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Yes, delete
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors"
            >
              No
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            onClick={handleFirstClick}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm transition-colors"
          >
            Delete
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function EditForm({
  initial,
  onSave,
  onDelete,
  onCancel,
  saving,
  isNew,
}: {
  initial: Partial<ProjectDoc>
  onSave: (doc: Omit<ProjectDoc, '_id'>) => void
  onDelete?: () => void
  onCancel: () => void
  saving: boolean
  isNew: boolean
}) {
  const [f, setF] = useState<FormData>(() => docToForm(initial))
  const set = (k: keyof FormData, v: string | boolean | number) =>
    setF(prev => ({ ...prev, [k]: v }))

  const ct = f.cardType

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {/* Card type */}
      <div className="space-y-1">
        <label className="block text-[11px] text-gray-500 uppercase tracking-wider">Card Type</label>
        <select
          value={f.cardType}
          onChange={e => set('cardType', e.target.value as CardType)}
          className="w-full bg-[#2a2a2e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
        >
          {(['project','achievement','role','skill','about','social','education','resume','client'] as CardType[]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <TextField label="Title" field="title" f={f} set={set} />
      <TextField label="Short Description" field="description" f={f} set={set} />
      <TextField label="Long Description" field="longDescription" multi rows={4} f={f} set={set} />
      <TextField label="Tags (comma separated)" field="tagsStr" f={f} set={set} />

      {/* Role-specific */}
      {ct === 'role' && <TextField label="Company" field="company" f={f} set={set} />}
      {ct === 'role' && <TextField label="Period (e.g. Jan 2025 – Jun 2025)" field="period" f={f} set={set} />}

      {/* Project-specific */}
      {ct === 'project' && <TextField label="Live URL" field="liveUrl" f={f} set={set} />}
      {ct === 'project' && <TextField label="GitHub URL" field="githubUrl" f={f} set={set} />}
      {ct === 'project' && <TextField label="Image URL" field="imageUrl" f={f} set={set} />}

      {/* Highlights */}
      {(ct === 'achievement' || ct === 'role' || ct === 'project' || ct === 'about') && (
        <TextField label="Highlights (one per line)" field="highlightsStr" multi rows={4} f={f} set={set} />
      )}

      <TextField label="Body (optional)" field="body" multi rows={3} f={f} set={set} />

      {/* Featured + Order row */}
      <div className="flex items-center gap-6 pt-1">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={f.featured}
            onChange={e => set('featured', e.target.checked)}
            className="rounded"
          />
          Featured
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 uppercase tracking-wider">Order</span>
          <input
            type="number"
            value={String(f.order)}
            onChange={e => set('order', e.target.value)}
            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white outline-none text-center"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 pb-1">
        <button
          onClick={() => onSave(formToDoc(f))}
          disabled={saving || !f.title.trim()}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? 'Saving…' : isNew ? 'Create' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
        {onDelete && <DeleteButton onDelete={onDelete} />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  CMS Panel
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_COLORS: Record<CardType, string> = {
  project:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  achievement: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  role:        'bg-purple-500/20 text-purple-300 border-purple-500/30',
  skill:       'bg-green-500/20 text-green-300 border-green-500/30',
  about:       'bg-pink-500/20 text-pink-300 border-pink-500/30',
  social:      'bg-orange-500/20 text-orange-300 border-orange-500/30',
  education:   'bg-blue-400/20 text-blue-200 border-blue-400/30',
  resume:      'bg-gray-500/20 text-gray-300 border-gray-500/30',
  client:      'bg-teal-500/20 text-teal-300 border-teal-500/30',
}

function CmsPanel({ onLogout }: { onLogout: () => void }) {
  const projects = useQuery(api.projects.getAll)
  const tracks = (useQuery(api.music.getAll) ?? []) as MusicTrack[]
  const playlists = (useQuery(api.playlists.getAll) ?? []) as Playlist[]
  const blogCategories = (useQuery((api as any).blog.getCategories) ?? []) as BlogCategory[]
  const blogPosts = (useQuery((api as any).blog.getPostsWithCategories) ?? []) as BlogPost[]
  const exportData = useQuery(api.export.all)
  const updateProject = useMutation(api.projects.updateProject)
  const deleteProject = useMutation(api.projects.deleteProject)
  const createProject = useMutation(api.projects.createProject)
  const addTrack = useMutation(api.music.addTrack)
  const createPlaylist = useMutation(api.playlists.create)
  const addTrackToPlaylist = useMutation(api.playlists.addTrack)
  const removeTrackFromPlaylist = useMutation(api.playlists.removeTrack)
  const createBlogCategory = useMutation((api as any).blog.createCategory)
  const updateBlogCategory = useMutation((api as any).blog.updateCategory)
  const deleteBlogCategory = useMutation((api as any).blog.deleteCategory)
  const createBlogPost = useMutation((api as any).blog.createPost)
  const updateBlogPost = useMutation((api as any).blog.updatePost)
  const deleteBlogPost = useMutation((api as any).blog.deletePost)

  const [selectedId, setSelectedId] = useState<Id<'projects'> | null>(terminalAppSession.cms.selectedId)
  const [creating, setCreating] = useState(terminalAppSession.cms.creating)
  const [saving, setSaving] = useState(false)
  const [cmsMode, setCmsMode] = useState<'cards' | 'music' | 'blog'>(terminalAppSession.cms.cmsMode)
  const [mailPanelOpen, setMailPanelOpen] = useState(terminalAppSession.cms.mailPanelOpen)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<Id<'playlists'> | null>(terminalAppSession.cms.selectedPlaylistId)
  const [newPlaylistName, setNewPlaylistName] = useState(terminalAppSession.cms.newPlaylistName)
  const [trackForm, setTrackForm] = useState(terminalAppSession.cms.trackForm)
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<Id<'blogPosts'> | null>(terminalAppSession.cms.selectedBlogPostId)
  const [selectedBlogCategoryId, setSelectedBlogCategoryId] = useState<Id<'blogCategories'> | null>(terminalAppSession.cms.selectedBlogCategoryId)
  const [creatingBlogPost, setCreatingBlogPost] = useState(terminalAppSession.cms.creatingBlogPost)
  const [newBlogCategoryName, setNewBlogCategoryName] = useState(terminalAppSession.cms.newBlogCategoryName)
  const [blogForm, setBlogForm] = useState(terminalAppSession.cms.blogForm)
  const mailResponses = (exportData?.mailResponses as MailResponse[] | undefined) ?? []

  useEffect(() => {
    if (!selectedPlaylistId && playlists.length > 0) setSelectedPlaylistId(playlists[0]._id)
  }, [playlists, selectedPlaylistId])

  useEffect(() => {
    terminalAppSession.cms = {
      selectedId,
      creating,
      cmsMode,
      mailPanelOpen,
      selectedPlaylistId,
      newPlaylistName,
      trackForm,
      selectedBlogPostId,
      selectedBlogCategoryId,
      creatingBlogPost,
      newBlogCategoryName,
      blogForm,
    }
  }, [selectedId, creating, cmsMode, mailPanelOpen, selectedPlaylistId, newPlaylistName, trackForm, selectedBlogPostId, selectedBlogCategoryId, creatingBlogPost, newBlogCategoryName, blogForm])

  const handleExport = () => {
    if (!exportData) return
    const payload = {
      exportedAt: new Date().toISOString(),
      tables: exportData,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `itwela-dev-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selected = projects?.find(p => p._id === selectedId) ?? null

  const grouped = projects
    ? (['project','achievement','role','skill','about','social'] as CardType[])
        .map(ct => ({ ct, items: projects.filter(p => p.cardType === ct) }))
        .filter(g => g.items.length > 0)
    : []

  const handleSave = async (doc: Omit<ProjectDoc, '_id'>) => {
    setSaving(true)
    try {
      if (creating) {
        await createProject(doc)
        setCreating(false)
      } else if (selectedId) {
        await updateProject({ id: selectedId, ...doc })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    await deleteProject({ id: selectedId })
    setSelectedId(null)
  }

  const selectedPlaylist = playlists.find((p) => p._id === selectedPlaylistId) ?? null
  const selectedPlaylistTrackSet = new Set((selectedPlaylist?.trackIds ?? []).map(String))

  const handleCreateTrack = async () => {
    if (!trackForm.title.trim() || !trackForm.artist.trim()) return
    const nextOrder = tracks.length ? Math.max(...tracks.map((t) => t.order)) + 1 : 0
    await addTrack({
      title: trackForm.title.trim(),
      artist: trackForm.artist.trim(),
      album: trackForm.album.trim() || undefined,
      audioUrl: trackForm.audioUrl.trim() || undefined,
      coverUrl: trackForm.coverUrl.trim() || undefined,
      order: nextOrder,
    })
    setTrackForm({ title: '', artist: '', album: '', audioUrl: '', coverUrl: '' })
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return
    const id = await createPlaylist({ name: newPlaylistName.trim() })
    setSelectedPlaylistId(id)
    setNewPlaylistName('')
  }

  const handleToggleTrackInPlaylist = async (trackId: Id<'music'>) => {
    if (!selectedPlaylistId) return
    if (selectedPlaylistTrackSet.has(String(trackId))) {
      await removeTrackFromPlaylist({ playlistId: selectedPlaylistId, trackId })
    } else {
      await addTrackToPlaylist({ playlistId: selectedPlaylistId, trackId })
    }
  }

  const selectedBlogPost = blogPosts.find((post) => post._id === selectedBlogPostId) ?? null

  const resetBlogForm = useCallback(() => {
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      emoji: '📰',
      imageUrl: '',
      categoryId: selectedBlogCategoryId ? String(selectedBlogCategoryId) : '',
      publishedAt: '',
      featured: false,
      order: blogPosts.length,
      galleryUrls: '',
    })
  }, [blogPosts.length, selectedBlogCategoryId])

  const loadBlogFormFromPost = useCallback((post: BlogPost) => {
    setBlogForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      emoji: post.emoji ?? '📰',
      imageUrl: post.imageUrl ?? '',
      categoryId: post.categoryId ? String(post.categoryId) : '',
      publishedAt: new Date(post.publishedAt).toISOString().slice(0, 10),
      featured: post.featured,
      order: post.order,
      galleryUrls: (post.gallery ?? []).join('\n'),
    })
  }, [])

  const handleCreateBlogCategory = async () => {
    if (!newBlogCategoryName.trim()) return
    const id = await createBlogCategory({ name: newBlogCategoryName.trim() })
    setSelectedBlogCategoryId(id)
    setNewBlogCategoryName('')
  }

  const handleUpdateBlogCategory = async () => {
    if (!selectedBlogCategoryId) return
    const category = blogCategories.find((cat) => cat._id === selectedBlogCategoryId)
    if (!category) return
    await updateBlogCategory({
      id: selectedBlogCategoryId,
      name: newBlogCategoryName.trim() || category.name,
      order: category.order,
    })
    setNewBlogCategoryName('')
  }

  const handleDeleteBlogCategory = async () => {
    if (!selectedBlogCategoryId) return
    await deleteBlogCategory({ id: selectedBlogCategoryId })
    setSelectedBlogCategoryId(null)
  }

  const handleCreateBlogPost = () => {
    setCreatingBlogPost(true)
    setSelectedBlogPostId(null)
    resetBlogForm()
  }

  const handleSelectBlogPost = (post: BlogPost) => {
    setCreatingBlogPost(false)
    setSelectedBlogPostId(post._id)
    setSelectedBlogCategoryId(post.categoryId ?? null)
    loadBlogFormFromPost(post)
  }

  const handleSaveBlogPost = async () => {
    if (!blogForm.title.trim() || !blogForm.body.trim()) return
    const publishedAt = blogForm.publishedAt
      ? new Date(`${blogForm.publishedAt}T12:00:00`).getTime()
      : Date.now()
    const gallery = blogForm.galleryUrls
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    const payload = {
      title: blogForm.title.trim(),
      slug: blogForm.slug.trim() || undefined,
      excerpt: blogForm.excerpt.trim() || blogForm.body.trim().slice(0, 180),
      body: blogForm.body.trim(),
      categoryId: blogForm.categoryId ? (blogForm.categoryId as Id<'blogCategories'>) : undefined,
      emoji: blogForm.emoji.trim() || undefined,
      imageUrl: blogForm.imageUrl.trim() || undefined,
      gallery: gallery.length ? gallery : undefined,
      publishedAt,
      featured: blogForm.featured,
      order: Number(blogForm.order) || 0,
    }

    if (creatingBlogPost) {
      const id = await createBlogPost(payload)
      setCreatingBlogPost(false)
      setSelectedBlogPostId(id)
    } else if (selectedBlogPostId) {
      await updateBlogPost({ id: selectedBlogPostId, ...payload })
    }
  }

  const handleDeleteBlogPost = async () => {
    if (!selectedBlogPostId) return
    await deleteBlogPost({ id: selectedBlogPostId })
    setSelectedBlogPostId(null)
    setCreatingBlogPost(false)
    resetBlogForm()
  }

  return (
    <div className="h-full flex flex-col bg-[#1c1c1e] text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#252528] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xs font-mono">⬢</span>
          <span className="text-sm font-semibold">Content Manager</span>
          <span className="text-[10px] text-gray-600 font-mono ml-1">
            {projects ? `${projects.length} cards` : '…'}
          </span>
          <span className="text-[10px] text-gray-600 font-mono">
            {`· ${mailResponses.length} mails`}
          </span>
          <span className="text-[10px] text-gray-600 font-mono">
            {`· ${blogPosts.length} posts`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setCmsMode('cards')}
              className={`px-2 py-1 text-[11px] rounded-md transition-colors ${
                cmsMode === 'cards' ? 'bg-blue-500/30 text-blue-200' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setCmsMode('music')}
              className={`px-2 py-1 text-[11px] rounded-md transition-colors ${
                cmsMode === 'music' ? 'bg-blue-500/30 text-blue-200' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Music
            </button>
            <button
              onClick={() => setCmsMode('blog')}
              className={`px-2 py-1 text-[11px] rounded-md transition-colors ${
                cmsMode === 'blog' ? 'bg-blue-500/30 text-blue-200' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Blog
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={!exportData}
            className="text-xs text-gray-600 hover:text-green-400 disabled:opacity-30 transition-colors px-2 py-1 rounded hover:bg-white/5 font-mono"
          >
            ↓ export
          </button>
          <button
            onClick={onLogout}
            className="text-xs text-gray-600 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            ← terminal
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {cmsMode === 'cards' ? (
          <>
            {/* Sidebar */}
            <div className="w-52 border-r border-white/10 bg-[#1f1f21] flex flex-col overflow-hidden shrink-0">
              <div className="p-2 border-b border-white/5">
                <button
                  onClick={() => { setCreating(true); setSelectedId(null) }}
                  className="w-full py-1.5 px-3 bg-blue-600/20 hover:bg-blue-600/35 text-blue-400 rounded-lg text-xs font-medium transition-colors text-left"
                >
                  + New Card
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                {grouped.map(({ ct, items }) => (
                  <div key={ct}>
                    <div className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase text-gray-600 tracking-widest">
                      {ct}s ({items.length})
                    </div>
                    {items.map(item => (
                      <button
                        key={item._id}
                        onClick={() => { setSelectedId(item._id); setCreating(false) }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 flex items-center gap-2 ${
                          selectedId === item._id ? 'bg-white/10 text-white' : 'text-gray-400'
                        }`}
                      >
                        <span className={`shrink-0 w-1.5 h-1.5 rounded-full inline-block ${
                          item.featured ? 'bg-yellow-400' : 'bg-gray-700'
                        }`} />
                        <span className="truncate">{item.title}</span>
                      </button>
                    ))}
                  </div>
                ))}
                {!projects && (
                  <div className="px-3 py-4 text-xs text-gray-700 text-center">Loading…</div>
                )}
              </div>
            </div>

            {/* Main panel */}
            {creating ? (
              <EditForm
                initial={BLANK_FORM}
                onSave={handleSave}
                onCancel={() => setCreating(false)}
                saving={saving}
                isNew
              />
            ) : selected ? (
              <EditForm
                key={selected._id}
                initial={selected}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={() => setSelectedId(null)}
                saving={saving}
                isNew={false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                <div className="text-center space-y-2">
                  <p>Select a card to edit</p>
                  <p className="text-xs text-gray-700">or create a new one</p>
                </div>
              </div>
            )}
          </>
        ) : cmsMode === 'music' ? (
          <>
            {/* Music sidebar */}
            <div className="w-56 border-r border-white/10 bg-[#1f1f21] flex flex-col overflow-hidden shrink-0">
              <div className="p-2 border-b border-white/5 space-y-2">
                <input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={handleCreatePlaylist}
                  className="w-full py-1.5 px-3 bg-blue-600/20 hover:bg-blue-600/35 text-blue-400 rounded-lg text-xs font-medium transition-colors text-left"
                >
                  + Create Playlist
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                <div className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase text-gray-600 tracking-widest">
                  Playlists ({playlists.length})
                </div>
                {playlists.map((pl) => (
                  <button
                    key={pl._id}
                    onClick={() => setSelectedPlaylistId(pl._id)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                      selectedPlaylistId === pl._id ? 'bg-white/10 text-white' : 'text-gray-400'
                    }`}
                  >
                    <span className="truncate block">{pl.name}</span>
                    <span className="text-[10px] text-gray-600">{pl.trackIds.length} tracks</span>
                  </button>
                ))}
                {playlists.length === 0 && (
                  <div className="px-3 py-4 text-xs text-gray-700 text-center">No playlists yet</div>
                )}
              </div>
            </div>

            {/* Music main panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-white/10 bg-[#202023]">
                <div className="text-xs text-gray-300 mb-2">Add Track (AWS links supported)</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={trackForm.title}
                    onChange={(e) => setTrackForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Track title"
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                  <input
                    value={trackForm.artist}
                    onChange={(e) => setTrackForm((p) => ({ ...p, artist: e.target.value }))}
                    placeholder="Artist"
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                  <input
                    value={trackForm.audioUrl}
                    onChange={(e) => setTrackForm((p) => ({ ...p, audioUrl: e.target.value }))}
                    placeholder="Audio URL (AWS link)"
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 col-span-2"
                  />
                  <input
                    value={trackForm.coverUrl}
                    onChange={(e) => setTrackForm((p) => ({ ...p, coverUrl: e.target.value }))}
                    placeholder="Cover URL (optional)"
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                  <input
                    value={trackForm.album}
                    onChange={(e) => setTrackForm((p) => ({ ...p, album: e.target.value }))}
                    placeholder="Album (optional)"
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                </div>
                <button
                  onClick={handleCreateTrack}
                  className="mt-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/35 text-green-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Add Track
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="text-[11px] text-gray-500">
                  Library ({tracks.length}) {selectedPlaylist ? `· managing playlist: ${selectedPlaylist.name}` : ''}
                </div>
                {tracks.map((track) => {
                  const inPlaylist = selectedPlaylistTrackSet.has(String(track._id))
                  return (
                    <div key={track._id} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-white font-medium truncate">{track.title}</div>
                        <div className="text-[11px] text-gray-400 truncate">{track.artist}{track.album ? ` · ${track.album}` : ''}</div>
                        {track.audioUrl && (
                          <a href={track.audioUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-300 hover:text-blue-200 truncate block">
                            {track.audioUrl}
                          </a>
                        )}
                      </div>
                      <button
                        disabled={!selectedPlaylistId}
                        onClick={() => handleToggleTrackInPlaylist(track._id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                          inPlaylist
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {inPlaylist ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  )
                })}
                {tracks.length === 0 && (
                  <div className="text-xs text-gray-600 px-2 py-3">No tracks yet.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Blog sidebar */}
            <div className="w-64 border-r border-white/10 bg-[#1f1f21] flex flex-col overflow-hidden shrink-0">
              <div className="p-2 border-b border-white/5 space-y-2">
                <input
                  value={newBlogCategoryName}
                  onChange={(e) => setNewBlogCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={handleCreateBlogCategory}
                    className="flex-1 py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    + Category
                  </button>
                  <button
                    onClick={handleUpdateBlogCategory}
                    disabled={!selectedBlogCategoryId}
                    className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-gray-300 rounded-lg text-[11px] transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={handleDeleteBlogCategory}
                    disabled={!selectedBlogCategoryId}
                    className="py-1.5 px-2 bg-red-600/20 hover:bg-red-600/35 disabled:opacity-40 text-red-300 rounded-lg text-[11px] transition-colors"
                  >
                    Del
                  </button>
                </div>
                <button
                  onClick={handleCreateBlogPost}
                  className="w-full py-1.5 px-3 bg-green-600/20 hover:bg-green-600/35 text-green-300 rounded-lg text-xs font-medium transition-colors text-left"
                >
                  + New Blog Post
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                <div className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase text-gray-600 tracking-widest">
                  Categories ({blogCategories.length})
                </div>
                {blogCategories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedBlogCategoryId(cat._id)
                      setNewBlogCategoryName(cat.name)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                      selectedBlogCategoryId === cat._id ? 'bg-white/10 text-white' : 'text-gray-400'
                    }`}
                  >
                    <span className="truncate block">{cat.name}</span>
                  </button>
                ))}
                <div className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase text-gray-600 tracking-widest">
                  Posts ({blogPosts.length})
                </div>
                {blogPosts.map((post) => (
                  <button
                    key={post._id}
                    onClick={() => handleSelectBlogPost(post)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                      selectedBlogPostId === post._id ? 'bg-white/10 text-white' : 'text-gray-400'
                    }`}
                  >
                    <span className="truncate block">{post.title}</span>
                    <span className="text-[10px] text-gray-600 truncate block">
                      {post.categoryName ?? 'Uncategorized'} · {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
                {blogPosts.length === 0 && (
                  <div className="px-3 py-4 text-xs text-gray-700 text-center">No blog posts yet</div>
                )}
              </div>
            </div>

            {/* Blog main panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-white/10 bg-[#202023]">
                <div className="text-xs text-gray-300">
                  {creatingBlogPost ? 'Create blog post' : selectedBlogPost ? 'Edit blog post' : 'Select a post to edit'}
                </div>
              </div>
              {creatingBlogPost || selectedBlogPost ? (
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={blogForm.title}
                      onChange={(e) => setBlogForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Post title"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 col-span-2"
                    />
                    <input
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm((p) => ({ ...p, slug: e.target.value }))}
                      placeholder="Slug (optional)"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                    />
                    <select
                      value={blogForm.categoryId}
                      onChange={(e) => setBlogForm((p) => ({ ...p, categoryId: e.target.value }))}
                      className="bg-[#2a2a2e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                    >
                      <option value="">Uncategorized</option>
                      {blogCategories.map((cat) => (
                        <option key={cat._id} value={String(cat._id)}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm((p) => ({ ...p, excerpt: e.target.value }))}
                      placeholder="Excerpt"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 col-span-2"
                    />
                    <input
                      value={blogForm.emoji}
                      onChange={(e) => setBlogForm((p) => ({ ...p, emoji: e.target.value }))}
                      placeholder="Emoji"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                    />
                    <input
                      value={blogForm.imageUrl}
                      onChange={(e) => setBlogForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="Image URL (optional)"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                    />
                    <input
                      type="date"
                      value={blogForm.publishedAt}
                      onChange={(e) => setBlogForm((p) => ({ ...p, publishedAt: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                    />
                    <input
                      type="number"
                      value={blogForm.order}
                      onChange={(e) => setBlogForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                      placeholder="Order"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={blogForm.featured}
                      onChange={(e) => setBlogForm((p) => ({ ...p, featured: e.target.checked }))}
                    />
                    Featured post
                  </label>

                  <textarea
                    value={blogForm.galleryUrls}
                    onChange={(e) => setBlogForm((p) => ({ ...p, galleryUrls: e.target.value }))}
                    placeholder="Gallery image URLs (one per line, optional)"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 resize-y font-mono leading-relaxed"
                  />

                  <textarea
                    value={blogForm.body}
                    onChange={(e) => setBlogForm((p) => ({ ...p, body: e.target.value }))}
                    placeholder="Post body"
                    rows={16}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 resize-y font-mono leading-relaxed"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveBlogPost}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      {creatingBlogPost ? 'Create Post' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setCreatingBlogPost(false)
                        setSelectedBlogPostId(null)
                        resetBlogForm()
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    {!creatingBlogPost && (
                      <button
                        onClick={handleDeleteBlogPost}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/35 text-red-300 rounded-lg text-xs transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                  <div className="text-center space-y-2">
                    <p>Select a post to edit</p>
                    <p className="text-xs text-gray-700">or create a new one from the sidebar</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mail responses drawer */}
        {mailPanelOpen ? (
          <div className="w-64 border-l border-white/10 bg-[#19191b] flex flex-col shrink-0">
            <div className="px-3 py-2.5 border-b border-white/10 flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold text-gray-300">Mail Responses</div>
                <div className="text-[10px] text-gray-600 mt-0.5">Messages sent from Mail</div>
              </div>
              <button
                onClick={() => setMailPanelOpen(false)}
                className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                Hide
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {mailResponses.length === 0 ? (
                <div className="text-xs text-gray-600 px-2 py-3">No responses yet.</div>
              ) : (
                mailResponses.map((mail) => (
                  <div key={mail._id} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-white font-medium truncate">{mail.subject}</div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {mail.name} ·{' '}
                          <button
                            type="button"
                            onClick={async () => {
                              await copyText(mail.email)
                              toast.success('Copied email.')
                            }}
                            className="inline-flex items-center text-blue-300/90 hover:text-blue-200 underline-offset-2 hover:underline"
                            title="Copy email"
                          >
                            {mail.email}
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-600 shrink-0">
                        {new Date(mail.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">
                      {mail.message}
                    </div>
                    {!!mail.attachments?.length && (
                      <div className="text-[10px] text-blue-300/80">
                        {mail.attachments.length} image attachment{mail.attachments.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="w-12 border-l border-white/10 bg-[#19191b] flex flex-col items-center py-2 shrink-0">
            <button
              onClick={() => setMailPanelOpen(true)}
              className="text-[10px] text-gray-400 hover:text-gray-200 transition-colors [writing-mode:vertical-rl] rotate-180 tracking-wider"
            >
              MAIL ({mailResponses.length})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Root export
// ─────────────────────────────────────────────────────────────────────────────
export function TerminalApp() {
  const [unlocked, setUnlocked] = useState(terminalAppSession.unlocked)

  useEffect(() => {
    terminalAppSession.unlocked = unlocked
  }, [unlocked])

  return unlocked
    ? <CmsPanel onLogout={() => setUnlocked(false)} />
    : <Terminal onUnlock={() => setUnlocked(true)} />
}
