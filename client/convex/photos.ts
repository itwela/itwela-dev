import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('photos').collect()
  },
})

export const getByCategory = query({
  args: { category: v.union(v.literal('software'), v.literal('art'), v.literal('memories')) },
  handler: async (ctx, { category }) => {
    return await ctx.db
      .query('photos')
      .withIndex('by_category', (q) => q.eq('category', category))
      .collect()
  },
})

export const addPhoto = mutation({
  args: {
    title: v.string(),
    imageUrl: v.string(),
    category: v.union(v.literal('software'), v.literal('art'), v.literal('memories')),
    description: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('photos', args)
  },
})

export const likePhoto = mutation({
  args: { id: v.id('photos') },
  handler: async (ctx, { id }) => {
    const photo = await ctx.db.get(id)
    if (!photo) return
    const likeCount = (photo as any).likeCount ?? 0
    await ctx.db.patch(id, { likeCount: likeCount + 1 })
  },
})

export const unlikePhoto = mutation({
  args: { id: v.id('photos') },
  handler: async (ctx, { id }) => {
    const photo = await ctx.db.get(id)
    if (!photo) return
    const likeCount = (photo as any).likeCount ?? 0
    await ctx.db.patch(id, { likeCount: Math.max(0, likeCount - 1) })
  },
})

export const viewPhoto = mutation({
  args: { id: v.id('photos') },
  handler: async (ctx, { id }) => {
    const photo = await ctx.db.get(id)
    if (!photo) return
    const viewCount = (photo as any).viewCount ?? 0
    await ctx.db.patch(id, { viewCount: viewCount + 1 })
  },
})
