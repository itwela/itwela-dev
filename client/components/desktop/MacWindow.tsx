'use client'

import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import { WindowState } from '@/lib/types'

interface MacWindowProps {
  window: WindowState
  children: React.ReactNode
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  showReadingUI?: boolean
}

function findScrollable(container: HTMLElement): HTMLElement | null {
  if (container.scrollHeight - container.clientHeight > 8) return container
  for (const el of Array.from(container.querySelectorAll('*')) as HTMLElement[]) {
    if (el.scrollHeight - el.clientHeight > 8) return el
  }
  return null
}

export function MacWindow({ window: win, children, onClose, onMinimize, onFocus, showReadingUI = true }: MacWindowProps) {
  const dragControls = useDragControls()
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [canScrollMore, setCanScrollMore] = useState(false)

  const checkOverflow = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const el = findScrollable(container)
    if (!el) { setCanScrollMore(false); setProgress(0); return }
    const scrollable = el.scrollHeight - el.clientHeight
    setCanScrollMore(el.scrollTop < scrollable - 8)
    setProgress((el.scrollTop / scrollable) * 100)
  }, [])

  useEffect(() => {
    if (!showReadingUI) {
      setCanScrollMore(false)
      setProgress(0)
      return
    }

    const container = containerRef.current
    if (!container) return

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement
      const scrollable = target.scrollHeight - target.clientHeight
      if (scrollable <= 0) return
      setProgress((target.scrollTop / scrollable) * 100)
      setCanScrollMore(target.scrollTop < scrollable - 8)
    }

    container.addEventListener('scroll', onScroll, { capture: true })

    // Poll to catch async content loading
    checkOverflow()
    const t1 = setTimeout(checkOverflow, 150)
    const t2 = setTimeout(checkOverflow, 500)
    const t3 = setTimeout(checkOverflow, 1200)

    return () => {
      container.removeEventListener('scroll', onScroll, { capture: true })
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [checkOverflow, showReadingUI])

  const scrollDown = () => {
    const container = containerRef.current
    if (!container) return
    const el = findScrollable(container)
    el?.scrollBy({ top: 220, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          key={win.id}
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          onPointerDown={onFocus}
          style={{
            position: 'fixed',
            left: win.position.x,
            top: win.position.y,
            width: win.size.width,
            height: win.size.height,
            zIndex: win.zIndex,
          }}
          className="mac-window"
        >
          {/* Title bar — drag handle */}
          <div
            className="mac-titlebar"
            onPointerDown={(e) => {
              e.preventDefault()
              dragControls.start(e)
            }}
          >
            <div className="flex items-center gap-2">
              <button
                className="traffic-light close"
                onClick={(e) => { e.stopPropagation(); onClose() }}
                title="Close"
              />
              <button
                className="traffic-light minimize"
                onClick={(e) => { e.stopPropagation(); onMinimize() }}
                title="Minimize"
              />
              <button
                className="traffic-light maximize"
                title="Zoom"
              />
            </div>
            <span
              className="mac-titlebar-text absolute left-1/2 -translate-x-1/2 text-xs font-medium pointer-events-none whitespace-nowrap"
              style={{ fontSize: '13px' }}
            >
              {win.title}
            </span>
          </div>

          {showReadingUI && (
            <div className="h-[3px] w-full bg-black/10 dark:bg-white/5 relative overflow-hidden shrink-0">
              <motion.div
                className="absolute left-0 top-0 h-full"
                animate={{
                  width: `${progress}%`,
                  backgroundColor: progress >= 99
                    ? 'rgba(34,197,94,0.75)'
                    : 'rgba(59,130,246,0.70)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          )}

          {/* Content + continue reading overlay */}
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ height: showReadingUI ? 'calc(100% - 46px)' : 'calc(100% - 44px)' }}
          >
            {children}

            <AnimatePresence>
              {showReadingUI && canScrollMore && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  onClick={scrollDown}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 dark:bg-white/10 text-white backdrop-blur-sm border border-white/10 hover:bg-black/80 dark:hover:bg-white/20 transition-colors shadow-lg z-50"
                >
                  Continue reading ↓
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
