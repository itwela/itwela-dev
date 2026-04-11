'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FiChevronLeft, FiChevronRight, FiSearch, FiHeart } from 'react-icons/fi'
import { HiHeart } from 'react-icons/hi'
import { motion } from 'framer-motion'

type Category = 'software' | 'art' | 'memories'

const CATEGORY_COLORS: Record<Category, string> = {
  software: 'from-blue-500/30 to-purple-500/30',
  art: 'from-pink-500/30 to-orange-500/30',
  memories: 'from-green-500/30 to-teal-500/30',
}

const CATEGORY_EMOJIS: Record<Category, string> = {
  software: '💻',
  art: '🎨',
  memories: '📸',
}

type Photo = { id: string; title: string; imageUrl: string; category: string; likeCount?: number; viewCount?: number }

function PhotoGrid({ photos, onSelect }: { photos: Photo[]; onSelect: (index: number) => void }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
      {photos.map((photo, i) => (
        <button
          key={photo.id}
          className="relative cursor-pointer group overflow-hidden rounded-md border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] transition-transform hover:scale-[1.01]"
          onClick={() => onSelect(i)}
        >
          {photo.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover aspect-[4/5]"
            />
          ) : (
            <div
              className={`w-full h-full min-h-[150px] bg-gradient-to-br ${CATEGORY_COLORS[photo.category as Category]} flex items-center justify-center`}
              style={{ background: `linear-gradient(135deg, hsl(${(i * 37 + 200) % 360}, 50%, 25%), hsl(${(i * 37 + 240) % 360}, 50%, 20%))` }}
            >
              <span className="text-3xl">{CATEGORY_EMOJIS[photo.category as Category]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </button>
      ))}
    </div>
  )
}

export function PhotosApp({ initialPhotoId }: { initialPhotoId?: string } = {}) {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const [mobileView, setMobileView] = useState<'home' | 'library'>('home')
  const [mobileSearch, setMobileSearch] = useState('')
  const [mobileSelectedIndex, setMobileSelectedIndex] = useState<number | null>(null)
  const [mobileLibraryFilter, setMobileLibraryFilter] = useState<'years' | 'months' | 'all'>('all')
  const [copiedPhotoId, setCopiedPhotoId] = useState<string | null>(null)
  const hasInitialPhotoRef = useRef(false)

  const dbPhotos = useQuery(api.photos.getAll) as Photo[] | undefined
  const likePhotoMutation = useMutation(api.photos.likePhoto)
  const unlikePhotoMutation = useMutation(api.photos.unlikePhoto)
  const viewPhotoMutation = useMutation(api.photos.viewPhoto)
  const allPhotos: Photo[] = dbPhotos ?? []
  const [likingPhotoIds, setLikingPhotoIds] = useState<Set<string>>(new Set())
  const viewedPhotoIdsRef = useRef<Set<string>>(new Set())
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('itwela.likes.photos')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setLikedPhotoIds(new Set(parsed.map(String)))
    } catch {
      // ignore bad localStorage data
    }
  }, [])

  const persistLikedPhotos = (set: Set<string>) => {
    try {
      window.localStorage.setItem('itwela.likes.photos', JSON.stringify(Array.from(set)))
    } catch {
      // ignore quota/privacy mode
    }
  }

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Auto-select the initial photo from URL on first load
  useEffect(() => {
    if (!initialPhotoId || hasInitialPhotoRef.current) return
    if (allPhotos.length === 0) return
    const idx = allPhotos.findIndex((p) => p.id === initialPhotoId)
    if (idx >= 0) {
      setSelectedIndex(idx)
      hasInitialPhotoRef.current = true
    }
  }, [initialPhotoId, allPhotos])

  const copyLinkForPhoto = useCallback(async (photoId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itwela.dev'
    const url = `${origin}/?app=photos&photo=${encodeURIComponent(photoId)}`
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
      setCopiedPhotoId(photoId)
      setTimeout(() => setCopiedPhotoId((prev) => (prev === photoId ? null : prev)), 1800)
    } catch {
      // ignore copy errors
    }
  }, [])

  const displayed = activeCategory === 'all' ? allPhotos : allPhotos.filter((p) => p.category === activeCategory)
  const query = search.trim().toLowerCase()
  const filteredDisplayed = query
    ? displayed.filter((p) => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    : displayed
  const selectedPhoto = selectedIndex !== null ? filteredDisplayed[selectedIndex] : null
  const categoryTitle = activeCategory === 'all' ? 'All Photos' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)

  const mobileQuery = mobileSearch.trim().toLowerCase()
  const mobilePhotos = mobileQuery
    ? allPhotos.filter((p) => p.title.toLowerCase().includes(mobileQuery) || p.category.toLowerCase().includes(mobileQuery))
    : allPhotos
  const mobileSelectedPhoto = mobileSelectedIndex !== null ? mobilePhotos[mobileSelectedIndex] ?? null : null
  const albumCards = (['software', 'art', 'memories'] as const).map((cat) => ({
    id: cat,
    title: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: allPhotos.filter((p) => p.category === cat).length,
    cover: allPhotos.find((p) => p.category === cat)?.imageUrl || '',
  }))

  useEffect(() => {
    if (!selectedPhoto) return
    const set = viewedPhotoIdsRef.current
    if (set.has(selectedPhoto.id)) return
    set.add(selectedPhoto.id)
    viewPhotoMutation({ id: selectedPhoto.id as any })
  }, [selectedPhoto, viewPhotoMutation])

  useEffect(() => {
    if (!mobileSelectedPhoto) return
    const set = viewedPhotoIdsRef.current
    if (set.has(mobileSelectedPhoto.id)) return
    set.add(mobileSelectedPhoto.id)
    viewPhotoMutation({ id: mobileSelectedPhoto.id as any })
  }, [mobileSelectedPhoto, viewPhotoMutation])

  const handleLikePhoto = async (id: string) => {
    if (likingPhotoIds.has(id)) return
    setLikingPhotoIds((prev) => new Set(prev).add(id))
    try {
      if (likedPhotoIds.has(id)) {
        await unlikePhotoMutation({ id: id as any })
        setLikedPhotoIds((prev) => {
          const copy = new Set(prev)
          copy.delete(id)
          persistLikedPhotos(copy)
          return copy
        })
      } else {
        await likePhotoMutation({ id: id as any })
        setLikedPhotoIds((prev) => {
          const copy = new Set(prev)
          copy.add(id)
          persistLikedPhotos(copy)
          return copy
        })
      }
    } finally {
      setLikingPhotoIds((prev) => {
        const copy = new Set(prev)
        copy.delete(id)
        return copy
      })
    }
  }

  if (isCompactLayout) {
    return (
      <div className="h-full overflow-y-auto bg-[#f2f3f7] dark:bg-[#0e1014] text-gray-900 dark:text-white pb-24">
        <div className="sticky top-0 z-20 px-4 pt-3 pb-2 bg-[#f2f3f7]/95 dark:bg-[#0e1014]/95 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h1 className="text-[42px] leading-none font-semibold tracking-tight">
              {mobileView === 'library' ? 'Library' : 'Photos'}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileView((v) => (v === 'home' ? 'library' : 'home'))}
                className="text-[13px] px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10"
              >
                {mobileView === 'home' ? 'Library' : 'Home'}
              </button>
              <button className="w-9 h-9 rounded-full bg-black/6 dark:bg-white/10 text-gray-700 dark:text-white/85 border border-black/10 dark:border-white/10 flex items-center justify-center">
                <FiSearch size={15} />
              </button>
            </div>
          </div>
          <div className="mt-2 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10">
            <input
              value={mobileSearch}
              onChange={(e) => {
                setMobileSearch(e.target.value)
                setMobileSelectedIndex(null)
              }}
              placeholder="Search"
              className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white/85 placeholder:text-gray-500 dark:placeholder:text-white/45"
            />
          </div>
        </div>

        {mobileSelectedPhoto ? (
          <div className="px-4 pb-6">
            <div className="flex items-center justify-between mt-3 mb-2 text-sm text-gray-600 dark:text-white/65">
              <button
                onClick={() => setMobileSelectedIndex(null)}
                className="inline-flex items-center gap-1"
              >
                <FiChevronLeft size={14} /> Back
              </button>
              <span>{(mobileSelectedIndex ?? 0) + 1} of {mobilePhotos.length}</span>
            </div>
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#171a20] border border-black/10 dark:border-white/10 min-h-[52vh] flex items-center justify-center">
              {mobileSelectedPhoto.imageUrl ? (
                <img src={mobileSelectedPhoto.imageUrl} alt={mobileSelectedPhoto.title} className="max-w-full max-h-[66vh] object-contain" />
              ) : (
                <div className="text-6xl">📸</div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-white/75 truncate">{mobileSelectedPhoto.title}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-600 dark:text-white/65">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleLikePhoto(mobileSelectedPhoto.id)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/5 dark:bg-white/10"
              >
                <motion.span
                  animate={likingPhotoIds.has(mobileSelectedPhoto.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-center"
                >
                  {likedPhotoIds.has(mobileSelectedPhoto.id) ? (
                    <HiHeart className="text-red-400" size={11} />
                  ) : (
                    <FiHeart className="text-red-400" size={11} />
                  )}
                </motion.span>
                <span>
                  {(allPhotos.find((p) => p.id === mobileSelectedPhoto.id)?.likeCount ?? 0) +
                    (likingPhotoIds.has(mobileSelectedPhoto.id) ? 1 : 0)}
                </span>
              </motion.button>
              <span>
                {(allPhotos.find((p) => p.id === mobileSelectedPhoto.id)?.viewCount ?? 0)} views
              </span>
            </div>
            <div className="mt-3 overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {mobilePhotos.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setMobileSelectedIndex(i)}
                    className={`w-14 h-14 rounded-md overflow-hidden border flex-shrink-0 ${
                      i === mobileSelectedIndex ? 'border-blue-500' : 'border-black/10 dark:border-white/10'
                    }`}
                  >
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black/10 dark:bg-white/10" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : mobileView === 'library' ? (
          <div className="px-2 pb-20">
            {mobilePhotos.length === 0 ? (
              <div className="py-16 text-center text-gray-500 dark:text-white/45">Photos coming soon</div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {mobilePhotos.map((photo, i) => (
                  <button key={photo.id} onClick={() => setMobileSelectedIndex(i)} className="rounded-sm overflow-hidden bg-black/10 dark:bg-white/10">
                    {photo.imageUrl ? (
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover aspect-square" />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center text-xl">📸</div>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30">
              <div className="rounded-full bg-white/95 dark:bg-[#24272d]/95 border border-black/10 dark:border-white/10 px-2 py-1.5 flex items-center gap-1 shadow-lg">
                {(['years', 'months', 'all'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setMobileLibraryFilter(item)}
                    className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                      mobileLibraryFilter === item
                        ? 'bg-black/85 dark:bg-white text-white dark:text-black'
                        : 'text-gray-700 dark:text-white/70'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 pt-3 pb-8 space-y-8">
            <section>
              <h2 className="text-[38px] leading-none font-semibold mb-3">Albums</h2>
              <div className="grid grid-cols-2 gap-3">
                {albumCards.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => {
                      setActiveCategory(album.id as Category)
                      setMobileView('library')
                      setMobileSelectedIndex(null)
                    }}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden text-left"
                  >
                    <div className="h-20 bg-black/8 dark:bg-white/10 flex items-center justify-center">
                      {album.cover ? (
                        <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{CATEGORY_EMOJIS[album.id as Category]}</span>
                      )}
                    </div>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{album.title}</div>
                      <div className="text-xs text-gray-500 dark:text-white/50">{album.count}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full text-gray-900 dark:text-white relative overflow-hidden">
      {/* Sidebar */}
      <div
        className="w-44 flex-shrink-0 py-3 finder-sidebar"
      >
        <div className="px-3 mb-2">
          <span className="text-gray-500 dark:text-white/30 text-[10px] font-semibold uppercase tracking-widest">Library</span>
        </div>
        {([
          { id: 'all', label: 'All Photos', emoji: '🖼️' },
          { id: 'software', label: 'Software', emoji: '💻' },
          { id: 'art', label: 'Art', emoji: '🎨' },
          { id: 'memories', label: 'Memories', emoji: '📸' },
        ] as const).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCategory(item.id)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors rounded-md mx-1 ${
              activeCategory === item.id
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={{ width: 'calc(100% - 8px)' }}
          >
            <span>{item.emoji}</span>
            {item.label}
            <span className="ml-auto text-gray-500 dark:text-white/30">
              {item.id === 'all' ? allPhotos.length : allPhotos.filter((p) => p.category === item.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden relative bg-[#f8f8fa] dark:bg-[#1d1e21]">
        <div className="h-10 px-4 flex items-center justify-between bg-white/80 dark:bg-[#232428] border-b border-gray-200 dark:border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 text-gray-600 dark:text-white/70">
            {selectedPhoto ? (
              <button
                onClick={() => setSelectedIndex(null)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <FiChevronLeft size={14} />
              </button>
            ) : (
              <>
                <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><FiChevronLeft size={14} /></button>
                <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><FiChevronRight size={14} /></button>
              </>
            )}
          </div>

          <div className="text-xs font-semibold text-gray-700 dark:text-white/80 truncate px-3">
            {selectedPhoto ? `${selectedIndex! + 1} of ${filteredDisplayed.length}` : categoryTitle}
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-white/65">
            <div className="ml-1 px-2 py-1 rounded-md bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 flex items-center gap-1.5">
              <FiSearch size={11} />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedIndex(null)
                }}
                placeholder="Search"
                className="w-28 bg-transparent outline-none text-[11px] text-gray-700 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/40"
              />
            </div>
          </div>
        </div>

        {selectedPhoto ? (
          <div className="h-[calc(100%-40px)] flex flex-col">
            <div className="px-6 pt-4 pb-2 text-center text-sm text-gray-600 dark:text-white/65">
              {selectedPhoto.title}
            </div>

            <div className="flex-1 min-h-0 px-6 pb-4 flex items-center justify-center">
              <div className="w-full h-full rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b1e] flex items-center justify-center overflow-hidden">
                {selectedPhoto.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800">
                    <span className="text-6xl">{CATEGORY_EMOJIS[selectedPhoto.category as Category]}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-20 border-t border-gray-200 dark:border-white/10 bg-white/75 dark:bg-[#222328] px-4 overflow-x-auto">
              <div className="h-full flex items-center gap-2">
                {filteredDisplayed.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedIndex(i)}
                    className={`w-14 h-14 rounded-md overflow-hidden border flex-shrink-0 ${
                      i === selectedIndex ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    {photo.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-black/10 dark:bg-white/10" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between px-1 py-1.5 text-[11px] text-gray-600 dark:text-white/60">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => selectedPhoto && handleLikePhoto(selectedPhoto.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/5 dark:bg:white/10"
                  >
                    <motion.span
                      animate={selectedPhoto && likingPhotoIds.has(selectedPhoto.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center justify-center"
                    >
                      {selectedPhoto && likedPhotoIds.has(selectedPhoto.id) ? (
                        <HiHeart className="text-red-400" size={11} />
                      ) : (
                        <FiHeart className="text-red-400" size={11} />
                      )}
                    </motion.span>
                    <span>
                      {selectedPhoto
                        ? (allPhotos.find((p) => p.id === selectedPhoto.id)?.likeCount ?? 0) +
                          (likingPhotoIds.has(selectedPhoto.id) ? 1 : 0)
                        : 0}
                    </span>
                  </motion.button>
                  <span>
                    {selectedPhoto ? allPhotos.find((p) => p.id === selectedPhoto.id)?.viewCount ?? 0 : 0} views
                  </span>
                </div>
                {selectedPhoto && (
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => copyLinkForPhoto(selectedPhoto.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                    title="Copy link to this photo"
                  >
                    <span>{copiedPhotoId === selectedPhoto.id ? '✓ Copied' : '⎘ Copy Link'}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100%-40px)] overflow-y-auto">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-white/30">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-sm">Photos Coming Soon</span>
                <span className="text-xs mt-1">My gallery will show up here once uploaded.</span>
              </div>
            ) : (
              <>
                {activeCategory !== 'all' && (
                  <div className="px-4 pt-4 pb-1">
                    <div className="text-[34px] font-semibold leading-none text-gray-900 dark:text-white">
                      {categoryTitle.toUpperCase()}
                    </div>
                    <div className="text-sm mt-1 text-gray-500 dark:text-white/50">
                      {filteredDisplayed.length} Photos
                    </div>
                  </div>
                )}
                {filteredDisplayed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-white/30">
                    <span className="text-4xl mb-2">🔎</span>
                    <span className="text-sm">No matching photos</span>
                    <span className="text-xs mt-1">Try a different search term</span>
                  </div>
                ) : (
                  <PhotoGrid photos={filteredDisplayed} onSelect={(i) => setSelectedIndex(i)} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
