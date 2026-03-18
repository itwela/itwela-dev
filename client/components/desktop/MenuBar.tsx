'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppId } from '@/lib/types'
import { useMusicPlayer } from '@/lib/musicPlayer'
import { HiPlay, HiPause, HiForward, HiBackward } from 'react-icons/hi2'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

const TITLES = ['i want to build technical solutions for you', 'ai product engineer', 'full stack developer', 'iOS developer']

const letterSpring = { type: 'spring' as const, stiffness: 400, damping: 22 }

const containerVariants = {
  rest: {
    transition: { staggerChildren: 0.015, staggerDirection: -1 },
  },
  hover: {
    transition: { staggerChildren: 0.025, staggerDirection: 1 },
  },
}

const letterVariants = {
  rest: { y: 0, transition: letterSpring },
  hover: { y: 3, transition: letterSpring },
}

function AnimatedText({
  text,
  className,
}: {
  text: string
  className: string
}) {
  const chars = text.split('')
  return (
    <motion.span
      className={`cursor-pointer inline-flex ${className}`}
      style={{ fontSize: '13px' }}
      initial="rest"
      variants={containerVariants}
      whileHover="hover"
      animate="rest"
    >
      {chars.map((char, i) => (
        <motion.span key={`${text}-${i}`} variants={letterVariants} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface MenuBarProps {
  onOpenApp: (appId: AppId) => void
  reveal?: boolean
}

export function MenuBar({ onOpenApp: _onOpenApp, reveal = true }: MenuBarProps) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [titleIndex, setTitleIndex] = useState(0)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const player = useMusicPlayer()
  const miniPlayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex(i => (i + 1) % TITLES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!miniPlayerRef.current) return
      if (!miniPlayerRef.current.contains(event.target as Node)) {
        setShowMiniPlayer(false)
      }
    }
    if (showMiniPlayer) {
      document.addEventListener('pointerdown', onPointerDown)
    }
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [showMiniPlayer])

  return (
    <motion.div
      initial={false}
      animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : -7 }}
      transition={{ duration: 0.32, delay: 0.05, ease: 'easeOut' }}
      className="menubar fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4"
      style={{ height: '28px' }}
    >
      {/* Left: name + cycling title */}
      <div className="flex items-center gap-1 min-w-0">
        <AnimatedText text="itwela.dev —" className="menubar-text font-semibold text-xs shrink-0" />
        <div className="relative" style={{ height: '18px' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={titleIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="menubar-text font-semibold text-xs absolute left-0 top-0 whitespace-nowrap"
              style={{ fontSize: '13px' }}
            >
              {TITLES[titleIndex]}
            </motion.span>
          </AnimatePresence>
          {/* invisible spacer that sizes the container to the current title */}
          <span className="invisible font-semibold text-xs whitespace-nowrap" style={{ fontSize: '13px' }}>
            {TITLES[titleIndex]}
          </span>
        </div>
      </div>

      {/* Right: now-playing, date, time */}
      <div className="flex items-center gap-3 relative">
        <div className="relative" ref={miniPlayerRef}>
          <button
            onClick={() => setShowMiniPlayer((v) => !v)}
            className="menubar-icon px-1.5 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Now Playing"
          >
            {player.isPlaying ? <HiVolumeUp size={14} /> : <HiVolumeOff size={14} />}
          </button>

          <AnimatePresence>
            {showMiniPlayer && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/20 bg-[linear-gradient(135deg,rgba(120,120,120,0.25),rgba(90,90,110,0.2))] dark:bg-[linear-gradient(135deg,rgba(80,80,90,0.45),rgba(50,50,60,0.5))] shadow-2xl backdrop-blur-xl p-3 z-[10000]"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => _onOpenApp('music')}
                    className="w-16 h-16 rounded-xl bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-pink-500 dark:text-pink-300 overflow-hidden border border-white/10"
                    title="Open Music app"
                  >
                    {player.currentTrack?.coverUrl ? (
                      <img
                        src={player.currentTrack.coverUrl}
                        alt={player.currentTrack.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span className="text-2xl leading-none">♫</span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="text-gray-200/95 font-semibold text-[16px] leading-tight truncate">
                      {player.currentTrack?.title ?? 'Not Playing'}
                    </div>
                    <div className="text-[11px] text-gray-300/70 leading-tight mt-0.5 truncate">
                      {player.currentTrack?.artist ?? ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-200/90">
                    <button
                      onClick={player.prev}
                      className="p-1.5 rounded-md hover:bg-white/15 transition-colors disabled:opacity-40"
                      disabled={!player.currentTrack}
                    >
                      <HiBackward size={19} />
                    </button>
                    <button
                      onClick={player.togglePlayPause}
                      className="p-1.5 rounded-md hover:bg-white/15 transition-colors disabled:opacity-40"
                      disabled={!player.currentTrack}
                    >
                      {player.isPlaying ? <HiPause size={19} /> : <HiPlay size={19} />}
                    </button>
                    <button
                      onClick={player.next}
                      className="p-1.5 rounded-md hover:bg-white/15 transition-colors disabled:opacity-40"
                      disabled={!player.currentTrack}
                    >
                      <HiForward size={19} />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button onClick={player.toggleMute} className="text-gray-200/90 disabled:opacity-40" disabled={!player.currentTrack}>
                    {player.isMuted ? <HiVolumeOff size={14} /> : <HiVolumeUp size={14} />}
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
                    className="flex-1 h-1 accent-white disabled:opacity-40"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatedText text={date} className="menubar-muted text-xs" />
        <AnimatedText text={time} className="menubar-muted text-xs" />
      </div>
    </motion.div>
  )
}
