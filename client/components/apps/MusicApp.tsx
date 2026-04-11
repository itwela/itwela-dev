'use client'

import { useState, useEffect, useRef, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { PLACEHOLDER_MUSIC } from '@/lib/data'
import { useMusicPlayer, musicPlayer } from '@/lib/musicPlayer'
import { motion } from 'framer-motion'
import {
  HiPlay,
  HiPause,
  HiForward,
  HiBackward,
} from 'react-icons/hi2'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { FiShuffle, FiChevronRight, FiMusic, FiUser, FiList, FiHeart } from 'react-icons/fi'
import { HiHeart } from 'react-icons/hi'

type Track = {
  id: string
  title: string
  artist: string
  album?: string
  /** AWS or any URL to the audio file (from Convex) */
  audioUrl?: string | null
  coverUrl?: string | null
  duration?: number | null
  order: number
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function AlbumArt({ track, size = 'lg' }: { track: Track | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-48 h-48' : size === 'md' ? 'w-12 h-12' : 'w-8 h-8'
  const borderRadius = size === 'lg' ? 'rounded-2xl' : 'rounded-lg'

  if (track?.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={track.coverUrl}
        alt={track.title}
        className={`${sizeClass} ${borderRadius} object-cover`}
      />
    )
  }

  // Gradient based on track index
  const hue = track ? (track.order * 50 + 200) % 360 : 240
  return (
    <div
      className={`${sizeClass} ${borderRadius} flex items-center justify-center flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}deg, 60%, 30%), hsl(${(hue + 40) % 360}deg, 60%, 20%))`,
      }}
    >
      <svg viewBox="0 0 40 40" fill="white" opacity="0.4" className="w-1/2 h-1/2">
        <path d="M16 8v16M16 8h16v6H16M16 24a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM32 14a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/>
      </svg>
    </div>
  )
}

export function MusicApp({ initialTrackId }: { initialTrackId?: string } = {}) {
  const [shuffle, setShuffle] = useState(false)
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const [mobileFilter, setMobileFilter] = useState<'songs' | 'artists' | 'playlists'>('songs')
  const [mobileDrilldown, setMobileDrilldown] = useState<{ title: string; trackIds: string[] } | null>(null)
  const [desktopSection, setDesktopSection] = useState<'recent' | 'artists' | 'songs'>('recent')
  const [desktopSearch, setDesktopSearch] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubProgress, setScrubProgress] = useState<number | null>(null)
  /** null = All Tracks, otherwise show this playlist */
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<Id<'playlists'> | null>(null)
  const player = useMusicPlayer()
  const recordPlay = useMutation(api.music.recordPlay)
  const likeTrackMutation = useMutation(api.music.likeTrack)
  const unlikeTrackMutation = useMutation(api.music.unlikeTrack)
  const lastPlayedIdRef = useRef<string | null>(null)
  const hasInitialTrackRef = useRef(false)
  const [likingTrackIds, setLikingTrackIds] = useState<Set<string>>(new Set())
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set())
  const [copiedTrackId, setCopiedTrackId] = useState<string | null>(null)
  const [linkedTrackId, setLinkedTrackId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('itwela.likes.musicTracks')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setLikedTrackIds(new Set(parsed.map(String)))
    } catch {
      // ignore bad localStorage data
    }
  }, [])

  const persistLikedTracks = (set: Set<string>) => {
    try {
      window.localStorage.setItem('itwela.likes.musicTracks', JSON.stringify(Array.from(set)))
    } catch {
      // ignore quota/privacy mode
    }
  }

  const dbTracks = useQuery(api.music.getAll)
  const playlistsQuery = useQuery(api.playlists.getAll)
  const playlists = playlistsQuery ?? []
  const playlistTracks = useQuery(
    api.playlists.getTracks,
    selectedPlaylistId ? { playlistId: selectedPlaylistId } : 'skip'
  )
  const loadingTracks = dbTracks === undefined || (selectedPlaylistId !== null && playlistTracks === undefined)

  const allTracksNormalized: Track[] =
    dbTracks === undefined
      ? (player.tracks as Track[])
      : dbTracks.length > 0
      ? (dbTracks as Array<Omit<Track, 'id'> & { _id: string }>).map((t) => ({
          ...t,
          id: t._id,
        })) as Track[]
      : (PLACEHOLDER_MUSIC as Track[])

  const tracks: Track[] =
    selectedPlaylistId !== null
      ? (playlistTracks === undefined ? (player.tracks as Track[]) : (playlistTracks as Track[]))
      : allTracksNormalized

  const sourceTracks = isCompactLayout ? allTracksNormalized : tracks

  useEffect(() => {
    if (dbTracks === undefined) return
    // Keep one stable global queue so switching views/playlists never restarts playback.
    musicPlayer.setTracks(allTracksNormalized)
  }, [dbTracks, allTracksNormalized])

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Shared song links should open Music in the Songs view and highlight the linked track.
  useEffect(() => {
    if (!initialTrackId || hasInitialTrackRef.current) return
    if (allTracksNormalized.length === 0) return
    const track = allTracksNormalized.find((t) => t.id === initialTrackId)
    hasInitialTrackRef.current = true
    if (!track) return

    setLinkedTrackId(track.id)
    setDesktopSection('songs')
    setSelectedArtist(null)
    setSelectedPlaylistId(null)
    setMobileFilter('songs')
    setMobileDrilldown(null)
  }, [initialTrackId, allTracksNormalized])

  const copyLinkForTrack = async (trackId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itwela.dev'
    const url = `${origin}/?app=music&track=${encodeURIComponent(trackId)}`
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
      setCopiedTrackId(trackId)
      setTimeout(() => setCopiedTrackId((prev) => (prev === trackId ? null : prev)), 1800)
    } catch {
      // ignore copy errors
    }
  }

  const currentTrack = player.currentTrack
  const currentTrackId = currentTrack?.id ?? null
  const isPlayingTrack = (trackId: string) => player.isPlaying && currentTrackId === trackId
  const linkedTrack = linkedTrackId
    ? allTracksNormalized.find((t) => t.id === linkedTrackId) ?? null
    : null

  const playTrackById = (trackId: string) => {
    const idx = allTracksNormalized.findIndex((t) => t.id === trackId)
    if (idx < 0) return
    setLinkedTrackId(null)
    player.playByIndex(idx)
  }

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    player.seekPercent(pct * 100)
  }

  const getSeekPercentFromPointer = (clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect()
    if (rect.width <= 0) return 0
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  }

  const handleProgressPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const pointerId = e.pointerId
    const startPct = getSeekPercentFromPointer(e.clientX, bar)
    setIsScrubbing(true)
    setScrubProgress(startPct)
    player.seekPercent(startPct)

    try {
      bar.setPointerCapture(pointerId)
    } catch {
      // no-op if capture fails in some browsers
    }

    const onMove = (event: PointerEvent) => {
      const pct = getSeekPercentFromPointer(event.clientX, bar)
      setScrubProgress(pct)
      player.seekPercent(pct)
    }

    const onUp = () => {
      setIsScrubbing(false)
      setScrubProgress(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  const handleNext = () => {
    if (shuffle && player.tracks.length > 1) {
      const randomIndex = Math.floor(Math.random() * player.tracks.length)
      player.playByIndex(randomIndex)
      return
    }
    player.next()
  }

  const totalSeconds = Number.isFinite(player.duration) && player.duration > 0
    ? player.duration
    : (currentTrack?.duration && Number.isFinite(currentTrack.duration) ? currentTrack.duration : 0)
  const safeProgress = Number.isFinite(player.progress) ? player.progress : 0
  const currentSeconds = totalSeconds > 0 ? (safeProgress / 100) * totalSeconds : 0
  const selectedPlaylist = playlists.find((pl) => pl._id === selectedPlaylistId) ?? null
  const desktopQ = desktopSearch.trim().toLowerCase()
  const filteredDesktopTracks = desktopQ
    ? tracks.filter((t) => {
        const title = t.title?.toLowerCase() ?? ''
        const artist = t.artist?.toLowerCase() ?? ''
        const album = t.album?.toLowerCase() ?? ''
        return title.includes(desktopQ) || artist.includes(desktopQ) || album.includes(desktopQ)
      })
    : tracks
  const featuredTrack = currentTrack ?? linkedTrack ?? filteredDesktopTracks[0] ?? tracks[0] ?? null
  const todayTracks = filteredDesktopTracks.slice(0, Math.min(4, filteredDesktopTracks.length))
  const yesterdayTracks = filteredDesktopTracks.slice(Math.min(4, filteredDesktopTracks.length))
  const artists = Array.from(
    filteredDesktopTracks.reduce((map, track) => {
      const key = track.artist?.trim() || 'Unknown Artist'
      if (!map.has(key)) map.set(key, { name: key, count: 0, coverUrl: track.coverUrl ?? null })
      const current = map.get(key)!
      current.count += 1
      if (!current.coverUrl && track.coverUrl) current.coverUrl = track.coverUrl
      return map
    }, new Map<string, { name: string; count: number; coverUrl: string | null }>())
  ).map(([, value]) => value)
  const songsViewTracks =
    desktopSection === 'songs' && selectedArtist
      ? filteredDesktopTracks.filter((t) => (t.artist?.trim() || 'Unknown Artist') === selectedArtist)
      : filteredDesktopTracks
  const desktopSectionTitle =
    desktopSection === 'recent'
      ? (selectedPlaylist ? selectedPlaylist.name : 'Recently Added')
      : desktopSection === 'artists'
      ? 'Artists'
      : (selectedArtist ? `${selectedArtist} Songs` : 'Songs')
  const visibleTrackCount = desktopSection === 'songs' ? songsViewTracks.length : filteredDesktopTracks.length
  const visibleProgress = isScrubbing && scrubProgress !== null ? scrubProgress : player.progress

  useEffect(() => {
    const id = currentTrack?.id
    if (!id) return
    if (lastPlayedIdRef.current === id) return
    lastPlayedIdRef.current = id
    const dbTrack = allTracksNormalized.find((t) => t.id === id)
    if (dbTrack && (dbTrack as any)._id) {
      recordPlay({ id: (dbTrack as any)._id })
    }
  }, [currentTrack?.id, allTracksNormalized, recordPlay])

  const handleLikeTrack = async (trackId: string) => {
    const dbTrack = allTracksNormalized.find((t) => t.id === trackId)
    if (!dbTrack || !(dbTrack as any)._id) return
    const convexId = (dbTrack as any)._id as Id<'music'>
    if (likingTrackIds.has(trackId)) return
    setLikingTrackIds((prev) => new Set(prev).add(trackId))
    try {
      if (likedTrackIds.has(trackId)) {
        await unlikeTrackMutation({ id: convexId })
        setLikedTrackIds((prev) => {
          const copy = new Set(prev)
          copy.delete(trackId)
          persistLikedTracks(copy)
          return copy
        })
      } else {
        await likeTrackMutation({ id: convexId })
        setLikedTrackIds((prev) => {
          const copy = new Set(prev)
          copy.add(trackId)
          persistLikedTracks(copy)
          return copy
        })
      }
    } finally {
      setLikingTrackIds((prev) => {
        const copy = new Set(prev)
        copy.delete(trackId)
        return copy
      })
    }
  }

  const mobileSquares = (() => {
    if (mobileFilter === 'artists') {
      const map = new Map<string, Track>()
      const trackIdsByArtist = new Map<string, string[]>()
      allTracksNormalized.forEach((t) => {
        const key = t.artist?.trim() || 'Unknown Artist'
        if (!map.has(key)) map.set(key, t)
        const ids = trackIdsByArtist.get(key) ?? []
        ids.push(t.id)
        trackIdsByArtist.set(key, ids)
      })
      return Array.from(map.entries()).map(([artist, t]) => ({
        key: `artist-${artist}`,
        title: artist,
        subtitle: 'Artist',
        coverUrl: t.coverUrl ?? undefined,
        trackId: t.id,
        trackIds: trackIdsByArtist.get(artist) ?? [],
      }))
    }
    if (mobileFilter === 'playlists') {
      return playlists.map((pl) => {
        const playlistTrackIds = pl.trackIds.map(String)
        const first = allTracksNormalized.find((t) => playlistTrackIds.includes(String(t.id)))
        return {
          key: `playlist-${String(pl._id)}`,
          title: pl.name,
          subtitle: `${pl.trackIds.length} songs`,
          coverUrl: first?.coverUrl ?? undefined,
          trackId: first?.id,
          trackIds: playlistTrackIds,
        }
      })
    }
    return allTracksNormalized.map((t) => ({
      key: t.id,
      title: t.title,
      subtitle: t.artist,
      coverUrl: t.coverUrl ?? undefined,
      trackId: t.id,
    }))
  })()

  if (isCompactLayout) {
    const tabs: { id: typeof mobileFilter; label: string; icon: JSX.Element }[] = [
      { id: 'playlists', label: 'Playlists', icon: <FiList size={12} /> },
      { id: 'artists', label: 'Artists', icon: <FiUser size={12} /> },
      { id: 'songs', label: 'Songs', icon: <FiMusic size={12} /> },
    ]

    const drilldownTracks = mobileDrilldown
      ? allTracksNormalized.filter((t) => mobileDrilldown.trackIds.includes(t.id))
      : []

    const visibleSquares = mobileDrilldown
      ? drilldownTracks.map((t) => ({
          key: t.id,
          title: t.title,
          subtitle: t.artist,
          coverUrl: t.coverUrl ?? undefined,
          trackId: t.id,
        }))
      : mobileSquares

    return (
      <div className="h-full bg-white dark:bg-[#09090a] text-gray-900 dark:text-white flex flex-col">
        <div className="px-5 pt-4 pb-2">
          {mobileDrilldown ? (
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[30px] font-bold tracking-tight text-gray-900 dark:text-white truncate">
                {mobileDrilldown.title}
              </h2>
              <button
                onClick={() => setMobileDrilldown(null)}
                className="text-[13px] text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white transition-colors flex-shrink-0"
              >
                Back
              </button>
            </div>
          ) : (
            <h2 className="text-[36px] font-bold tracking-tight text-gray-900 dark:text-white">Library</h2>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-28">
          {!mobileDrilldown && (
            <div className="border-t border-b border-gray-200 dark:border-white/10">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLinkedTrackId(null)
                    setMobileFilter(item.id)
                    setMobileDrilldown(null)
                  }}
                  className={`w-full flex items-center justify-between px-2 py-3 text-left transition-colors border-b border-gray-200 dark:border-white/10 last:border-b-0 ${
                    mobileFilter === item.id ? 'text-[#ff2d55]' : 'text-gray-900 dark:text-white/95'
                  }`}
                >
                  <span className="w-6 flex items-center justify-center text-[16px] leading-none">{item.icon}</span>
                  <span className={`ml-1.5 flex-1 text-[18px] leading-tight ${mobileFilter === item.id ? 'text-[#ff2d55]' : 'text-gray-900 dark:text-white'}`}>{item.label}</span>
                  <FiChevronRight size={16} className="opacity-60 text-gray-500 dark:text-white/60" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            {visibleSquares.map((sq) => (
              <button
                key={sq.key}
                onClick={() => {
                  const isDrillTrigger = !mobileDrilldown && (mobileFilter === 'artists' || mobileFilter === 'playlists')
                  if (isDrillTrigger) {
                    setLinkedTrackId(null)
                    setMobileDrilldown({
                      title: sq.title,
                      trackIds: (sq as { trackIds?: string[] }).trackIds ?? [],
                    })
                    return
                  }
                  if (!sq.trackId) return
                  playTrackById(sq.trackId)
                }}
                className={`text-left rounded-2xl transition-all ${
                  sq.trackId === linkedTrackId
                    ? 'ring-2 ring-[#ff2d55] ring-offset-2 ring-offset-white dark:ring-offset-[#09090a]'
                    : ''
                }`}
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#141416] border border-gray-200 dark:border-white/10">
                  {sq.coverUrl ? (
                    <img src={sq.coverUrl} alt="" className="w-full h-full object-cover" draggable={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-white/70 text-xl">♫</div>
                  )}
                </div>
                <div className="px-0.5 py-2">
                  <div className="text-[16px] text-gray-900 dark:text-white leading-tight truncate">{sq.title}</div>
                  <div className="text-[14px] text-gray-500 dark:text-white/60 truncate">{sq.subtitle}</div>
              {sq.trackId === linkedTrackId && (
                <div className="mt-1 text-[11px] font-medium text-[#ff2d55]">Shared song</div>
              )}
                </div>
              </button>
            ))}
            {visibleSquares.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 dark:text-white/60 text-sm py-6">No music for this category yet.</div>
            )}
          </div>
        </div>

        <div
          className="fixed left-1/2 -translate-x-1/2 w-[min(94vw,460px)] px-2 z-40"
          style={{ bottom: 'max(22px, calc(env(safe-area-inset-bottom) + 8px))' }}
        >
          <div className="rounded-2xl bg-white/95 dark:bg-[#1b1c20] border border-gray-200 dark:border-white/10 px-3 py-2.5 flex items-center gap-2 shadow-md dark:shadow-none">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/5 dark:bg-white/10 flex-shrink-0">
              {currentTrack?.coverUrl ? (
                <img src={currentTrack.coverUrl} alt="" className="w-full h-full object-cover" draggable={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-white/75">♫</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] text-gray-900 dark:text-white font-medium truncate">{currentTrack?.title ?? 'Select a track'}</div>
              <div className="text-[13px] text-gray-500 dark:text-white/70 truncate">{currentTrack?.artist ?? '—'}</div>
            </div>
            {currentTrack && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => copyLinkForTrack(currentTrack.id)}
                className="px-2 py-1 rounded-full text-[10px] font-medium bg-black/5 dark:bg-white/10 text-gray-600 dark:text-white/75 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                title={`Copy link to ${currentTrack.title}`}
              >
                {copiedTrackId === currentTrack.id ? 'Copied' : 'Copy'}
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => currentTrack && handleLikeTrack(currentTrack.id)}
              className="p-1.5 text-gray-900 dark:text-white/90"
            >
              {currentTrack && likedTrackIds.has(currentTrack.id) ? (
                <HiHeart size={18} className="text-red-400" />
              ) : (
                <FiHeart size={18} className="text-red-400" />
              )}
            </motion.button>
            <button onClick={player.togglePlayPause} className="p-1.5 text-gray-900 dark:text-white/95">
              {player.isPlaying ? <HiPause size={23} /> : <HiPlay size={23} />}
            </button>
            <button onClick={player.next} className="p-1.5 text-gray-900 dark:text-white/95">
              <HiForward size={23} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-[#f3f4f7] dark:bg-[#1a1a1d] text-gray-900 dark:text-white">
      {/* Left sidebar */}
      <aside className="w-48 flex-shrink-0 border-r border-gray-200 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(238,239,243,0.95))] dark:bg-[linear-gradient(180deg,rgba(70,70,75,0.34),rgba(38,39,43,0.75))] backdrop-blur-xl">
        <div className="px-3 pt-3">
          <div className="h-8 rounded-md bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 px-2 flex items-center">
            <input
              value={desktopSearch}
              onChange={(e) => setDesktopSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent w-full text-xs outline-none text-gray-700 dark:text-white/85 placeholder:text-gray-400 dark:placeholder:text-white/35"
            />
          </div>
        </div>

        <div className="px-3 mt-3 mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/35">itwela music</div>

        <div className="px-3 mt-4 mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/35">Library</div>
        <button
          onClick={() => {
            setLinkedTrackId(null)
            setDesktopSection('recent')
            setSelectedArtist(null)
            setSelectedPlaylistId(null)
          }}
          className={`w-[calc(100%-8px)] mx-1 px-3 py-1.5 text-xs rounded-md text-left transition-colors ${
            desktopSection === 'recent' && selectedPlaylistId === null
              ? 'bg-black/10 dark:bg-white/18 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-white/70 hover:bg-black/6 dark:hover:bg-white/10'
          }`}
        >
          Recently Added
        </button>
        <button
          onClick={() => {
            setLinkedTrackId(null)
            setDesktopSection('artists')
            setSelectedArtist(null)
          }}
          className={`w-[calc(100%-8px)] mx-1 mt-0.5 px-3 py-1.5 text-xs rounded-md text-left transition-colors ${
            desktopSection === 'artists'
              ? 'bg-black/10 dark:bg-white/18 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-white/65 hover:bg-black/6 dark:hover:bg-white/10'
          }`}
        >
          Artists
        </button>
        <button
          onClick={() => {
            setLinkedTrackId(null)
            setDesktopSection('songs')
            setSelectedArtist(null)
          }}
          className={`w-[calc(100%-8px)] mx-1 mt-0.5 px-3 py-1.5 text-xs rounded-md text-left transition-colors ${
            desktopSection === 'songs'
              ? 'bg-black/10 dark:bg-white/18 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-white/65 hover:bg-black/6 dark:hover:bg-white/10'
          }`}
        >
          Songs
        </button>

        <div className="px-3 mt-4 mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/35">Playlists</div>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <button
              key={playlist._id}
              onClick={() => {
                setLinkedTrackId(null)
                setDesktopSection('recent')
                setSelectedArtist(null)
                setSelectedPlaylistId(playlist._id)
              }}
              className={`w-[calc(100%-8px)] mx-1 mt-0.5 px-3 py-1.5 text-xs rounded-md text-left transition-colors ${
                desktopSection === 'recent' && selectedPlaylistId === playlist._id
                  ? 'bg-black/10 dark:bg-white/18 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-white/70 hover:bg-black/6 dark:hover:bg-white/10'
              }`}
            >
              {playlist.name}
            </button>
          ))
        ) : (
          <p className="px-3 text-[10px] text-gray-500 dark:text-white/45">No playlists yet</p>
        )}
      </aside>

      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Transport / title bar */}
        <div className="h-12 border-b border-gray-200 dark:border-white/10 bg-[#eceef3] dark:bg-[#202124] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
            <button onClick={player.prev} className="hover:text-gray-900 dark:hover:text-white transition-colors"><HiBackward size={17} /></button>
            <button onClick={player.togglePlayPause} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {player.isPlaying ? <HiPause size={18} /> : <HiPlay size={18} />}
            </button>
            <button onClick={handleNext} className="hover:text-gray-900 dark:hover:text-white transition-colors"><HiForward size={17} /></button>
            <button onClick={() => setShuffle(!shuffle)} className={shuffle ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'}>
              <FiShuffle size={13} />
            </button>
          </div>

          <div className="min-w-0 max-w-[58%] flex items-center gap-2 px-2 py-1 rounded-md bg-black/5 dark:bg-white/6 border border-black/10 dark:border-white/10">
            <div className="w-5 h-5 rounded overflow-hidden bg-black/10 dark:bg-white/10 flex-shrink-0">
              {featuredTrack?.coverUrl ? (
                <img src={featuredTrack.coverUrl} alt="" className="w-full h-full object-cover" draggable={false} />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 truncate text-[12px] text-gray-700 dark:text-white/85">
              {featuredTrack ? `${featuredTrack.title} · ${featuredTrack.artist}` : 'Select a track'}
            </div>
            {featuredTrack && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => copyLinkForTrack(featuredTrack.id)}
                className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white/85 bg-black/5 dark:bg-white/8"
                title={`Copy link to ${featuredTrack.title}`}
              >
                {copiedTrackId === featuredTrack.id ? 'Copied' : 'Copy song'}
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2 w-36">
            <button
              onClick={player.toggleMute}
              className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {player.isMuted ? <HiVolumeOff size={14} /> : <HiVolumeUp size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={player.isMuted ? 0 : player.volume}
              onChange={(e) => { player.setVolume(Number(e.target.value)); if (player.isMuted) player.toggleMute() }}
              className="w-full h-1 accent-gray-800 dark:accent-white"
            />
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 dark:text-white/45 w-8 text-right">{formatTime(currentSeconds)}</span>
            <div
              onClick={handleSeek}
              onPointerDown={handleProgressPointerDown}
              className="flex-1 relative h-1 bg-black/15 dark:bg-white/15 rounded-full cursor-pointer"
            >
              <div
                className="absolute left-0 top-0 h-full bg-red-400 rounded-full transition-all"
                style={{ width: `${visibleProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 dark:text-white/45 w-8">
              {totalSeconds > 0 ? formatTime(totalSeconds) : ''}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white/95 truncate">{desktopSectionTitle}</h2>
            <span className="text-xs text-gray-500 dark:text-white/50 whitespace-nowrap">
              {visibleTrackCount} {visibleTrackCount === 1 ? 'track' : 'tracks'}
            </span>
          </div>

          {linkedTrackId && desktopSection === 'songs' && (
            <div className="mb-3 rounded-xl border border-[#ff2d55]/25 bg-[#ff2d55]/8 px-3 py-2 text-[12px] text-[#b01238] dark:text-[#ff7a97]">
              Opened from a shared song link. Press the highlighted track to play it.
            </div>
          )}

          {loadingTracks ? (
            <div className="text-gray-500 dark:text-white/50 text-sm py-8">Loading tracks…</div>
          ) : filteredDesktopTracks.length === 0 ? (
            <div className="text-gray-500 dark:text-white/50 text-sm py-8">
              {desktopSearch.trim() ? 'No matches for your search.' : 'No tracks yet. Add tracks in the content manager.'}
            </div>
          ) : (
            <>
              {desktopSection === 'recent' && (
                <>
                  <div className="mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {todayTracks.map((track) => {
                        const idx = allTracksNormalized.findIndex((t) => t.id === track.id)
                        return (
                          <button
                            key={track.id}
                            onClick={() => playTrackById(track.id)}
                            className="text-left group"
                          >
                            <div className="aspect-square rounded-md bg-black/8 dark:bg-white/10 border border-black/10 dark:border-white/10 overflow-hidden">
                              {track.coverUrl ? (
                                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" draggable={false} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-white/45 text-4xl">♫</div>
                              )}
                            </div>
                            <div className="mt-1.5 flex items-center justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] text-gray-800 dark:text-white/90 truncate">
                                  {track.title}
                                  {isPlayingTrack(track.id) ? '  ♪' : ''}
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-white/50 truncate">{track.artist}</div>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLikeTrack(track.id)
                                }}
                                className="ml-1 text-[11px] text-gray-500 dark:text-white/60 flex items-center gap-0.5"
                              >
                                <motion.span
                                  animate={likingTrackIds.has(track.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                                  transition={{ duration: 0.25 }}
                                  className="flex items-center justify-center"
                                >
                                  {isPlayingTrack(track.id) ? (
                                    likedTrackIds.has(track.id) ? (
                                      <HiHeart className="text-white" size={11} />
                                    ) : (
                                      <FiHeart className="text-white" size={11} />
                                    )
                                  ) : likedTrackIds.has(track.id) ? (
                                    <HiHeart className="text-red-400" size={11} />
                                  ) : (
                                    <FiHeart className="text-red-400" size={11} />
                                  )}
                                </motion.span>
                              </motion.button>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {yesterdayTracks.length > 0 && (
                    <div>
                      <div className="space-y-1.5">
                        {yesterdayTracks.map((track) => {
                          const idx = allTracksNormalized.findIndex((t) => t.id === track.id)
                          return (
                            <button
                              key={track.id}
                              onClick={() => idx >= 0 && player.playByIndex(idx)}
                              className={`w-full text-left flex items-center gap-3 rounded-md px-2.5 py-2 border transition-colors ${
                                isPlayingTrack(track.id)
                                  ? 'bg-[#ff2d55] border-[#ff2d55] text-white'
                                  : 'bg-black/[0.03] dark:bg-white/[0.03] border-black/10 dark:border-white/10 hover:bg-black/[0.07] dark:hover:bg-white/[0.08]'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-black/8 dark:bg-white/10 flex-shrink-0">
                                {track.coverUrl ? (
                                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" draggable={false} />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-white/45">♫</div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="min-w-0">
                                    <div className={`text-[13px] truncate ${isPlayingTrack(track.id) ? 'text-white' : 'text-gray-800 dark:text-white/90'}`}>{track.title}</div>
                                    <div className={`text-[11px] truncate ${isPlayingTrack(track.id) ? 'text-white/85' : 'text-gray-500 dark:text-white/50'}`}>{track.artist}</div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <motion.button
                                      whileTap={{ scale: 0.8 }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleLikeTrack(track.id)
                                      }}
                                      className="ml-1 text-[11px] text-gray-500 dark:text-white/60 flex items-center gap-0.5"
                                    >
                                      <motion.span
                                        animate={likingTrackIds.has(track.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center justify-center"
                                      >
                                        {isPlayingTrack(track.id) ? (
                                          likedTrackIds.has(track.id) ? (
                                            <HiHeart className="text-white" size={11} />
                                          ) : (
                                            <FiHeart className="text-white" size={11} />
                                          )
                                        ) : likedTrackIds.has(track.id) ? (
                                          <HiHeart className="text-red-400" size={11} />
                                        ) : (
                                          <FiHeart className="text-red-400" size={11} />
                                        )}
                                      </motion.span>
                                    </motion.button>
                                    <motion.button
                                      whileTap={{ scale: 0.8 }}
                                      onClick={(e) => { e.stopPropagation(); copyLinkForTrack(track.id) }}
                                      className={`text-[10px] px-1.5 py-0.5 rounded ${isPlayingTrack(track.id) ? 'text-white/80 hover:text-white' : 'text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70'}`}
                                      title="Copy link"
                                    >
                                      {copiedTrackId === track.id ? '✓' : '⎘'}
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                              <div className={`text-[11px] ${isPlayingTrack(track.id) ? 'text-white/85' : 'text-gray-500 dark:text-white/45'}`}>
                                {track.duration ? formatTime(track.duration) : '--:--'}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {desktopSection === 'artists' && (
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <button
                      key={artist.name}
                      onClick={() => {
                        setLinkedTrackId(null)
                        setSelectedArtist(artist.name)
                        setDesktopSection('songs')
                      }}
                      className="w-full text-left flex items-center gap-3 rounded-md px-2.5 py-2 border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.07] dark:hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-black/8 dark:bg-white/10 flex-shrink-0">
                        {artist.coverUrl ? (
                          <img src={artist.coverUrl} alt={artist.name} className="w-full h-full object-cover" draggable={false} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-white/55">♫</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-gray-900 dark:text-white truncate">{artist.name}</div>
                        <div className="text-[11px] text-gray-500 dark:text-white/50">{artist.count} song{artist.count === 1 ? '' : 's'}</div>
                      </div>
                      <FiChevronRight size={14} className="text-gray-400 dark:text-white/35" />
                    </button>
                  ))}
                </div>
              )}

              {desktopSection === 'songs' && (
                <div className="space-y-1.5">
                  {songsViewTracks.map((track) => {
                    const isLinkedTrack = linkedTrackId === track.id
                    return (
                      <button
                        key={track.id}
                        onClick={() => playTrackById(track.id)}
                        className={`w-full text-left flex items-center gap-3 rounded-md px-2.5 py-2 border transition-colors ${
                          isPlayingTrack(track.id)
                            ? 'bg-[#ff2d55] border-[#ff2d55] text-white'
                            : isLinkedTrack
                            ? 'bg-[#ff2d55]/8 dark:bg-[#ff2d55]/14 border-[#ff2d55]/40 text-gray-900 dark:text-white shadow-[0_0_0_1px_rgba(255,45,85,0.12)]'
                            : 'bg-black/[0.03] dark:bg-white/[0.03] border-black/10 dark:border-white/10 hover:bg-black/[0.07] dark:hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-black/8 dark:bg-white/10 flex-shrink-0">
                          {track.coverUrl ? (
                            <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" draggable={false} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-white/45">♫</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[13px] truncate ${isPlayingTrack(track.id) ? 'text-white' : 'text-gray-800 dark:text-white/90'}`}>{track.title}</div>
                          <div className={`text-[11px] truncate ${isPlayingTrack(track.id) ? 'text-white/85' : 'text-gray-500 dark:text-white/50'}`}>
                            {track.artist}
                            {isLinkedTrack ? '  ·  Shared song' : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`text-[11px] ${isPlayingTrack(track.id) ? 'text-white/85' : 'text-gray-500 dark:text-white/45'}`}>
                            {track.duration ? formatTime(track.duration) : '--:--'}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => { e.stopPropagation(); copyLinkForTrack(track.id) }}
                            className={`text-[10px] px-1.5 py-0.5 rounded ${isPlayingTrack(track.id) ? 'text-white/80 hover:text-white' : 'text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70'}`}
                            title="Copy link"
                          >
                            {copiedTrackId === track.id ? '✓' : '⎘'}
                          </motion.button>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {player.error && <div className="mt-4 text-xs text-red-600 dark:text-red-300">{player.error}</div>}
        </div>
      </div>
    </div>
  )
}
