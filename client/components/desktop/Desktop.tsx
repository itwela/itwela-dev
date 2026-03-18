'use client'

import { useState, useCallback, useReducer, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useMusicPlayer } from '@/lib/musicPlayer'
import { MenuBar } from './MenuBar'
import { DraggableCard } from './DraggableCard'
import { MacWindow } from './MacWindow'
import { CardWindowContent } from './CardWindowContent'
import { Dock } from '@/components/dock/Dock'
import { FinderApp } from '@/components/apps/FinderApp'
import { MailApp } from '@/components/apps/MailApp'
import { PhotosApp } from '@/components/apps/PhotosApp'
import { MusicApp } from '@/components/apps/MusicApp'
import { ResumeApp } from '@/components/apps/ResumeApp'
import { BlogApp } from '@/components/apps/BlogApp'
import { AgentApp } from '@/components/apps/AgentApp'
import { JobKompassApp } from '@/components/apps/JobKompassApp'
import { TerminalApp } from '@/components/apps/TerminalApp'
import { CARDS_ORGANIZED, buildAllCards } from '@/lib/data'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { HiPlay, HiPause, HiForward, HiBackward } from 'react-icons/hi2'

// Static organized layout as initial state (avoids hydration mismatch — no window access)
const INITIAL_CARDS = CARDS_ORGANIZED
import { AppId, DesktopCard, WindowState } from '@/lib/types'

type WindowsState = {
  windows: WindowState[]
  topZ: number
  cards: DesktopCard[]
}

type WindowsAction =
  | { type: 'OPEN_APP'; appId: AppId }
  | { type: 'OPEN_CARD'; card: DesktopCard }
  | { type: 'CLOSE_WINDOW'; id: string }
  | { type: 'MINIMIZE_WINDOW'; id: string }
  | { type: 'FOCUS_WINDOW'; id: string }
  | { type: 'FOCUS_CARD'; cardId: string }
  | { type: 'SET_CARDS'; cards: DesktopCard[] }
  | { type: 'MOVE_CARD'; cardId: string; x: number; y: number }

const APP_CONFIG: Record<AppId, { title: string; size: { width: number; height: number } }> = {
  finder:   { title: 'Finder',   size: { width: 860, height: 594 } },
  mail:     { title: 'Mail',     size: { width: 780, height: 616 } },
  photos:   { title: 'Photos',   size: { width: 800, height: 616 } },
  music:    { title: 'Music',    size: { width: 760, height: 638 } },
  resume:   { title: 'Résumé',   size: { width: 720, height: 616 } },
  blog:     { title: 'Blog',     size: { width: 980, height: 682 } },
  agent:    { title: 'Agent',    size: { width: 420, height: 638 } },
  jobkompass: { title: 'JobKompass', size: { width: 1100, height: 770 } },
  terminal: { title: 'Terminal', size: { width: 980, height: 616 } },
}

const MOBILE_BREAKPOINT = 1024
const MOBILE_HEADER_TITLES = ['itwela.dev', 'tech solutions specialist', 'ai product engineer', 'full stack developer', 'iOS developer']
const MOBILE_HOME_APPS: AppId[] = ['finder', 'mail', 'photos', 'music', 'resume', 'blog', 'agent', 'jobkompass', 'terminal']
const MOBILE_DOCK_APPS: AppId[] = ['resume', 'mail', 'blog', 'agent']
const MOBILE_APP_ICON: Record<AppId, string> = {
  finder: '/finderimage.jpg',
  mail: '/mialicon.png',
  photos: '/photosicon.png',
  music: '/applemusicicon.png',
  resume: '/resumeicon.svg',
  blog: '/blogicon.png',
  agent: '/aiiconmessage.png',
  jobkompass: '/jobkompass_logo.svg',
  terminal: '/favicon.ico',
}

type MobileOpenView =
  | { kind: 'card'; cardId: string }
  | { kind: 'app'; appId: AppId }

const STARTUP_STATIC_IMAGES = [
  '/desktop-bg-light.jpg',
  '/desktop-bg-dark.jpg',
  '/finderimage.jpg',
  '/mialicon.png',
  '/photosicon.png',
  '/applemusicicon.png',
  '/resumeicon.svg',
  '/blogicon.png',
  '/aiiconmessage.png',
  '/jobkompass_logo.svg',
]

function preloadImage(url: string) {
  return new Promise<void>((resolve) => {
    if (!url) return resolve()
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

function StartupScreen({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)))
  const letters = 'itwela.dev'.split('')
  const [showSlowHint, setShowSlowHint] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSlowHint(true), 2000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-[12000] bg-black flex items-center justify-center"
    >
      <div className="w-full px-8 text-center max-w-[640px]">
        <div className="relative mx-auto h-[240px] min-[1025px]:h-[290px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="absolute left-1/2 top-0 -translate-x-1/2 font-semibold tracking-[-0.03em] text-white text-[32px] min-[1025px]:text-[40px]"
          >
            {letters.map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.02,
                  ease: 'easeInOut',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>

          <div className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[min(240px,72vw)] min-[1025px]:w-[min(260px,36vw)]">
            <div className="h-[6px] w-full rounded-full bg-white/20 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(8, pct)}%` }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mt-3 h-[1px] w-[min(180px,48vw)] bg-white/25"
            />
            <AnimatePresence>
              {showSlowHint && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.72, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="mt-3 text-[11px] text-white/75 tracking-[0.01em]"
                >
                  Loading the full experience...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function getCenteredPosition(size: { width: number; height: number }) {
  if (typeof window === 'undefined') return { x: 100, y: 80 }
  return {
    x: Math.round((window.innerWidth  - size.width)  / 2),
    y: Math.round((window.innerHeight - size.height) / 2),
  }
}

function windowsReducer(state: WindowsState, action: WindowsAction): WindowsState {
  const newZ = state.topZ + 1

  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.cards }

    case 'OPEN_APP': {
      const existing = state.windows.find((w) => w.appId === action.appId && w.id.startsWith('app-'))
      if (existing) {
        const config = APP_CONFIG[action.appId]
        return {
          ...state, topZ: newZ,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, title: config.title, size: config.size, isOpen: true, isMinimized: false, zIndex: newZ }
              : w
          ),
        }
      }
      const config = APP_CONFIG[action.appId]
      const position = getCenteredPosition(config.size)
      return {
        ...state, topZ: newZ,
        windows: [
          ...state.windows,
          {
            id: `app-${action.appId}`,
            appId: action.appId,
            title: config.title,
            isOpen: true,
            isMinimized: false,
            position,
            size: config.size,
            zIndex: newZ,
          },
        ],
      }
    }

    case 'OPEN_CARD': {
      const windowId = `card-${action.card.id}`
      const existing = state.windows.find((w) => w.id === windowId)
      if (existing) {
        return {
          ...state, topZ: newZ,
          windows: state.windows.map((w) =>
            w.id === windowId ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w
          ),
        }
      }
      const size = { width: 1100, height: 682 }
      return {
        ...state, topZ: newZ,
        windows: [
          ...state.windows,
          {
            id: windowId,
            appId: 'finder' as AppId,
            title: action.card.label,
            isOpen: true,
            isMinimized: false,
            position: getCenteredPosition(size),
            size,
            zIndex: newZ,
          },
        ],
      }
    }

    case 'CLOSE_WINDOW':
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) }

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w
        ),
      }

    case 'FOCUS_WINDOW':
      return {
        ...state, topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: newZ } : w
        ),
      }

    case 'FOCUS_CARD':
      return {
        ...state, topZ: newZ,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, zIndex: newZ } : c
        ),
      }

    case 'MOVE_CARD':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, x: action.x, y: action.y } : c
        ),
      }

    default:
      return state
  }
}

// Bottom-right attribution: letters animate UP on hover, staggered
const attrLetterSpring = { type: 'spring' as const, stiffness: 400, damping: 22 }
const attrContainerVariants = {
  rest: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  hover: { transition: { staggerChildren: 0.025, staggerDirection: 1 } },
}
const attrLetterVariants = {
  rest: { y: 0, transition: attrLetterSpring },
  hover: { y: -3, transition: attrLetterSpring },
}

function AttrAnimatedText({ text, className }: { text: string; className?: string }) {
  const chars = text.split('')
  return (
    <motion.span
      className={`inline-flex cursor-pointer ${className ?? ''}`}
      initial="rest"
      variants={attrContainerVariants}
      whileHover="hover"
      animate="rest"
    >
      {chars.map((char, i) => (
        <motion.span key={`${text}-${i}`} variants={attrLetterVariants} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

function AttributionBlock({ isDark, reveal }: { isDark: boolean; reveal: boolean }) {
  const baseClass = 'menubar-muted text-[10px] opacity-80 leading-tight text-right whitespace-nowrap [text-shadow:0_1px_2px_rgba(100,100,100,0.7)]'
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 12 }}
      transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
      className={`${baseClass} fixed bottom-4 right-4 z-[9998] cursor-pointer`}
    >
      {isDark ? (
        <><AttrAnimatedText text="Photo by " /> <a href="https://unsplash.com/@bennyrotlevy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90 cursor-pointer"><AttrAnimatedText text="Benny Rotlevy" /></a> <AttrAnimatedText text="on " /> <a href="https://unsplash.com/photos/city-skyline-during-night-time-Z9ondzqwkEo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90 cursor-pointer"><AttrAnimatedText text="Unsplash" /></a></>
      ) : (
        <><AttrAnimatedText text="Photo by " /> <a href="https://unsplash.com/@frolicsomefairy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90 cursor-pointer"><AttrAnimatedText text="Frolicsome Fairy" /></a> <AttrAnimatedText text="on " /> <a href="https://unsplash.com/photos/a-view-of-a-city-skyline-from-a-distance-k1z273IpUuY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90 cursor-pointer"><AttrAnimatedText text="Unsplash" /></a></>
      )}
    </motion.p>
  )
}

export function Desktop({ initialBlogSlug }: { initialBlogSlug?: string } = {}) {
  const [isDark, setIsDark] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [mobileOpen, setMobileOpen] = useState<MobileOpenView | null>(null)
  const [mobileHeaderIndex, setMobileHeaderIndex] = useState(0)
  const [mobileClock, setMobileClock] = useState('')
  const [showMobileMusicPanel, setShowMobileMusicPanel] = useState(false)
  const [isStartupLoading, setIsStartupLoading] = useState(true)
  const [startupProgress, setStartupProgress] = useState(0)
  const [revealCards, setRevealCards] = useState(false)
  const player = useMusicPlayer()
  const cardsRef = useRef<DesktopCard[]>(INITIAL_CARDS)
  const [state, dispatch] = useReducer(windowsReducer, undefined, () => ({
    windows: [],
    topZ: 100,
    cards: INITIAL_CARDS,
  }))
  const hasOpenedInitialBlogRef = useRef(false)

  const dbProjects = useQuery(api.projects.getAll)
  const startupDoneRef = useRef(false)

  useEffect(() => {
    cardsRef.current = state.cards
  }, [state.cards])

  useEffect(() => {
    if (startupDoneRef.current) return
    if (dbProjects === undefined) return

    let cancelled = false
    const run = async () => {
      const cardImages = dbProjects
        .map((p) => (p.imageUrl ?? '').trim())
        .filter(Boolean)
      const urls = Array.from(new Set([...STARTUP_STATIC_IMAGES, ...cardImages]))
      const total = Math.max(1, urls.length)
      let loaded = 0

      setStartupProgress(0)
      await Promise.all(
        urls.map(async (url) => {
          await preloadImage(url)
          loaded += 1
          if (!cancelled) {
            setStartupProgress(loaded / total)
          }
        })
      )

      if (cancelled) return
      startupDoneRef.current = true
      setStartupProgress(1)
      window.setTimeout(() => {
        if (!cancelled) {
          setIsStartupLoading(false)
          // Trigger a visible stagger reveal only after the startup screen fades away.
          window.setTimeout(() => {
            if (!cancelled) setRevealCards(true)
          }, 90)
        }
      }, 180)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [dbProjects])

  // All cards come from Convex — rebuild layout whenever data arrives
  useEffect(() => {
    if (dbProjects === undefined) return // still loading
    if (dbProjects.length === 0) return
    dispatch({ type: 'SET_CARDS', cards: buildAllCards(dbProjects) })
  }, [dbProjects])

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    const update = () => setIsMobileLayout(window.innerWidth <= MOBILE_BREAKPOINT)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // If a blog slug is present in the URL on first load, auto-open the Blog app
  // and let BlogApp's initialSlug logic select the matching post.
  useEffect(() => {
    if (!initialBlogSlug || hasOpenedInitialBlogRef.current) return

    // Always prepare the Blog app window for desktop
    dispatch({ type: 'OPEN_APP', appId: 'blog' })
    // And always stage the mobile Blog app view; it will only render when in mobile layout
    setMobileOpen({ kind: 'app', appId: 'blog' })

    hasOpenedInitialBlogRef.current = true
  }, [initialBlogSlug, dispatch])

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileHeaderIndex((i) => (i + 1) % MOBILE_HEADER_TITLES.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const update = () => setMobileClock(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // Keep desktop cards centered and visible as viewport shrinks.
  useEffect(() => {
    const recenterCards = () => {
      if (isMobileLayout) return
      const cards = cardsRef.current
      if (!cards.length) return

      const menuH = 28
      const dockH = 100
      const pad = 16
      const w = window.innerWidth
      const h = window.innerHeight

      const minX = Math.min(...cards.map((c) => c.x))
      const minY = Math.min(...cards.map((c) => c.y))
      const maxX = Math.max(...cards.map((c) => c.x + c.width))
      const maxY = Math.max(...cards.map((c) => c.y + c.height))

      const groupW = Math.max(1, maxX - minX)
      const groupH = Math.max(1, maxY - minY)
      const groupCx = minX + groupW / 2
      const groupCy = minY + groupH / 2

      const areaW = Math.max(1, w - pad * 2)
      const areaH = Math.max(1, h - menuH - dockH - pad * 2)
      const areaCx = pad + areaW / 2
      const areaCy = menuH + pad + areaH / 2

      // Slightly compress card positions only when needed.
      let scale = Math.min(1, areaW / groupW, areaH / groupH)
      scale = Math.max(scale, 0.86)
      if (scale > 0.995) scale = 1

      let changed = false
      const next = cards.map((card) => {
        const cardCx = card.x + card.width / 2
        const cardCy = card.y + card.height / 2
        const width = card.width
        const height = card.height

        let nx = areaCx + (cardCx - groupCx) * scale - width / 2
        let ny = areaCy + (cardCy - groupCy) * scale - height / 2

        const clampMaxX = Math.max(pad, w - pad - width)
        const clampMaxY = Math.max(menuH + pad, h - dockH - pad - height)
        nx = Math.max(pad, Math.min(clampMaxX, nx))
        ny = Math.max(menuH + pad, Math.min(clampMaxY, ny))

        const rx = Math.round(nx)
        const ry = Math.round(ny)
        if (Math.abs(rx - card.x) > 0 || Math.abs(ry - card.y) > 0) {
          changed = true
          return { ...card, x: rx, y: ry }
        }
        return card
      })
      if (changed) dispatch({ type: 'SET_CARDS', cards: next })
    }
    recenterCards()
    window.addEventListener('resize', recenterCards)
    return () => window.removeEventListener('resize', recenterCards)
  }, [isMobileLayout])

  const handleOpenApp = useCallback((appId: AppId) => {
    dispatch({ type: 'OPEN_APP', appId })
  }, [])

  const handleOpenCard = useCallback((card: DesktopCard) => {
    dispatch({ type: 'OPEN_CARD', card })
  }, [])

  const openApps = new Set(
    state.windows
      .filter((w) => w.isOpen && !w.isMinimized && w.id.startsWith('app-'))
      .map((w) => w.appId)
  )

  function renderAppContent(win: WindowState) {
    if (win.id.startsWith('card-')) {
      const card = state.cards.find((c) => c.id === win.id.replace('card-', ''))
      if (!card) return null
      return <CardWindowContent card={card} />
    }
    switch (win.appId) {
      case 'finder': return <FinderApp />
      case 'mail':   return <MailApp />
      case 'photos': return <PhotosApp />
      case 'music':  return <MusicApp />
      case 'resume': return <ResumeApp />
      case 'blog':     return <BlogApp initialSlug={initialBlogSlug} />
      case 'agent':    return <AgentApp />
      case 'jobkompass': return <JobKompassApp />
      case 'terminal': return <TerminalApp />
    }
  }

  function renderAppById(appId: AppId) {
    switch (appId) {
      case 'finder': return <FinderApp />
      case 'mail':   return <MailApp />
      case 'photos': return <PhotosApp />
      case 'music':  return <MusicApp />
      case 'resume': return <ResumeApp />
      case 'blog':   return <BlogApp initialSlug={initialBlogSlug} />
      case 'agent':  return <AgentApp />
      case 'jobkompass': return <JobKompassApp />
      case 'terminal': return <TerminalApp />
    }
  }

  const mobileOpenCard =
    mobileOpen?.kind === 'card'
      ? state.cards.find((c) => c.id === mobileOpen.cardId) ?? null
      : null
  const revealUi = !isStartupLoading

  return (
    <div
      className="relative w-screen overflow-hidden no-select"
      style={{ paddingTop: isMobileLayout ? '0px' : '28px', height: '100dvh' }}
    >
      {/* Background layers: light always visible, dark crossfades on theme toggle */}
      <div className="absolute inset-0 desktop-bg-layer desktop-bg-layer-light" aria-hidden />
      <div
        className="absolute inset-0 desktop-bg-layer desktop-bg-layer-dark pointer-events-none"
        style={{ opacity: isDark ? 1 : 0 }}
        aria-hidden
      />
      <div className="relative z-10">
        {isMobileLayout ? (
          <div className="relative w-full overflow-y-auto pb-28 pt-4 px-4" style={{ height: '100dvh' }}>
            {/* Mobile top bar */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: revealUi ? 1 : 0, y: revealUi ? 0 : -8 }}
              transition={{ duration: 0.32, delay: 0.04, ease: 'easeOut' }}
              className="flex items-center justify-between mb-4 px-1 text-xs text-white/90"
            >
              <span>{mobileClock}</span>
              <span className="absolute left-1/2 -translate-x-1/2 text-[12px] font-semibold max-w-[68vw] truncate text-center text-gray-900 dark:text-white/90">
                {MOBILE_HEADER_TITLES[mobileHeaderIndex]}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowMobileMusicPanel((v) => !v)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white/90 hover:bg-black/5 dark:hover:bg-white/10"
                  title="Music controls"
                >
                  {player.isPlaying ? <HiVolumeUp size={14} /> : <HiVolumeOff size={14} />}
                </button>
                <button
                  onClick={() => setIsDark((d) => !d)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white/90 hover:bg-black/5 dark:hover:bg-white/10"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  )}
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {showMobileMusicPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 rounded-[28px] p-4 border border-white/20 bg-[linear-gradient(135deg,rgba(70,80,100,0.42),rgba(58,62,78,0.48))] backdrop-blur-2xl shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/25 border border-white/10 flex-shrink-0">
                      {player.currentTrack?.coverUrl ? (
                        <img src={player.currentTrack.coverUrl} alt="" className="w-full h-full object-cover" draggable={false} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/70 text-xl">♫</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-semibold text-white truncate">{player.currentTrack?.title ?? 'Not Playing'}</p>
                      <p className="text-[13px] text-white/70 truncate">{player.currentTrack?.artist ?? '—'}</p>
                      <div className="mt-2 flex items-center justify-between text-white/85">
                        <button onClick={player.prev} disabled={!player.currentTrack} className="disabled:opacity-40"><HiBackward size={22} /></button>
                        <button onClick={player.togglePlayPause} disabled={!player.currentTrack} className="disabled:opacity-40">
                          {player.isPlaying ? <HiPause size={26} /> : <HiPlay size={26} />}
                        </button>
                        <button onClick={player.next} disabled={!player.currentTrack} className="disabled:opacity-40"><HiForward size={22} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={player.toggleMute} disabled={!player.currentTrack} className="text-white/80 disabled:opacity-40">
                      {player.isMuted ? <HiVolumeOff size={16} /> : <HiVolumeUp size={16} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={player.isMuted ? 0 : player.volume}
                      disabled={!player.currentTrack}
                      onChange={(e) => {
                        player.setVolume(Number(e.target.value))
                        if (player.isMuted) player.toggleMute()
                      }}
                      className="flex-1 h-1 accent-white/90 disabled:opacity-40"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* iOS-like widget cards */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: revealUi ? 1 : 0, y: revealUi ? 0 : 18 }}
              transition={{ duration: 0.38, delay: 0.12, ease: 'easeOut' }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {state.cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setMobileOpen({ kind: 'card', cardId: card.id })}
                  className="text-left rounded-3xl overflow-hidden bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/15 shadow-lg min-h-[130px]"
                >
                  <div className="h-[86px] bg-black/20 dark:bg-black/20 overflow-hidden">
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt="" className="w-full h-full object-cover" draggable={false} />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[12px] font-semibold text-white/95 truncate">{card.label}</p>
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Home-screen app grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealUi ? 1 : 0, y: revealUi ? 0 : 20 }}
              transition={{ duration: 0.4, delay: 0.18, ease: 'easeOut' }}
              className="mt-5 grid grid-cols-4 gap-x-3 gap-y-4"
            >
              {MOBILE_HOME_APPS.map((appId) => (
                <button key={appId} onClick={() => setMobileOpen({ kind: 'app', appId })} className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-xl overflow-hidden border shadow-md ${
                    appId === 'jobkompass'
                      ? 'bg-white/95 dark:bg-white/85 border-white/70 dark:border-white/40'
                      : 'bg-white/20 border-white/20'
                  }`}>
                    {appId === 'terminal' ? (
                      <div className="w-full h-full bg-[#1c1c1e] text-green-400 flex items-center justify-center text-[11px] font-mono">{'>_'}</div>
                    ) : (
                      <img
                        src={MOBILE_APP_ICON[appId]}
                        alt={APP_CONFIG[appId].title}
                        className={`w-full h-full ${
                          appId === 'jobkompass' ? 'object-contain p-1.5' : 'object-cover'
                        }`}
                        draggable={false}
                      />
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-white/90 text-center leading-tight">{APP_CONFIG[appId].title}</span>
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: revealUi ? 1 : 0, y: revealUi ? 0 : 12 }}
              transition={{ duration: 0.35, delay: 0.24, ease: 'easeOut' }}
              className="mt-5 pb-12 text-center text-[10px] text-white/70 leading-relaxed"
            >
              {isDark ? (
                <span>
                  Photo by <a href="https://unsplash.com/@bennyrotlevy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline">Benny Rotlevy</a> on <a href="https://unsplash.com/photos/city-skyline-during-night-time-Z9ondzqwkEo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
                </span>
              ) : (
                <span>
                  Photo by <a href="https://unsplash.com/@frolicsomefairy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline">Frolicsome Fairy</a> on <a href="https://unsplash.com/photos/a-view-of-a-city-skyline-from-a-distance-k1z273IpUuY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
                </span>
              )}
            </motion.div>

            {/* iPhone-like dock */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] w-[min(92vw,390px)]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: revealUi ? 1 : 0, y: revealUi ? 0 : 24 }}
                transition={{ duration: 0.4, delay: 0.28, ease: 'easeOut' }}
                className="rounded-2xl px-3 py-2 bg-white/20 dark:bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-around"
              >
                {MOBILE_DOCK_APPS.map((appId) => (
                  <button key={appId} onClick={() => setMobileOpen({ kind: 'app', appId })} className="w-12 h-12 rounded-xl overflow-hidden bg-white/20">
                    {appId === 'terminal' ? (
                      <div className="w-full h-full bg-[#1c1c1e] text-green-400 flex items-center justify-center text-[10px] font-mono">{'>_'}</div>
                    ) : (
                      <img src={MOBILE_APP_ICON[appId]} alt={APP_CONFIG[appId].title} className="w-full h-full object-cover" draggable={false} />
                    )}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Phone-style full screen window */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 28, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="fixed inset-0 z-[10020] bg-[rgba(0,0,0,0.55)] backdrop-blur-sm p-2"
                >
                  <div className="w-full h-full rounded-[22px] overflow-hidden bg-white dark:bg-[#111214] border border-white/20 shadow-2xl flex flex-col">
                    <div className="h-12 flex items-center gap-2 px-3 border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#151618]/95">
                      <button
                        onClick={() => setMobileOpen(null)}
                        className="px-2 py-1 rounded-md text-xs bg-black/5 dark:bg-white/10 text-gray-700 dark:text-white/80"
                      >
                        Close
                      </button>
                      <div className="flex-1 truncate text-[12px] text-gray-500 dark:text-white/50">
                        {mobileOpen.kind === 'app'
                          ? APP_CONFIG[mobileOpen.appId].title
                          : mobileOpenCard?.label ?? 'Card'}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {mobileOpen.kind === 'app' && renderAppById(mobileOpen.appId)}
                      {mobileOpen.kind === 'card' && mobileOpenCard && <CardWindowContent card={mobileOpenCard} stacked />}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <MenuBar onOpenApp={handleOpenApp} reveal={revealUi} />

            {/* Desktop cards */}
            <div className="absolute inset-0" style={{ top: '28px' }}>
              <AnimatePresence>
                {state.cards.map((card, i) => {
                  const isViewing = state.windows.some(
                    (w) => w.id === `card-${card.id}` && w.isOpen && !w.isMinimized
                  )
                  return (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      index={i}
                      reveal={revealCards}
                      isViewing={isViewing}
                      onOpen={handleOpenCard}
                      onFocus={(id) => dispatch({ type: 'FOCUS_CARD', cardId: id })}
                      onDragEnd={(cardId, x, y) => dispatch({ type: 'MOVE_CARD', cardId, x, y })}
                    />
                  )
                })}
              </AnimatePresence>
            </div>

            {/* App windows */}
            <AnimatePresence>
              {state.windows.map((win) => (
                <MacWindow
                  key={win.id}
                  window={win}
                  onClose={() => dispatch({ type: 'CLOSE_WINDOW', id: win.id })}
                  onMinimize={() => dispatch({ type: 'MINIMIZE_WINDOW', id: win.id })}
                  onMaximize={() => {}}
                  onFocus={() => dispatch({ type: 'FOCUS_WINDOW', id: win.id })}
                  showReadingUI={win.appId !== 'music'}
                >
                  {renderAppContent(win)}
                </MacWindow>
              ))}
            </AnimatePresence>

            <Dock openApps={openApps} onOpenApp={handleOpenApp} reveal={revealUi} />
          </>
        )}

        {!isMobileLayout && (
          <>
            {/* Theme toggle: bottom left */}
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: revealUi ? 1 : 0, y: revealUi ? 0 : 14 }}
              transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
              onClick={() => setIsDark((d) => !d)}
              className="menubar-icon fixed bottom-4 left-4 z-[9998] p-2 rounded-lg cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              whileHover={{ scale: 1.15, rotate: 8 }}
              whileTap={{ scale: 0.92 }}
            >
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </motion.button>

            {/* Photo attribution: bottom right */}
            <AttributionBlock isDark={isDark} reveal={revealUi} />
          </>
        )}
      </div>
      <AnimatePresence>
        {isStartupLoading && (
          <StartupScreen progress={startupProgress} />
        )}
      </AnimatePresence>
    </div>
  )
}
