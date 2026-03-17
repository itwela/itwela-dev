import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('music').withIndex('by_order').order('asc').collect()
  },
})

export const addTrack = mutation({
  args: {
    title: v.string(),
    artist: v.string(),
    album: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('music', args)
  },
})

export const likeTrack = mutation({
  args: { id: v.id('music') },
  handler: async (ctx, { id }) => {
    const track = await ctx.db.get(id)
    if (!track) return
    const likeCount = (track as any).likeCount ?? 0
    await ctx.db.patch(id, { likeCount: likeCount + 1 })
  },
})

export const unlikeTrack = mutation({
  args: { id: v.id('music') },
  handler: async (ctx, { id }) => {
    const track = await ctx.db.get(id)
    if (!track) return
    const likeCount = (track as any).likeCount ?? 0
    await ctx.db.patch(id, { likeCount: Math.max(0, likeCount - 1) })
  },
})

export const recordPlay = mutation({
  args: { id: v.id('music') },
  handler: async (ctx, { id }) => {
    const track = await ctx.db.get(id)
    if (!track) return
    const playCount = (track as any).playCount ?? 0
    await ctx.db.patch(id, { playCount: playCount + 1 })
  },
})
