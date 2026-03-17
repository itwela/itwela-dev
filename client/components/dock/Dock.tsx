'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppId } from '@/lib/types'

// Image icons render only after mount so server and client output match (avoids hydration error).
type IconProps = { mounted?: boolean }

function FinderIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/finderimage.jpg"
      alt="Finder"
      className="w-full h-full object-cover rounded-xl scale-[0.90]"
    />
  )
}

function MailIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/mialicon.png"
      alt="Mail"
      className="w-full h-full object-cover rounded-xl scale-90"
    />
  )
}

function PhotosIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/photosicon.png"
      alt="Photos"
      className="w-full h-full object-cover rounded-xl scale-90"
    />
  )
}

function MusicIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/applemusicicon.png"
      alt="Music"
      className="w-full h-full object-cover rounded-xl scale-90"
    />
  )
}

// Resume icon (user image)
function PagesIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/resumeicon.svg"
      alt="Resume"
      className="w-full h-full object-cover rounded-xl scale-90"
    />
  )
}

// Blog icon (user image)
function NewsIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/blogicon.png"
      alt="Blog"
      className="w-full h-full object-cover rounded-xl scale-90"
    />
  )
}

// Agent (AI chat) icon — user image
function AgentIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/aiiconmessage.png"
      alt="Agent"
      className="w-full h-full object-cover rounded-xl scale-90"
    />
  )
}

function JobKompassIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <img
      src="/jobkompass_logo.svg"
      alt="JobKompass"
      className="w-full h-full object-contain rounded-xl bg-white scale-90 p-1.5"
    />
  )
}

// Terminal icon — inline SVG (macOS Terminal.app style)
function TerminalIcon({ mounted }: IconProps) {
  if (!mounted) return <div className="w-full h-full rounded-xl bg-gray-300/50 dark:bg-gray-600/50" aria-hidden />
  return (
    <div className="w-full h-full rounded-xl scale-90 bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-white/10">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        {/* Prompt arrow */}
        <path d="M6 10 L13 16 L6 22" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Cursor underline */}
        <rect x="16" y="20" width="10" height="2.5" rx="1.25" fill="#4ade80"/>
      </svg>
    </div>
  )
}

const DOCK_APPS: { id: AppId; name: string; IconComponent: React.FC<IconProps> }[] = [
  { id: 'finder',   name: 'Finder',   IconComponent: FinderIcon   },
  { id: 'mail',     name: 'Contact',  IconComponent: MailIcon     },
  { id: 'photos',   name: 'Photos',   IconComponent: PhotosIcon   },
  { id: 'music',    name: 'Music',    IconComponent: MusicIcon    },
  { id: 'resume',   name: 'Resume',   IconComponent: PagesIcon    },
  { id: 'blog',     name: 'Blog',     IconComponent: NewsIcon     },
  { id: 'agent',    name: 'Agent',    IconComponent: AgentIcon    },
  { id: 'terminal', name: 'Terminal', IconComponent: TerminalIcon },
  { id: 'jobkompass', name: 'JobKompass', IconComponent: JobKompassIcon },
]

const ICON_SIZE = 48

function DockIcon({
  app,
  onClick,
  isOpen,
  mounted,
  notificationCount = 0,
}: {
  app: (typeof DOCK_APPS)[0]
  onClick: () => void
  isOpen: boolean
  mounted: boolean
  notificationCount?: number
}) {
  const [hovered, setHovered] = useState(false)
  const showBadge = notificationCount > 0
  const badgeLabel = notificationCount > 99 ? '99+' : String(notificationCount)

  return (
    <div className="relative flex flex-col items-center justify-end">
      {/* Label above dock on hover – well clear of the dock */}
      <div className="absolute bottom-full mb-4 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-gray-700/95 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          {app.name}
        </motion.div>
      </div>
      <motion.div
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="cursor-pointer rounded-xl overflow-visible origin-bottom outline-none focus:outline-none relative"
      >
        <div className="rounded-xl overflow-hidden w-full h-full">
          <app.IconComponent mounted={mounted} />
        </div>
        {/* macOS-style notification badge: only show when count > 0 */}
        {showBadge && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 shadow-sm"
            aria-label={`${notificationCount} notifications`}
          >
            {badgeLabel}
          </span>
        )}
      </motion.div>
      {isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/40 dark:bg-white/70"
        />
      )}
    </div>
  )
}

export type DockNotificationCounts = Partial<Record<AppId, number>>

interface DockProps {
  openApps: Set<AppId>
  onOpenApp: (appId: AppId) => void
  /** Notification badge counts per app. Only show badge when count > 0. Omit or use 0 for no badge. */
  notificationCounts?: DockNotificationCounts
  reveal?: boolean
}

const DEFAULT_NOTIFICATION_COUNTS: DockNotificationCounts = {
  agent: 1, // only Agent shows badge; others are 0 / no badge
}

export function Dock({ openApps, onOpenApp, notificationCounts = DEFAULT_NOTIFICATION_COUNTS, reveal = true }: DockProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] isolate"
      style={{
        willChange: 'opacity',
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 24 }}
        transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
      >
        <div className="dock-container">
          {DOCK_APPS.flatMap((app) => {
            const iconEl = (
              <DockIcon
                key={app.id}
                app={app}
                onClick={() => onOpenApp(app.id)}
                isOpen={openApps.has(app.id)}
                mounted={mounted}
                notificationCount={notificationCounts[app.id] ?? 0}
              />
            )

            if (app.id !== 'jobkompass') return [iconEl]

            return [
              <div
                key="dock-divider-terminal-jobkompass"
                className="self-center h-10 w-px rounded-full bg-white/50 dark:bg-white/18"
                aria-hidden
              />,
              iconEl,
            ]
          })}
        </div>
      </motion.div>
    </div>
  )
}
