import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getCardLayout = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query('siteSettings')
      .withIndex('by_key', (q) => q.eq('key', 'cardLayout'))
      .first()
    return (setting?.cardLayout ?? 'scattered') as 'scattered' | 'organized'
  },
})

export const setCardLayout = mutation({
  args: { layout: v.union(v.literal('scattered'), v.literal('organized')) },
  handler: async (ctx, { layout }) => {
    const existing = await ctx.db
      .query('siteSettings')
      .withIndex('by_key', (q) => q.eq('key', 'cardLayout'))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, { cardLayout: layout })
    } else {
      await ctx.db.insert('siteSettings', { key: 'cardLayout', cardLayout: layout })
    }
  },
})
