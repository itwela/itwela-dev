'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { DesktopCard } from '@/lib/types'

interface DraggableCardProps {
  card: DesktopCard
  index?: number
  isViewing?: boolean
  reveal?: boolean
  onOpen: (card: DesktopCard) => void
  onFocus: (id: string) => void
  onDragEnd?: (cardId: string, x: number, y: number) => void
}

export function DraggableCard({
  card,
  index = 0,
  isViewing = false,
  reveal = true,
  onOpen,
  onFocus,
  onDragEnd,
}: DraggableCardProps) {
  const dragStartedRef = useRef(false)
  const hasImage = card.imageUrl && card.imageUrl.trim() !== ''
  const isPhone = card.orientation === 'phone'
  const isLandscape = card.orientation === 'landscape'
  const w = isPhone ? card.width * 0.92 : card.width
  const h = isPhone ? card.height * 0.9 : isLandscape ? card.height * 0.95 : card.height
  const offsetX = isPhone ? card.width * 0.04 : 0
  const offsetY = isPhone ? card.height * 0.05 : isLandscape ? card.height * 0.025 : 0

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: card.x + offsetX, y: card.y + offsetY, rotate: card.rotation, scale: 0.96, opacity: 0 }}
      animate={{
        x: card.x + offsetX,
        y: card.y + offsetY,
        rotate: card.rotation,
        scale: reveal ? 1 : 0.96,
        opacity: reveal ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 360,
        damping: 38,
        delay: reveal ? index * 0.07 : 0,
      }}
      whileDrag={{ scale: 1, cursor: 'grabbing', zIndex: 9998 }}
      onDragStart={() => { dragStartedRef.current = true }}
      onDragEnd={(_e, info) => {
        onDragEnd?.(card.id, card.x + info.offset.x, card.y + info.offset.y)
        onFocus(card.id)
        setTimeout(() => { dragStartedRef.current = false }, 50)
      }}
      onClick={() => { if (!dragStartedRef.current) { onFocus(card.id); onOpen(card) } }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        zIndex: card.zIndex,
        cursor: 'grab',
      }}
      className="desktop-card no-select flex flex-col relative isolate"
    >
      <div className="desktop-card-frame glass-card blur-visible w-full flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col relative">
        {hasImage ? (
          <div className="flex-1 min-h-0 min-w-0 relative">
            {card.orientation === 'phone' ? (
              <img
                src={card.imageUrl}
                alt=""
                draggable={false}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain scale-90 pointer-events-none select-none rounded-[16px]"
              />
            ) : (
              <img
                src={card.imageUrl}
                alt=""
                draggable={false}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none ${card.orientation === 'portrait' ? 'rounded-lg' : card.orientation === 'landscape' ? 'rounded-sm' : ''}`}
              />
            )}
          </div>
        ) : (
          <div className="w-full flex-1 min-h-0 bg-transparent" aria-hidden />
        )}
        {isViewing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(8px)', boxShadow: 'none' }}>
            <span className="text-white text-[9px] font-semibold uppercase tracking-widest opacity-80">viewing</span>
          </div>
        )}
      </div>
      <p className="card-label mt-1.5 flex-shrink-0">{card.label}</p>
    </motion.div>
  )
}
