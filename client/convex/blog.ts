import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('blogCategories').withIndex('by_order').order('asc').collect()
  },
})

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('blogPosts').withIndex('by_order').order('asc').collect()
  },
})

export const getPostsWithCategories = query({
  args: {},
  handler: async (ctx) => {
    const [posts, categories] = await Promise.all([
      ctx.db.query('blogPosts').withIndex('by_order').order('asc').collect(),
      ctx.db.query('blogCategories').withIndex('by_order').order('asc').collect(),
    ])

    const categoryMap = new Map(categories.map((cat) => [String(cat._id), cat]))

    return posts.map((post) => {
      const category = post.categoryId ? categoryMap.get(String(post.categoryId)) : null
      return {
        ...post,
        categoryName: category?.name ?? 'Uncategorized',
        categorySlug: category?.slug ?? 'uncategorized',
      }
    })
  },
})

export const createCategory = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const cleanName = name.trim()
    if (!cleanName) throw new Error('Category name is required.')

    const slug = toSlug(cleanName)
    if (!slug) throw new Error('Category name must include letters or numbers.')

    const existing = await ctx.db
      .query('blogCategories')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first()
    if (existing) throw new Error('A category with this name already exists.')

    const all = await ctx.db.query('blogCategories').collect()
    return await ctx.db.insert('blogCategories', {
      name: cleanName,
      slug,
      order: all.length,
    })
  },
})

export const updateCategory = mutation({
  args: {
    id: v.id('blogCategories'),
    name: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, name, order }) => {
    const cleanName = name.trim()
    if (!cleanName) throw new Error('Category name is required.')
    const slug = toSlug(cleanName)
    if (!slug) throw new Error('Category name must include letters or numbers.')

    const existing = await ctx.db
      .query('blogCategories')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first()
    if (existing && String(existing._id) !== String(id)) {
      throw new Error('A category with this name already exists.')
    }

    await ctx.db.patch(id, {
      name: cleanName,
      slug,
      order,
    })
  },
})

export const deleteCategory = mutation({
  args: {
    id: v.id('blogCategories'),
  },
  handler: async (ctx, { id }) => {
    const posts = await ctx.db.query('blogPosts').collect()
    const impacted = posts.filter((post) => post.categoryId && String(post.categoryId) === String(id))
    for (const post of impacted) {
      await ctx.db.patch(post._id, { categoryId: undefined })
    }
    await ctx.db.delete(id)
  },
})

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    excerpt: v.string(),
    body: v.string(),
    categoryId: v.optional(v.id('blogCategories')),
    emoji: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    publishedAt: v.number(),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim()
    if (!title) throw new Error('Title is required.')
    const computedSlug = toSlug(args.slug?.trim() || title)
    if (!computedSlug) throw new Error('Invalid slug.')

    const existing = await ctx.db
      .query('blogPosts')
      .withIndex('by_slug', (q) => q.eq('slug', computedSlug))
      .first()
    if (existing) throw new Error('A post with this slug already exists.')

    return await ctx.db.insert('blogPosts', {
      title,
      slug: computedSlug,
      excerpt: args.excerpt.trim(),
      body: args.body.trim(),
      categoryId: args.categoryId,
      emoji: args.emoji?.trim() || undefined,
      imageUrl: args.imageUrl?.trim() || undefined,
      gallery: args.gallery ?? undefined,
      publishedAt: args.publishedAt,
      featured: args.featured,
      order: args.order,
    })
  },
})

export const updatePost = mutation({
  args: {
    id: v.id('blogPosts'),
    title: v.string(),
    slug: v.optional(v.string()),
    excerpt: v.string(),
    body: v.string(),
    categoryId: v.optional(v.id('blogCategories')),
    emoji: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    publishedAt: v.number(),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...args }) => {
    const title = args.title.trim()
    if (!title) throw new Error('Title is required.')
    const computedSlug = toSlug(args.slug?.trim() || title)
    if (!computedSlug) throw new Error('Invalid slug.')

    const existing = await ctx.db
      .query('blogPosts')
      .withIndex('by_slug', (q) => q.eq('slug', computedSlug))
      .first()
    if (existing && String(existing._id) !== String(id)) {
      throw new Error('A post with this slug already exists.')
    }

    await ctx.db.patch(id, {
      title,
      slug: computedSlug,
      excerpt: args.excerpt.trim(),
      body: args.body.trim(),
      categoryId: args.categoryId,
      emoji: args.emoji?.trim() || undefined,
      imageUrl: args.imageUrl?.trim() || undefined,
      gallery: args.gallery ?? undefined,
      publishedAt: args.publishedAt,
      featured: args.featured,
      order: args.order,
    })
  },
})

export const deletePost = mutation({
  args: { id: v.id('blogPosts') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})

export const likePost = mutation({
  args: { id: v.id('blogPosts') },
  handler: async (ctx, { id }) => {
    const post = await ctx.db.get(id)
    if (!post) return
    const likeCount = (post as any).likeCount ?? 0
    await ctx.db.patch(id, { likeCount: likeCount + 1 })
  },
})

export const unlikePost = mutation({
  args: { id: v.id('blogPosts') },
  handler: async (ctx, { id }) => {
    const post = await ctx.db.get(id)
    if (!post) return
    const likeCount = (post as any).likeCount ?? 0
    await ctx.db.patch(id, { likeCount: Math.max(0, likeCount - 1) })
  },
})

export const viewPost = mutation({
  args: { id: v.id('blogPosts') },
  handler: async (ctx, { id }) => {
    const post = await ctx.db.get(id)
    if (!post) return
    const viewCount = (post as any).viewCount ?? 0
    await ctx.db.patch(id, { viewCount: viewCount + 1 })
  },
})
