import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('playlists').withIndex('by_order').order('asc').collect()
  },
})

/** Returns tracks for a playlist in playlist order (with id for frontend). */
export const getTracks = query({
  args: { playlistId: v.id('playlists') },
  handler: async (ctx, { playlistId }) => {
    const playlist = await ctx.db.get(playlistId)
    if (!playlist) return []
    const tracks = []
    for (const trackId of playlist.trackIds) {
      const doc = await ctx.db.get(trackId)
      if (doc) tracks.push({ ...doc, id: doc._id })
    }
    return tracks
  },
})

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const count = await ctx.db.query('playlists').collect()
    return await ctx.db.insert('playlists', {
      name,
      trackIds: [],
      order: count.length,
    })
  },
})

export const addTrack = mutation({
  args: { playlistId: v.id('playlists'), trackId: v.id('music') },
  handler: async (ctx, { playlistId, trackId }) => {
    const playlist = await ctx.db.get(playlistId)
    if (!playlist) throw new Error('Playlist not found')
    if (playlist.trackIds.includes(trackId)) return
    await ctx.db.patch(playlistId, {
      trackIds: [...playlist.trackIds, trackId],
    })
  },
})

export const removeTrack = mutation({
  args: { playlistId: v.id('playlists'), trackId: v.id('music') },
  handler: async (ctx, { playlistId, trackId }) => {
    const playlist = await ctx.db.get(playlistId)
    if (!playlist) throw new Error('Playlist not found')
    await ctx.db.patch(playlistId, {
      trackIds: playlist.trackIds.filter((id) => id !== trackId),
    })
  },
})

export const reorder = mutation({
  args: { playlistId: v.id('playlists'), trackIds: v.array(v.id('music')) },
  handler: async (ctx, { playlistId, trackIds }) => {
    await ctx.db.patch(playlistId, { trackIds })
  },
})

export const rename = mutation({
  args: { playlistId: v.id('playlists'), name: v.string() },
  handler: async (ctx, { playlistId, name }) => {
    await ctx.db.patch(playlistId, { name })
  },
})

export const remove = mutation({
  args: { playlistId: v.id('playlists') },
  handler: async (ctx, { playlistId }) => {
    await ctx.db.delete(playlistId)
  },
})
