import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),
  mailResponses: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    attachments: v.array(v.object({
      name: v.string(),
      type: v.string(),
      size: v.number(),
    })),
    createdAt: v.number(),
  }).index('by_createdAt', ['createdAt']),
  projects: defineTable({
    cardType: v.union(
      v.literal('project'),
      v.literal('achievement'),
      v.literal('role'),
      v.literal('skill'),
      v.literal('about'),
      v.literal('social'),
      v.literal('education'),
      v.literal('resume'),
      v.literal('client'),
    ),
    title: v.string(),
    description: v.string(),
    longDescription: v.string(),
    tags: v.array(v.string()),
    body: v.optional(v.string()),
    highlights: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    period: v.optional(v.string()),
    links: v.optional(v.array(v.object({ name: v.string(), url: v.string(), icon: v.string() }))),
    orientation: v.optional(v.union(v.literal('portrait'), v.literal('landscape'), v.literal('square'), v.literal('phone'))),
    imageUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  }).index('by_order', ['order']),
  music: defineTable({
    title: v.string(),
    artist: v.string(),
    album: v.optional(v.string()),
    /** AWS (or any) URL to the audio file */
    audioUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    order: v.number(),
    likeCount: v.optional(v.number()),
    playCount: v.optional(v.number()),
  }).index('by_order', ['order']),
  playlists: defineTable({
    name: v.string(),
    /** Track IDs in playback order */
    trackIds: v.array(v.id('music')),
    order: v.number(),
  }).index('by_order', ['order']),
  blogCategories: defineTable({
    name: v.string(),
    slug: v.string(),
    order: v.number(),
  })
    .index('by_order', ['order'])
    .index('by_slug', ['slug']),
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    body: v.string(),
    categoryId: v.optional(v.id('blogCategories')),
    emoji: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    publishedAt: v.number(),
    featured: v.boolean(),
    order: v.number(),
    likeCount: v.optional(v.number()),
    viewCount: v.optional(v.number()),
  })
    .index('by_order', ['order'])
    .index('by_slug', ['slug']),
  photos: defineTable({
    title: v.string(),
    imageUrl: v.string(),
    category: v.union(v.literal('software'), v.literal('art'), v.literal('memories')),
    description: v.optional(v.string()),
    order: v.number(),
    likeCount: v.optional(v.number()),
    viewCount: v.optional(v.number()),
  }).index('by_category', ['category']),
  resume: defineTable({
    name: v.string(),
    citizenship: v.string(),
    email: v.string(),
    linkedin: v.string(),
    github: v.string(),
    downloadUrl: v.optional(v.string()),
    education: v.array(v.object({
      school: v.string(),
      degree: v.string(),
      location: v.string(),
      period: v.string(),
      coursework: v.optional(v.string()),
    })),
    experience: v.array(v.object({
      title: v.string(),
      company: v.string(),
      location: v.string(),
      period: v.string(),
      bullets: v.array(v.string()),
    })),
    projects: v.array(v.object({
      title: v.string(),
      tech: v.string(),
      bullets: v.array(v.string()),
      url: v.optional(v.string()),
    })),
    skills: v.array(v.object({
      group: v.string(),
      items: v.string(),
    })),
  }),
  siteSettings: defineTable({
    key: v.string(),
    // cardLayout: 'scattered' | 'organized'
    cardLayout: v.union(v.literal('scattered'), v.literal('organized')),
  }).index('by_key', ['key']),
})
