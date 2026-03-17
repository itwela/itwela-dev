'use client'

import { useEffect, useRef, useState, useRef as useReactRef } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiSearch, FiHeart } from 'react-icons/fi'
import { HiHeart } from 'react-icons/hi'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

type Post = {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  body: string
  emoji: string
  imageUrl?: string
  gallery?: string[]
  slug: string
}

type BlogPostDoc = {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: string
  categoryName?: string
  emoji?: string
  imageUrl?: string
  publishedAt?: number
  likeCount?: number
  viewCount?: number
  gallery?: string[]
}

function estimateReadTime(post: Post) {
  // Estimate reading time from actual content instead of hardcoded values.
  const clean = `${post.title} ${post.excerpt} ${post.body}`
    .replace(/\*\*/g, ' ')
    .replace(/[^\w\s'-]/g, ' ')
    .trim()
  const words = clean.length ? clean.split(/\s+/).length : 0
  const wpm = 220
  const minutes = Math.max(1, Math.ceil(words / wpm))
  return `${minutes} min read`
}

export function BlogApp({ initialSlug }: { initialSlug?: string } = {}) {
  const blogRowsQuery = useQuery((api as any).blog.getPostsWithCategories) as BlogPostDoc[] | undefined
  const isLoading = blogRowsQuery === undefined
  const blogRows = (blogRowsQuery ?? []) as BlogPostDoc[]
  const likePostMutation = useMutation((api as any).blog.likePost)
  const unlikePostMutation = useMutation((api as any).blog.unlikePost)
  const viewPostMutation = useMutation((api as any).blog.viewPost)
  const POSTS: Post[] = blogRows.map((row) => ({
    id: row._id,
    title: row.title,
    date: new Date(row.publishedAt ?? Date.now()).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    category: row.categoryName ?? 'Uncategorized',
    excerpt: row.excerpt,
    body: row.body,
    emoji: row.emoji?.trim() || '📰',
    imageUrl: row.imageUrl?.trim() || undefined,
    gallery: row.gallery ?? [],
    slug: row.slug,
  }))

  const [selected, setSelected] = useState<Post | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [desktopFeed, setDesktopFeed] = useState<'recent' | 'all'>('recent')
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const [mobileReadProgress, setMobileReadProgress] = useState(0)
  const mobileReaderRef = useRef<HTMLDivElement>(null)
  const desktopReaderRef = useRef<HTMLDivElement>(null)
  const viewedPostIdsRef = useReactRef<Set<string>>(new Set())
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set())
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())
  const [imageLoadedIds, setImageLoadedIds] = useState<Set<string>>(new Set())
  const hasAppliedInitialSlugRef = useRef(false)
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('itwela.likes.blogPosts')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setLikedPostIds(new Set(parsed.map(String)))
    } catch {
      // ignore bad localStorage data
    }
  }, [])

  const persistLikedPosts = (set: Set<string>) => {
    try {
      window.localStorage.setItem('itwela.likes.blogPosts', JSON.stringify(Array.from(set)))
    } catch {
      // ignore quota/privacy mode
    }
  }

  const categories = ['All', ...Array.from(new Set(POSTS.map((p) => p.category)))]
  const filtered = activeCategory === 'All' ? POSTS : POSTS.filter((p) => p.category === activeCategory)
  const heroPost = filtered[0] ?? null
  const trendingPosts = filtered.slice(1, 5)
  const readerFavorites = filtered.slice(0, 6)

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // On first load, if we have an initial slug, auto-select that post.
  useEffect(() => {
    if (!initialSlug || hasAppliedInitialSlugRef.current) return
    if (!POSTS.length) return
    const match = POSTS.find((p) => p.slug === initialSlug)
    if (!match) {
      hasAppliedInitialSlugRef.current = true
      return
    }
    setActiveCategory(match.category)
    setSelected(match)
    hasAppliedInitialSlugRef.current = true
  }, [initialSlug, POSTS])

  // When opening a post, always start reading from the top (mobile + desktop)
  useEffect(() => {
    if (!selected) return
    if (isCompactLayout) {
      const el = mobileReaderRef.current
      if (el) el.scrollTop = 0
    } else {
      const el = desktopReaderRef.current
      if (el) el.scrollTop = 0
    }
  }, [selected, isCompactLayout])

  const copyLinkForPost = async (post: Post) => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://itwela.dev'
    const url = `${origin}/?blog=${encodeURIComponent(post.slug)}`
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback: use a temporary textarea
        const textarea = document.createElement('textarea')
        textarea.value = url
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedPostId(post.id)
      setTimeout(() => {
        setCopiedPostId((prev) => (prev === post.id ? null : prev))
      }, 1800)
    } catch {
      // ignore copy errors
    }
  }

  useEffect(() => {
    if (!selected) return
    const already = viewedPostIdsRef.current
    if (already.has(selected.id)) return
    already.add(selected.id)
    viewPostMutation({ id: selected.id })
  }, [selected, viewPostMutation])

  const handleLike = async (postId: string) => {
    if (likingIds.has(postId)) return
    const next = new Set(likingIds)
    next.add(postId)
    setLikingIds(next)
    try {
      if (likedPostIds.has(postId)) {
        await unlikePostMutation({ id: postId })
        setLikedPostIds((prev) => {
          const copy = new Set(prev)
          copy.delete(postId)
          persistLikedPosts(copy)
          return copy
        })
      } else {
        await likePostMutation({ id: postId })
        setLikedPostIds((prev) => {
          const copy = new Set(prev)
          copy.add(postId)
          persistLikedPosts(copy)
          return copy
        })
      }
    } finally {
      setLikingIds((prev) => {
        const copy = new Set(prev)
        copy.delete(postId)
        return copy
      })
    }
  }

  useEffect(() => {
    if (!isCompactLayout || !selected) {
      setMobileReadProgress(0)
      return
    }

    const el = mobileReaderRef.current
    if (!el) return

    const updateProgress = () => {
      const scrollable = el.scrollHeight - el.clientHeight
      if (scrollable <= 0) {
        setMobileReadProgress(0)
        return
      }
      setMobileReadProgress((el.scrollTop / scrollable) * 100)
    }

    updateProgress()
    el.addEventListener('scroll', updateProgress)
    const t1 = setTimeout(updateProgress, 120)
    const t2 = setTimeout(updateProgress, 420)

    return () => {
      el.removeEventListener('scroll', updateProgress)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isCompactLayout, selected])

  if (isCompactLayout) {
    if (isLoading) {
      return (
        <div className="h-full bg-white dark:bg-[#060607] text-gray-900 dark:text-white flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-gray-400/60 border-t-transparent animate-spin" />
            <p className="text-xs text-gray-500 dark:text-white/60">Loading blog…</p>
          </div>
        </div>
      )
    }

    if (selected) {
      return (
        <div className="h-full flex flex-col bg-white dark:bg-[#060607] text-gray-900 dark:text-white">
          <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={() => setSelected(null)}
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-800 dark:text-white/90"
              title="Back"
            >
              <FiArrowLeft size={14} />
            </button>
            <div className="text-[12px] uppercase tracking-wider text-[#ff2d55] font-semibold">
              {selected.category}
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent" />
          </div>

          <div className="h-[3px] w-full bg-black/10 dark:bg-white/10">
            <div
              className={`h-full transition-[width] duration-200 ${mobileReadProgress >= 99 ? 'bg-green-500/80' : 'bg-blue-500/75 dark:bg-blue-400/75'}`}
              style={{ width: `${mobileReadProgress}%` }}
            />
          </div>

          <div ref={mobileReaderRef} className="flex-1 overflow-y-auto px-4 pb-8">
            <div className="pt-4">
              <h1 className="text-[28px] md:text-[30px] leading-[1.08] font-semibold tracking-tight text-gray-900 dark:text-white">
                {selected.title}
              </h1>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[13px] text-gray-500 dark:text-white/60">
                  {selected.date} · {estimateReadTime(selected)}
                </div>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleLike(selected.id)}
                  className="inline-flex items-center gap-1 text-[13px] text-gray-500 dark:text-white/70"
                >
                  <motion.span
                    animate={likingIds.has(selected.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-center"
                  >
                    {likedPostIds.has(selected.id) ? (
                      <HiHeart className="text-[#ff2d55]" />
                    ) : (
                      <FiHeart className="text-[#ff2d55]" />
                    )}
                  </motion.span>
                  <span className="text-[11px]">
                    {(blogRows.find((r) => r._id === selected.id)?.likeCount ?? 0) + (likingIds.has(selected.id) ? 1 : 0)}
                  </span>
                </motion.button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl overflow-hidden bg-black/[0.04] dark:bg-white/5 border border-gray-200 dark:border-white/10 relative">
              {selected.imageUrl ? (
                <>
                  {!imageLoadedIds.has(selected.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400/50 border-t-transparent animate-spin" />
                    </div>
                  )}
                  <img
                    src={selected.imageUrl}
                    alt={selected.title}
                    className={`h-[210px] w-full object-cover transition-opacity duration-200 ${
                      imageLoadedIds.has(selected.id) ? 'opacity-100' : 'opacity-0'
                    }`}
                    draggable={false}
                    loading="lazy"
                    onLoad={() => {
                      setImageLoadedIds((prev) => {
                        const copy = new Set(prev)
                        copy.add(selected.id)
                        return copy
                      })
                    }}
                  />
                </>
              ) : (
                <div className="h-[210px] flex items-center justify-center text-7xl">
                  {selected.emoji}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-5 text-[20px] leading-[1.32] text-gray-800 dark:text-white/92 font-serif">
              {selected.body.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.endsWith('**')) {
                  return (
                    <h3 key={i} className="text-[20px] leading-tight font-semibold text-gray-900 dark:text-white mt-2">
                      {para.replace(/\*\*/g, '')}
                    </h3>
                  )
                }
                return <p key={i}>{para}</p>
              })}
            </div>

            {selected.gallery && selected.gallery.length > 0 && (
              <section className="mt-7 pt-3 border-t border-gray-200 dark:border-white/10">
                <h2 className="text-[12px] uppercase tracking-[0.16em] text-gray-500 dark:text-white/55 mb-2">
                  Photo gallery
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {selected.gallery.map((url, idx) => (
                    <div
                      key={url + idx}
                      className="flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-white/15 bg-black/5 dark:bg-white/5"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )
    }

    if (!isLoading && filtered.length === 0) {
      return (
        <div className="h-full bg-white dark:bg-[#060607] text-gray-900 dark:text-white flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111216] px-6 py-7 text-center">
            <div className="text-[28px] leading-none mb-2">📰</div>
            <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white">Blog Coming Soon</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-white/55">
              New posts are on the way. Check back soon for updates.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="h-full bg-white dark:bg-[#060607] text-gray-900 dark:text-white overflow-y-auto pb-24">
        <div className="px-4 pt-4">
          <div className="mt-1">
            <div className="text-[24px] font-bold leading-[0.95] text-gray-900 dark:text-white">News</div>
            <div className="text-[24px] font-bold leading-[0.95] text-gray-400 dark:text-white/40">March 16</div>
          </div>
        </div>

        {heroPost && (
          <div className="px-4 mt-7">
            <div className="text-[#ff2d55] text-[15px] font-semibold mb-3 uppercase tracking-wide">Top Stories</div>
            <button
              onClick={() => setSelected(heroPost)}
              className="w-full text-left rounded-[20px] overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111216]"
            >
              <div className="h-[210px] bg-gradient-to-br from-black/5 to-transparent dark:from-white/10 dark:to-white/0 relative overflow-hidden">
                {heroPost.imageUrl ? (
                  <>
                    {!imageLoadedIds.has(heroPost.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400/55 border-t-transparent animate-spin" />
                      </div>
                    )}
                    <img
                      src={heroPost.imageUrl}
                      alt={heroPost.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                        imageLoadedIds.has(heroPost.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                      draggable={false}
                      loading="lazy"
                      onLoad={() => {
                        setImageLoadedIds((prev) => {
                          const copy = new Set(prev)
                          copy.add(heroPost.id)
                          return copy
                        })
                      }}
                    />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-7xl">
                    {heroPost.emoji}
                  </div>
                )}
                <div className="absolute left-3 bottom-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-lg text-white">
                  {heroPost.emoji}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[11px] uppercase tracking-widest text-[#ff2d55] font-semibold">
                  {heroPost.category}
                </div>
                <div className="mt-1 text-[22px] leading-[1.1] font-semibold text-gray-900 dark:text-white">
                  {heroPost.title}
                </div>
                <div className="mt-2 text-[12px] text-gray-500 dark:text-white/55">
                  {heroPost.date} · {estimateReadTime(heroPost)}
                </div>
              </div>
            </button>
          </div>
        )}

        {trendingPosts.length > 0 && (
          <div className="px-4 mt-8">
            <div className="text-[15px] font-semibold text-[#ff9f0a] mb-3 uppercase tracking-wide">Trending Stories</div>
            <div className="space-y-2.5">
              {trendingPosts.map((post, idx) => (
                <button
                  key={post.id}
                  onClick={() => setSelected(post)}
                  className="w-full text-left rounded-2xl bg-gray-50 dark:bg-[#111216] border border-gray-200 dark:border-white/10 p-3.5"
                >
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff7a59] to-[#ff2d55] flex items-center justify-center text-[17px] font-bold text-white flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/65 mb-0.5">{post.category}</div>
                      <div className="text-[20px] leading-[1.12] font-semibold text-gray-900 dark:text-white">{post.title}</div>
                      <div className="text-[12px] text-gray-500 dark:text-white/50 mt-1">{post.date}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 mt-9">
          <div className="flex items-center justify-between">
            <div className="text-[28px] leading-none font-bold text-gray-900 dark:text-white">Favorites</div>
            <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/75">•••</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setSelected(null)
                }}
                className={`h-11 rounded-xl border text-[13px] font-medium ${
                  activeCategory === cat
                    ? 'bg-[#ff2d55]/20 border-[#ff2d55]/50 text-[#ff7a95]'
                    : 'bg-gray-100 dark:bg-[#16171c] border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {readerFavorites.length > 0 && (
          <div className="px-4 mt-10 pb-8">
            <div className="text-[28px] leading-none font-bold mb-4 text-gray-900 dark:text-white">Reader Favorites</div>
            <div className="space-y-3">
              {readerFavorites.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelected(post)}
                  className="w-full rounded-2xl bg-gray-50 dark:bg-[#111216] border border-gray-200 dark:border-white/10 overflow-hidden text-left"
                >
                  <div className="flex">
                    <div className="flex-1 p-3.5 min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-[#ff2d55] font-semibold">{post.category}</div>
                      <div className="mt-1 text-[20px] leading-[1.12] font-semibold line-clamp-3 text-gray-900 dark:text-white">{post.title}</div>
                      <div className="mt-2 text-[12px] text-gray-500 dark:text-white/50">{post.date}</div>
                    </div>
                    <div className="w-[34%] min-w-[108px] bg-gradient-to-br from-black/10 to-black/[0.02] dark:from-white/15 dark:to-white/5 relative overflow-hidden flex items-center justify-center">
                      {post.imageUrl ? (
                        <>
                          {!imageLoadedIds.has(post.id) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-400/55 border-t-transparent animate-spin" />
                            </div>
                          )}
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                              imageLoadedIds.has(post.id) ? 'opacity-100' : 'opacity-0'
                            }`}
                            draggable={false}
                            loading="lazy"
                            onLoad={() => {
                              setImageLoadedIds((prev) => {
                                const copy = new Set(prev)
                                copy.add(post.id)
                                return copy
                              })
                            }}
                          />
                        </>
                      ) : (
                        <div className="text-4xl">{post.emoji}</div>
                      )}
                      <div className="absolute left-2 bottom-2 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-sm text-white">
                        {post.emoji}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading && !selected) {
    return (
      <div className="h-full flex items-center justify-center mac-content-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-black/30 dark:border-white/40 border-t-transparent animate-spin" />
          <p className="text-xs text-gray-600 dark:text-white/70">Loading blog…</p>
        </div>
      </div>
    )
  }

  if (selected) {
    const related = POSTS
      .filter((post) => post.id !== selected.id && (activeCategory === 'All' || post.category === activeCategory))
      .slice(0, 4)

    return (
      <div className="flex h-full mac-content-bg">
        <div className="w-56 flex-shrink-0 border-r border-black/8 dark:border-white/10 finder-sidebar px-2 py-3">
          <button
            onClick={() => {
              setSelected(null)
              setActiveCategory('All')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg sidebar-text sidebar-hover"
          >
            <span>🗞️</span>
            Recent
          </button>
          <button
            onClick={() => {
              setSelected(null)
              setActiveCategory('All')
            }}
            className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs rounded-lg sidebar-text sidebar-hover"
          >
            <span>📚</span>
            All Posts
          </button>
          <div className="px-3 mt-5 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] sidebar-text">
            Categories
          </div>
          {categories.filter((cat) => cat !== 'All').map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setSelected(null)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg mb-0.5 ${
                activeCategory === cat ? 'sidebar-active' : 'sidebar-text sidebar-hover'
              }`}
            >
              <span>•</span>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="h-11 border-b border-black/8 dark:border-white/10 px-5 flex items-center gap-3 finder-sidebar">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-1.5 text-xs sidebar-text hover:opacity-80"
            >
              <FiArrowLeft size={13} />
              Back
            </button>
            <span className="text-xs sidebar-text">·</span>
            <span className="text-xs font-semibold text-[#ff2d55]">{selected.category}</span>
          </div>

          <div ref={desktopReaderRef} className="flex-1 overflow-y-auto">
            <article className="max-w-3xl mx-auto px-8 py-6">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#ff2d55] font-semibold">
                {selected.category}
              </div>
              <h1 className="mt-2 text-[42px] leading-[1.05] font-semibold tracking-tight text-gray-900 dark:text-white">
                {selected.title}
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-white/65">
                {selected.excerpt}
              </p>
              <div className="mt-4 text-xs text-gray-500 dark:text-white/45">
                {selected.date} · {estimateReadTime(selected)}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-white/55">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleLike(selected.id)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/5 dark:bg-white/10"
                >
                  <motion.span
                    animate={likingIds.has(selected.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-center"
                  >
                    {likedPostIds.has(selected.id) ? (
                      <HiHeart className="text-[#ff2d55]" size={11} />
                    ) : (
                      <FiHeart className="text-[#ff2d55]" size={11} />
                    )}
                  </motion.span>
                  <span>
                    {(blogRows.find((r) => r._id === selected.id)?.likeCount ?? 0) + (likingIds.has(selected.id) ? 1 : 0)} likes
                  </span>
                </motion.button>
                <span>
                  {(blogRows.find((r) => r._id === selected.id)?.viewCount ?? 0)} views
                </span>
                <button
                  onClick={() => selected && copyLinkForPost(selected)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] text-gray-600 dark:text-white/75"
                >
                  <span className="font-medium">
                    {copiedPostId === selected.id ? 'Link copied' : 'Copy link'}
                  </span>
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] overflow-hidden relative">
                {selected.imageUrl ? (
                  <>
                    {!imageLoadedIds.has(selected.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full border-2 border-gray-400/60 border-t-transparent animate-spin" />
                      </div>
                    )}
                    <img
                      src={selected.imageUrl}
                      alt={selected.title}
                      className={`h-[340px] w-full object-cover transition-opacity duration-200 ${
                        imageLoadedIds.has(selected.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                      draggable={false}
                      loading="lazy"
                      onLoad={() => {
                        setImageLoadedIds((prev) => {
                          const copy = new Set(prev)
                          copy.add(selected.id)
                          return copy
                        })
                      }}
                    />
                  </>
                ) : (
                  <div className="h-[340px] flex items-center justify-center text-[120px]">
                    {selected.emoji}
                  </div>
                )}
                <div className="absolute left-4 bottom-4 w-11 h-11 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-xl text-white">
                  {selected.emoji}
                </div>
              </div>

              <div className="mt-7 space-y-5 text-[18px] leading-[1.52] font-serif text-gray-800 dark:text-white/90">
                {selected.body.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.endsWith('**')) {
                    return (
                      <h3 key={i} className="font-semibold text-[24px] leading-tight mt-1 text-gray-900 dark:text-white">
                        {para.replace(/\*\*/g, '')}
                      </h3>
                    )
                  }
                  return <p key={i}>{para}</p>
                })}
              </div>

              {selected.gallery && selected.gallery.length > 0 && (
                <section className="mt-8 pt-4 border-t border-black/5 dark:border-white/10">
                  <h2 className="text-[13px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/50 mb-3">
                    Photo gallery
                  </h2>
                  <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {selected.gallery.map((url, idx) => (
                      <div
                        key={url + idx}
                        className="flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {related.length > 0 && (
              <div className="max-w-5xl mx-auto px-8 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  More in {activeCategory === 'All' ? 'News' : activeCategory}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {related.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelected(post)}
                      className="rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-left overflow-hidden hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="h-24 relative overflow-hidden flex items-center justify-center">
                        {post.imageUrl ? (
                          <>
                            {!imageLoadedIds.has(post.id) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400/55 border-t-transparent animate-spin" />
                              </div>
                            )}
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                                imageLoadedIds.has(post.id) ? 'opacity-100' : 'opacity-0'
                              }`}
                              draggable={false}
                              loading="lazy"
                              onLoad={() => {
                                setImageLoadedIds((prev) => {
                                  const copy = new Set(prev)
                                  copy.add(post.id)
                                  return copy
                                })
                              }}
                            />
                          </>
                        ) : (
                          <div className="text-4xl">{post.emoji}</div>
                        )}
                        <div className="absolute left-2 bottom-2 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-sm text-white">
                          {post.emoji}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-[10px] uppercase tracking-wide text-[#ff2d55] font-semibold">{post.category}</div>
                        <div className="mt-1 text-sm font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">{post.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const categoryMode = activeCategory !== 'All'
  const topStories = filtered.slice(0, 4)
  const bottomStories = filtered.slice(4, 10)
  const allPostsList = filtered
  const storiesLabel = `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'}`

  return (
    <div className="flex h-full mac-content-bg">
      <div className="w-56 flex-shrink-0 border-r border-black/8 dark:border-white/10 finder-sidebar px-2 py-3">
        <div className="px-2 mb-2">
          <div className="h-8 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.05] dark:bg-white/[0.05] px-2.5 flex items-center gap-2">
            <FiSearch size={12} className="sidebar-text" />
            <span className="text-[11px] sidebar-text">Search</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <button
            onClick={() => {
              setActiveCategory('All')
              setSelected(null)
              setDesktopFeed('recent')
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${
              activeCategory === 'All' && desktopFeed === 'recent' ? 'sidebar-active' : 'sidebar-text sidebar-hover'
            }`}
          >
            <span>🗞️</span>
            Recent
          </button>
          <button
            onClick={() => {
              setActiveCategory('All')
              setSelected(null)
              setDesktopFeed('all')
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${
              activeCategory === 'All' && desktopFeed === 'all' ? 'sidebar-active' : 'sidebar-text sidebar-hover'
            }`}
          >
            <span>📚</span>
            All Posts
          </button>
        </div>

        <div className="px-3 mt-5 mb-2">
          <span className="sidebar-text text-[10px] font-semibold uppercase tracking-widest">Categories</span>
        </div>
        {categories.filter((cat) => cat !== 'All').map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat)
              setSelected(null)
              setDesktopFeed('recent')
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors rounded-lg mb-0.5 ${
              activeCategory === cat ? 'sidebar-active' : 'sidebar-text sidebar-hover'
            }`}
          >
            <span className="text-[#ff2d55]">+</span>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="sticky top-0 z-10 h-11 px-5 finder-sidebar border-b border-black/8 dark:border-white/10 flex items-center justify-between">
          <div className="text-xs sidebar-text">
            {categoryMode ? 'Category' : desktopFeed === 'all' ? 'All Posts' : 'Recent'}
          </div>
          <div className="text-xs sidebar-text">{storiesLabel}</div>
        </div>

        {!isLoading && filtered.length === 0 ? (
          <div className="h-[calc(100%-44px)] flex items-center justify-center px-8">
            <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-6 text-center">
              <div className="text-2xl mb-2">📰</div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {categoryMode ? `${activeCategory} Coming Soon` : 'Blog Coming Soon'}
              </div>
              <div className="text-xs mt-1 text-gray-500 dark:text-white/50">
                {categoryMode
                  ? `I am still curating stories for ${activeCategory}.`
                  : 'Posts will appear here once I publish them.'}
              </div>
            </div>
          </div>
        ) : !categoryMode && desktopFeed === 'all' ? (
          <div className="divide-y divide-black/5 dark:divide-white/8">
            {allPostsList.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelected(post)}
                className="w-full text-left px-6 py-4 hover:bg-black/5 dark:hover:bg-white/6 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {post.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-[#ff2d55]">{post.category}</div>
                    <div className="mt-1 text-[16px] font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">
                      {post.title}
                    </div>
                    <div className="mt-1 text-[12px] text-gray-600 dark:text-white/55 line-clamp-2">
                      {post.excerpt}
                    </div>
                    <div className="mt-2 text-[11px] text-gray-500 dark:text-white/45">
                      {post.date} · {estimateReadTime(post)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-7 py-6 space-y-7">
            {!categoryMode ? (
              <>
                <div>
                  <div className="text-[42px] font-semibold leading-[0.95] tracking-tight text-gray-900 dark:text-white">News</div>
                  <div className="text-[42px] font-semibold leading-[0.95] tracking-tight text-gray-400 dark:text-white/35">
                    {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {topStories.length > 0 && (
                  <section>
                    <h2 className="text-[#ff2d55] text-[28px] font-semibold mb-3">Top Stories</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {topStories.map((post, idx) => (
                        <button
                          key={post.id}
                          onClick={() => setSelected(post)}
                          className={`text-left rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors ${
                            idx === 0 ? 'col-span-2' : ''
                          }`}
                        >
                          <div className={`flex ${idx === 0 ? 'h-[250px]' : 'h-[180px]'}`}>
                            <div className={`${idx === 0 ? 'w-[58%]' : 'w-[52%]'} border-r border-black/10 dark:border-white/10 relative overflow-hidden`}>
                              {post.imageUrl ? (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  draggable={false}
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center text-7xl">
                                  {post.emoji}
                                </div>
                              )}
                              <div className="absolute left-3 bottom-3 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-lg text-white">
                                {post.emoji}
                              </div>
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                              <div className="text-[10px] uppercase tracking-wide font-semibold text-[#ff2d55]">
                                {post.category}
                              </div>
                              <div className={`mt-1 font-semibold text-gray-900 dark:text-white ${idx === 0 ? 'text-[30px] leading-[1.04]' : 'text-[21px] leading-[1.1]'}`}>
                                {post.title}
                              </div>
                              <div className="mt-auto pt-3 text-[11px] text-gray-500 dark:text-white/45">
                                {post.date} · {estimateReadTime(post)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {bottomStories.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">More Stories</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {bottomStories.map((post) => (
                        <button
                          key={post.id}
                          onClick={() => setSelected(post)}
                          className="rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-left overflow-hidden hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="h-28 relative overflow-hidden border-b border-black/10 dark:border-white/10">
                            {post.imageUrl ? (
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                draggable={false}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center text-5xl">
                                {post.emoji}
                              </div>
                            )}
                            <div className="absolute left-2 bottom-2 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-sm text-white">
                              {post.emoji}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-[10px] uppercase tracking-wide font-semibold text-[#ff2d55]">{post.category}</div>
                            <div className="mt-1 text-sm font-semibold leading-snug line-clamp-2 text-gray-900 dark:text-white">{post.title}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <>
                <div className="flex items-end justify-between">
                  <h1 className="text-[52px] leading-[0.95] font-semibold tracking-tight text-gray-900 dark:text-white">
                    {activeCategory}
                  </h1>
                  <div className="text-xs sidebar-text pb-2">
                    {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
                  </div>
                </div>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">For You</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {filtered.map((post, idx) => (
                      <button
                        key={post.id}
                        onClick={() => setSelected(post)}
                        className={`text-left rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors ${
                          idx === 0 ? 'col-span-2 row-span-2' : ''
                        }`}
                      >
                        <div className={`${idx === 0 ? 'h-[220px]' : 'h-[120px]'} relative overflow-hidden border-b border-black/10 dark:border-white/10`}>
                          {post.imageUrl ? (
                            <>
                              {!imageLoadedIds.has(post.id) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-400/55 border-t-transparent animate-spin" />
                                </div>
                              )}
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                                  imageLoadedIds.has(post.id) ? 'opacity-100' : 'opacity-0'
                                }`}
                                draggable={false}
                                loading="lazy"
                                onLoad={() => {
                                  setImageLoadedIds((prev) => {
                                    const copy = new Set(prev)
                                    copy.add(post.id)
                                    return copy
                                  })
                                }}
                              />
                            </>
                          ) : (
                            <div className="h-full flex items-center justify-center text-6xl">
                              {post.emoji}
                            </div>
                          )}
                          <div className="absolute left-2 bottom-2 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-sm text-white">
                            {post.emoji}
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="text-[10px] uppercase tracking-wide font-semibold text-[#ff2d55]">{post.category}</div>
                          <div className={`mt-1 font-semibold leading-snug text-gray-900 dark:text-white ${idx === 0 ? 'text-[23px] line-clamp-3' : 'text-sm line-clamp-2'}`}>
                            {post.title}
                          </div>
                          <div className="mt-1 text-[11px] text-gray-500 dark:text-white/45">{post.date}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
