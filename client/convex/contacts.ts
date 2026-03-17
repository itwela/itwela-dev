import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      type: v.string(),
      size: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('mailResponses', {
      name: args.name,
      email: args.email,
      subject: args.subject,
      message: args.message,
      attachments: args.attachments ?? [],
      createdAt: Date.now(),
    })
    return id
  },
})
